const GH_HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

console.log("🔑 GitHub token:", process.env.GITHUB_TOKEN ? "✅ loaded" : "❌ MISSING — check .env");

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchFileContent(rawUrl) {
  try {
    const res = await fetchWithTimeout(rawUrl, {
      headers: { ...GH_HEADERS, Accept: "application/vnd.github.v3.raw" },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function getCommitFiles(repoFullName, commitSha) {
  try {
    const url = `https://api.github.com/repos/${repoFullName}/commits/${commitSha}`;
    console.log(`\n📡 Fetching files for commit: ${commitSha.slice(0, 7)}`);

    const res = await fetchWithTimeout(url, { headers: GH_HEADERS });
    console.log(`📡 GitHub API status: ${res.status}`);

    if (!res.ok) {
      const errBody = await res.text();
      console.error(`❌ GitHub API error ${res.status}:`, errBody);
      return [];
    }

    const data = await res.json();
    const files = data.files || [];
    console.log(`📂 Files found: ${files.length}`);
    files.forEach((f) => console.log(`   └─ ${f.filename} [${f.status}]`));
    return files;
  } catch (err) {
    console.error("❌ getCommitFiles failed:", err.message);
    return [];
  }
}