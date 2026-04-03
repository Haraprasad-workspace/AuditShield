import { supabase } from "../supabase.js";

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

// ✅ Startup checks
console.log("🔧 repoController loaded");
console.log("🌐 WEBHOOK_URL:", WEBHOOK_URL || "❌ MISSING — check .env");
console.log("🔐 WEBHOOK_SECRET:", WEBHOOK_SECRET ? "✅ loaded" : "❌ MISSING — check .env");

/* ─────────────────────────────────────────────
   📡 Register webhook on GitHub dynamically
───────────────────────────────────────────── */
async function registerGithubWebhook(repoFullName, userToken) {
  const url = `https://api.github.com/repos/${repoFullName}/hooks`;
  console.log(`\n📡 Registering webhook for repo: ${repoFullName}`);
  console.log(`📡 Webhook target URL: ${WEBHOOK_URL}`);
  console.log(`🔑 Using token: ${userToken?.slice(0, 8)}...`);

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

  console.log(`📡 GitHub API response status: ${response.status}`);
  const data = await response.json();
  console.log(`📡 GitHub API response body:`, JSON.stringify(data, null, 2));

  if (!response.ok) {
    console.error(`❌ Failed to register webhook:`, data.message);
    throw new Error(data.message || "Failed to register webhook");
  }

  console.log(`✅ Webhook registered — hook id: ${data.id}`);
  return data;
}

/* ─────────────────────────────────────────────
   ❌ Delete webhook from GitHub
───────────────────────────────────────────── */
async function deleteGithubWebhook(repoFullName, hookId, userToken) {
  const url = `https://api.github.com/repos/${repoFullName}/hooks/${hookId}`;
  console.log(`\n🗑️  Deleting webhook — repo: ${repoFullName}, hook id: ${hookId}`);
  console.log(`🔑 Using token: ${userToken?.slice(0, 8)}...`);

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${userToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  console.log(`🗑️  GitHub DELETE response status: ${response.status}`);

  if (!response.ok) {
    const errBody = await response.text();
    console.error(`❌ Failed to delete webhook:`, errBody);
  } else {
    console.log(`✅ Webhook deleted from GitHub`);
  }

  return response.ok;
}

/* ─────────────────────────────────────────────
   🔗 POST /repo/connect
───────────────────────────────────────────── */
export async function connectRepo(req, res) {
  console.log(`\n🔗 POST /repo/connect called`);
  console.log(`📦 Request body:`, JSON.stringify(req.body, null, 2));

  try {
    const { repo, token } = req.body;

    if (!repo || !token) {
      console.warn(`⚠️  Missing fields — repo: ${repo}, token: ${token ? "provided" : "missing"}`);
      return res.status(400).json({ error: "repo and token are required" });
    }

    console.log(`🔍 Checking if repo already connected: ${repo}`);

    // Check if already connected
    const { data: existing, error: checkError } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = row not found, which is fine
      console.error(`❌ Supabase check error:`, checkError.message);
      throw new Error(checkError.message);
    }

    if (existing) {
      console.warn(`⚠️  Repo already connected: ${repo} — hook id: ${existing.hook_id}`);
      return res.status(409).json({ error: "Repo already connected" });
    }

    console.log(`✅ Repo not yet connected, proceeding...`);

    // Register webhook on GitHub
    const hook = await registerGithubWebhook(repo, token);

    console.log(`💾 Saving to Supabase — repo: ${repo}, hook_id: ${hook.id}`);

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
      console.error(`❌ Supabase insert error:`, insertError.message);
      throw new Error(insertError.message);
    }

    console.log(`✅ Saved to Supabase successfully`);
    console.log(`🎉 Repo connected: ${repo} — hook id: ${hook.id}\n`);

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
───────────────────────────────────────────── */
export async function disconnectRepo(req, res) {
  console.log(`\n🔌 POST /repo/disconnect called`);
  console.log(`📦 Request body:`, JSON.stringify(req.body, null, 2));

  try {
    const { repo } = req.body;

    if (!repo) {
      console.warn(`⚠️  Missing repo in request body`);
      return res.status(400).json({ error: "repo is required" });
    }

    console.log(`🔍 Looking up repo in Supabase: ${repo}`);

    // Get hook details from Supabase
    const { data, error: fetchError } = await supabase
      .from("connected_repos")
      .select("*")
      .eq("repo", repo)
      .single();

    if (fetchError) {
      console.error(`❌ Supabase fetch error:`, fetchError.message);
    }

    if (fetchError || !data) {
      console.warn(`⚠️  Repo not found in Supabase: ${repo}`);
      return res.status(404).json({ error: "Repo not found in connected repos" });
    }

    console.log(`✅ Found repo in Supabase — hook id: ${data.hook_id}`);

    // Delete webhook from GitHub
    const deleted = await deleteGithubWebhook(repo, data.hook_id, data.token);
    if (!deleted) {
      console.warn(`⚠️  Webhook may not have been deleted from GitHub — continuing anyway`);
    }

    console.log(`🗑️  Removing repo from Supabase: ${repo}`);

    // Remove from Supabase
    const { error: deleteError } = await supabase
      .from("connected_repos")
      .delete()
      .eq("repo", repo);

    if (deleteError) {
      console.error(`❌ Supabase delete error:`, deleteError.message);
      throw new Error(deleteError.message);
    }

    console.log(`✅ Repo removed from Supabase`);
    console.log(`🎉 Repo disconnected: ${repo}\n`);

    res.status(200).json({ message: `Webhook disconnected from ${repo}` });
  } catch (err) {
    console.error("❌ disconnectRepo error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

/* ─────────────────────────────────────────────
   📋 GET /repo/list
───────────────────────────────────────────── */
export async function listRepos(req, res) {
  console.log(`\n📋 GET /repo/list called`);

  try {
    console.log(`🔍 Fetching connected repos from Supabase...`);

    const { data, error } = await supabase
      .from("connected_repos")
      .select("repo, connected_at, active, hook_id");

    if (error) {
      console.error(`❌ Supabase fetch error:`, error.message);
      throw new Error(error.message);
    }

    console.log(`✅ Found ${data.length} connected repo(s)`);
    data.forEach((r) => console.log(`   └─ ${r.repo} [hook: ${r.hook_id}] active: ${r.active}`));

    res.status(200).json({ repos: data });
  } catch (err) {
    console.error("❌ listRepos error:", err.message);
    res.status(500).json({ error: err.message });
  }
}