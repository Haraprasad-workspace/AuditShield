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
    let friendlyError = data.message;

    if (response.status === 404) {
      friendlyError =
        "Repository not found. Ensure correct path and token scopes.";
    } else if (data.errors) {
      friendlyError = `${data.message}: ${data.errors[0].message}`;
    }

    console.error("Webhook registration failed:", friendlyError);
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
    console.error("Webhook delete failed:", errData.message);
    throw new Error(errData.message || "Could not remove webhook.");
  }

  return true;
}

/* ─────────────────────────────────────────────
    🔗 POST /api/repo/connect
───────────────────────────────────────────── */
export async function connectRepo(req, res) {
  try {
    const { repo, token } = req.body;

    if (!repo || !token) {
      return res
        .status(400)
        .json({ error: "Repository name and token are required." });
    }

    // Check if already connected
    const { data: existing, error: checkError } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("DB check error:", checkError.message);
      throw new Error("Database error");
    }

    if (existing) {
      return res.status(409).json({
        error: `Repository '${repo}' already connected.`,
      });
    }

    // Register webhook
    const hook = await registerGithubWebhook(repo, token);

    // Save to DB
    const { error: insertError } = await supabase
      .from("connected_repos")
      .insert([
        {
          repo,
          hook_id: hook.id,
          token,
          connected_at: new Date().toISOString(),
          active: true,
        },
      ]);

    if (insertError) {
      console.error("DB insert error:", insertError.message);
      throw new Error("Failed to save connection");
    }

    res.status(200).json({
      message: `Webhook connected to ${repo}`,
      hook_id: hook.id,
    });
  } catch (err) {
    console.error("Connect repo error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────
    🔌 POST /api/repo/disconnect
───────────────────────────────────────────── */
export async function disconnectRepo(req, res) {
  try {
    const { repo } = req.body;

    if (!repo) {
      return res
        .status(400)
        .json({ error: "Repository name is required." });
    }

    // Fetch repo
    const { data, error: fetchError } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (fetchError || !data) {
      return res
        .status(404)
        .json({ error: "Repository connection not found." });
    }

    // Try deleting webhook (non-blocking)
    try {
      await deleteGithubWebhook(repo, data.hook_id, data.token);
    } catch (err) {
      console.warn("Webhook delete failed, continuing cleanup");
    }

    // Delete from DB
    const { error: deleteError } = await supabase
      .from("connected_repos")
      .delete()
      .eq("repo", repo);

    if (deleteError) {
      console.error("DB delete error:", deleteError.message);
      throw new Error("Failed to remove record");
    }

    res.status(200).json({
      message: `Disconnected ${repo}`,
    });
  } catch (err) {
    console.error("Disconnect repo error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────
    📋 GET /api/repo/list
───────────────────────────────────────────── */
export async function listRepos(req, res) {
  try {
    const { data, error } = await supabase
      .from("connected_repos")
      .select("repo, connected_at, active, hook_id");

    if (error) {
      console.error("DB list error:", error.message);
      throw new Error("Could not retrieve repositories");
    }

    res.status(200).json({
      repos: data,
    });
  } catch (err) {
    console.error("List repos error:", err.message);
    res.status(500).json({ error: err.message });
  }
}