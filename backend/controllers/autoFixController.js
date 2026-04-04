import fetch from 'node-fetch';

async function createBranch(token, owner, repo, newBranch) {
  // Get latest commit SHA from main
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/main`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to get main branch SHA');
  const data = await res.json();
  const sha = data.object.sha;

  // Create new branch
  const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha: sha,
    }),
  });
  if (!branchRes.ok) throw new Error('Failed to create branch');
}

async function updateFile(token, owner, repo, path, content, branch) {
  // Get file SHA
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error('File not found');
  const file = await res.json();

  // Update file
  const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "fix: AI-generated fix",
      content: Buffer.from(content).toString('base64'),
      sha: file.sha,
      branch: branch,
    }),
  });
  if (!updateRes.ok) throw new Error('Failed to update file');
}

async function createPR(token, owner, repo, branch) {
  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Auto Fix: Security Issue",
      head: branch,
      base: "main",
      body: "AI-generated fix by AuditShield 🤖",
    }),
  });
  if (!prRes.ok) throw new Error('Failed to create PR');
  return prRes.json();
}

export const autoFixController = async (req, res) => {
  try {
    const { token, owner, repo, files, filePath, fixedCode } = req.body;
    if (!token || !owner || !repo || (!files && (!filePath || !fixedCode))) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const branch = `fix-secrets-${Date.now()}`;
    await createBranch(token, owner, repo, branch);

    if (files && Array.isArray(files)) {
      for (const { filePath, fixedCode } of files) {
        await updateFile(token, owner, repo, filePath, fixedCode, branch);
      }
    } else {
      await updateFile(token, owner, repo, filePath, fixedCode, branch);
    }

    const pr = await createPR(token, owner, repo, branch);
    res.json({ message: "PR created successfully 🚀", pr_url: pr.html_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
