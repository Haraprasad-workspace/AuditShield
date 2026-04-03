import { supabase } from "../supabase.js";

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

/* ─────────────────────────────────────────────
    📡 Register webhook on GitHub dynamically
───────────────────────────────────────────── */
async function registerGithubWebhook(repoFullName, userToken) {
  const url = `https://api.github.com/repos/${repoFullName}/hooks`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "web",
      active: true,
      events: ["push"],
      config: {
        url: WEBHOOK_URL,
        content_type: "json",
        secret: WEBHOOK_SECRET,
        insecure_ssl: "0",
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    // Surface the specific GitHub error (like "Not Found" or "Validation Failed")
    let friendlyError = data.message;
    
    // Specifically handle the 404/Not Found which usually means missing scopes
    if (response.status === 404) {
      friendlyError = "Repository not found. Ensure the path is correct and your token has 'repo' and 'admin:repo_hook' scopes.";
    } else if (data.errors) {
      friendlyError = `${data.message}: ${data.errors[0].message}`;
    }

    throw new Error(friendlyError);
  }

  return data;
}

/* ─────────────────────────────────────────────
    ❌ Delete webhook from GitHub
───────────────────────────────────────────── */
async function deleteGithubWebhook(repoFullName, hookId, userToken) {
  const url = `https://api.github.com/repos/${repoFullName}/hooks/${hookId}`;
  
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.message || "Could not remove webhook from GitHub.");
  }

  return true;
}

/* ─────────────────────────────────────────────
    🔗 POST /repo/connect
───────────────────────────────────────────── */
export async function connectRepo(req, res) {
  try {
    const { repo, token } = req.body;

    if (!repo || !token) {
      return res.status(400).json({ error: "Repository name and Access Token are required." });
    }

    // Check if already connected
    const { data: existing, error: checkError } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error("Database connection error: " + checkError.message);
    }

    if (existing) {
      return res.status(409).json({ error: `The repository '${repo}' is already being monitored by AuditShield.` });
    }

    // Register webhook on GitHub - Errors here will now be descriptive
    const hook = await registerGithubWebhook(repo, token);

    // Save to Supabase
    const { error: insertError } = await supabase.from("connected_repos").insert([
      {
        repo,
        hook_id: hook.id,
        token,
        connected_at: new Date().toISOString(),
        active: true,
      },
    ]);

    if (insertError) {
      throw new Error("Failed to save connection: " + insertError.message);
    }

    res.status(200).json({
      message: `Perimeter Guard active! Webhook successfully linked to ${repo}.`,
      hook_id: hook.id,
    });

  } catch (err) {
    // Send the detailed error message back to the frontend
    res.status(500).json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────
    🔌 POST /repo/disconnect
───────────────────────────────────────────── */
export async function disconnectRepo(req, res) {
  try {
    const { repo } = req.body;

    if (!repo) {
      return res.status(400).json({ error: "Repository name is required for disconnection." });
    }

    // Get hook details
    const { data, error: fetchError } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (fetchError || !data) {
      return res.status(404).json({ error: "Repository connection not found in our records." });
    }

    // Delete webhook from GitHub
    await deleteGithubWebhook(repo, data.hook_id, data.token);

    // Remove from Supabase
    const { error: deleteError } = await supabase
      .from("connected_repos")
      .delete()
      .eq("repo", repo);

    if (deleteError) {
      throw new Error("Failed to remove record: " + deleteError.message);
    }

    res.status(200).json({ message: `Successfully disconnected and removed monitoring for ${repo}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────
    📋 GET /repo/list
───────────────────────────────────────────── */
export async function listRepos(req, res) {
  try {
    const { data, error } = await supabase
      .from("connected_repos")
      .select("repo, connected_at, active, hook_id");

    if (error) {
      throw new Error("Could not retrieve repository list: " + error.message);
    }

    res.status(200).json({ 
      message: "Repository list synchronized.",
      repos: data 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}