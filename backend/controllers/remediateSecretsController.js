import fetch from 'node-fetch';
import { scanForSecrets } from '../utils/scanner.js';

// Helper: List all files in the repo recursively using the GitHub API
async function listRepoFiles(token, owner, repo, branch = 'main') {
  // Get the SHA of the branch
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!refRes.ok) throw new Error('Failed to get branch ref');
  const refData = await refRes.json();
  const sha = refData.object.sha;

  // Get the tree recursively
  const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${sha}?recursive=1`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!treeRes.ok) throw new Error('Failed to get repo tree');
  const treeData = await treeRes.json();
  // Only return files (not folders)
  return treeData.tree.filter(item => item.type === 'blob').map(item => item.path);
}

// Helper: Get file content from GitHub
async function getFileContent(token, owner, repo, path, branch = 'main') {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to fetch file: ${path}`);
  const data = await res.json();
  if (!data.content) return '';
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

// Helper: Create a new branch from main
async function createBranch(token, owner, repo, newBranch, baseBranch = 'main') {
  const refRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${baseBranch}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!refRes.ok) throw new Error('Failed to get base branch ref');
  const refData = await refRes.json();
  const sha = refData.object.sha;

  // Create new branch
  const branchRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ref: `refs/heads/${newBranch}`,
      sha: sha
    })
  });
  if (!branchRes.ok) throw new Error('Failed to create branch');
}

// Helper: Update file in the new branch
async function updateFile(token, owner, repo, path, content, branch) {
  // Get file SHA
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error(`File not found: ${path}`);
  const file = await res.json();

  // Update file
  const updateRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'fix: remove exposed secret',
      content: Buffer.from(content).toString('base64'),
      sha: file.sha,
      branch: branch
    })
  });
  if (!updateRes.ok) throw new Error(`Failed to update file: ${path}`);
}

// Helper: Create PR
async function createPR(token, owner, repo, branch) {
  const prRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Auto Fix: Remove Exposed Secrets',
      head: branch,
      base: 'main',
      body: 'AI-generated fix by AuditShield 🤖'
    })
  });
  if (!prRes.ok) throw new Error('Failed to create PR');
  return prRes.json();
}

// Main controller
export const remediateSecretsController = async (req, res) => {
  try {
    const { token, owner, repo } = req.body;
    const branch = `fix-secrets-${Date.now()}`;
    // 1. List all files in the repo
    const files = await listRepoFiles(token, owner, repo);

    const filesToFix = [];
    for (const filePath of files) {
      // Only scan code/text files (skip images/binaries)
      if (!filePath.match(/\.(js|ts|json|env|py|go|java|rb|sh|yml|yaml|md|txt)$/i)) continue;
      const content = await getFileContent(token, owner, repo, filePath);
      const findings = scanForSecrets(content, filePath);
      if (findings.length > 0) {
        let fixedCode = content;
        for (const finding of findings) {
          if (finding.match && finding.match[1]) {
            const varName = finding.match[1].toUpperCase();
            // Replace the assignment value with process.env.VARNAME
            // Handles =, :, and optional quotes
            const regex = new RegExp(
              '(' + varName + '\\s*[:=]\\s*)[\'\"`]?[^\\s\'\"`\\n]+[\'\"`]?',
              'gi'
            );
            fixedCode = fixedCode.replace(
              regex,
              `$1process.env.${varName}`
            );
          }
        }
        filesToFix.push({ filePath, fixedCode });
      }
    }

    if (filesToFix.length === 0) {
      return res.json({ message: 'No secrets found.' });
    }

    // 2. Create a new branch
    await createBranch(token, owner, repo, branch);

    // 3. Update all files in the new branch
    for (const { filePath, fixedCode } of filesToFix) {
      await updateFile(token, owner, repo, filePath, fixedCode, branch);
    }

    // 4. Create PR
    const pr = await createPR(token, owner, repo, branch);
    res.json({ message: 'PR created successfully 🚀', pr_url: pr.html_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
