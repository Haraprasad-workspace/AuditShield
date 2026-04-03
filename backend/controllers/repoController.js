import { supabase } from "../supabase.js";

const WEBHOOK_URL = process.env.WEBHOOK_URL; // e.g. https://your-server.com/github-webhook
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET; // any random string

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
      events: ["push"],           // only push events
      config: {
        url: WEBHOOK_URL,          // your server URL
        content_type: "json",
        secret: WEBHOOK_SECRET,    // for signature verification
        insecure_ssl: "0",
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to register webhook");
  }

  return data; // contains hook id, url, etc.
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

  return response.ok;
}

/* ─────────────────────────────────────────────
   🔗 POST /repo/connect
   Body: { repo: "username/repo-name", token: "ghp_xxx" }
───────────────────────────────────────────── */
export async function connectRepo(req, res) {
  try {
    const { repo, token } = req.body;

    if (!repo || !token) {
      return res.status(400).json({ error: "repo and token are required" });
    }

    // Check if already connected
    const { data: existing } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (existing) {
      return res.status(409).json({ error: "Repo already connected" });
    }

    // Register webhook on GitHub
    const hook = await registerGithubWebhook(repo, token);

    // Save to Supabase
    const { error } = await supabase.from("connected_repos").insert([
      {
        repo,
        hook_id: hook.id,
        token,                    // store encrypted in production!
        connected_at: new Date().toISOString(),
        active: true,
      },
    ]);

    if (error) throw new Error(error.message);

    console.log(`✅ Webhook registered for ${repo} — hook id: ${hook.id}`);
    res.status(200).json({
      message: `Webhook successfully connected to ${repo}`,
      hook_id: hook.id,
    });
  } catch (err) {
    console.error("❌ connectRepo error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────
   🔌 POST /repo/disconnect
   Body: { repo: "username/repo-name" }
───────────────────────────────────────────── */
export async function disconnectRepo(req, res) {
  try {
    const { repo } = req.body;

    if (!repo) {
      return res.status(400).json({ error: "repo is required" });
    }

    // Get hook details from Supabase
    const { data, error: fetchError } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (fetchError || !data) {
      return res.status(404).json({ error: "Repo not found in connected repos" });
    }

    // Delete webhook from GitHub
    await deleteGithubWebhook(repo, data.hook_id, data.token);

    // Remove from Supabase
    await supabase.from("connected_repos").delete().eq("repo", repo);

    console.log(`🔌 Webhook disconnected for ${repo}`);
    res.status(200).json({ message: `Webhook disconnected from ${repo}` });
  } catch (err) {
    console.error("❌ disconnectRepo error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────
   📋 GET /repo/list
   Returns all connected repos
───────────────────────────────────────────── */
export async function listRepos(req, res) {
  try {
    const { data, error } = await supabase
      .from("connected_repos")
      .select("repo, connected_at, active, hook_id");

    if (error) throw new Error(error.message);

    res.status(200).json({ repos: data });
  } catch (err) {
    console.error("❌ listRepos error:", err.message);
    res.status(500).json({ error: err.message });
  }
}