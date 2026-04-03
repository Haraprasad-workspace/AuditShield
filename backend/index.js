import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";
const API_KEY=1234
dotenv.config();

const app = express();
app.use(bodyParser.json());

/* ─────────────────────────────────────────────
   🔬 ENTROPY ANALYSIS
───────────────────────────────────────────── */
function shannonEntropy(str) {
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  return Object.values(freq).reduce((entropy, count) => {
    const p = count / str.length;
    return entropy - p * Math.log2(p);
  }, 0);
}

const ENTROPY_THRESHOLD = 3.5;
const MIN_SECRET_LENGTH = 16;
const MAX_SECRET_LENGTH = 512;

function isHighEntropy(value) {
  return (
    value.length >= MIN_SECRET_LENGTH &&
    value.length <= MAX_SECRET_LENGTH &&
    shannonEntropy(value) >= ENTROPY_THRESHOLD
  );
}

/* ─────────────────────────────────────────────
   🚫 ALLOWLIST
───────────────────────────────────────────── */
const SAFE_VALUES = new Set([
  "your_api_key_here", "your-api-key", "xxxxxxxxxxxx", "placeholder",
  "changeme", "example", "insert_key_here", "xxxxxxxxxxxxxxxx",
  "replace_with_your_key", "todo", "fixme", "1234567890", "abcdefghijklmnop",
]);

function isSafeValue(val) {
  const lower = val.toLowerCase();
  return (
    SAFE_VALUES.has(lower) ||
    /^(.)\1+$/.test(val) ||
    /^[0-9]+$/.test(val) ||
    /^[a-z]+$/.test(val) ||
    /localhost|127\.0\.0\.1|example\.com/.test(lower)
  );
}

/* ─────────────────────────────────────────────
   🔑 GENERIC SECRET PATTERNS
───────────────────────────────────────────── */
const SECRET_PATTERNS = [
  {
    name: "Secret-like variable assignment",
    regex: /(?:api[_-]?key|api[_-]?secret|access[_-]?key|auth[_-]?key|auth[_-]?token|private[_-]?key|secret[_-]?key|client[_-]?secret|app[_-]?secret|encryption[_-]?key|signing[_-]?key|jwt[_-]?secret|session[_-]?secret|master[_-]?key|token|password|passwd|pwd|credential|secret)\s*[:=]\s*['"`]?([A-Za-z0-9+/=_\-\.]{16,})['"`]?/gi,
    extract: (match) => match[2],
  },
  {
    name: "Hardcoded env override",
    regex: /process\.env\.[A-Z_]+\s*=\s*['"`]([A-Za-z0-9+/=_\-\.]{16,})['"`]/g,
    extract: (match) => match[1],
  },
  {
    name: "Hardcoded Authorization header",
    regex: /Authorization\s*[:=]\s*['"`]?\s*(Bearer|Basic)\s+([A-Za-z0-9+/=_\-\.]{16,})['"`]?/gi,
    extract: (match) => match[2],
  },
  {
    name: "URL with embedded credentials",
    regex: /[a-z][a-z0-9+\-.]*:\/\/[^:@\s]+:[^@\s]{8,}@[^\s]+/gi,
    extract: () => null,
  },
  {
    name: "Private key block",
    regex: /-----BEGIN [A-Z ]*(PRIVATE|ENCRYPTED) KEY-----/gi,
    extract: () => null,
  },
  {
    name: "High-entropy quoted string",
    regex: /['"`]([A-Za-z0-9+/=_\-\.]{20,})['"`]/g,
    extract: (match) => match[1],
  },
];

/* ─────────────────────────────────────────────
   🗂️ SENSITIVE FILE DETECTION
───────────────────────────────────────────── */
const SENSITIVE_FILENAME_PATTERNS = [
  /^\.env(\.\w+)?$/i, /\.pem$/i, /\.key$/i, /\.pfx$/i, /\.p12$/i,
  /^id_rsa/i, /^id_dsa/i, /^id_ecdsa/i, /^id_ed25519/i,
  /credentials\.json$/i, /secret[s]?\.json$/i, /secrets?\.ya?ml$/i,
  /keystore\.(jks|p12)$/i, /service[_-]?account.*\.json$/i,
  /\.htpasswd$/i, /auth\.json$/i,
];

function isSensitiveFilename(filepath) {
  const filename = filepath.split("/").pop();
  return SENSITIVE_FILENAME_PATTERNS.some((p) => p.test(filename));
}

/* ─────────────────────────────────────────────
   🔍 MAIN SCANNER
───────────────────────────────────────────── */
function scanForSecrets(content, filename) {
  const findings = [];
  const seen = new Set();

  for (const pattern of SECRET_PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;

    while ((match = pattern.regex.exec(content)) !== null) {
      const extractedValue = pattern.extract ? pattern.extract(match) : null;

      if (extractedValue !== null) {
        if (isSafeValue(extractedValue)) continue;
        if (!isHighEntropy(extractedValue)) continue;
      }

      const key = `${pattern.name}::${filename}`;
      if (seen.has(key)) continue;
      seen.add(key);

      findings.push({
        type: pattern.name,
        file: filename,
        entropy: extractedValue ? shannonEntropy(extractedValue).toFixed(2) : null,
      });
    }

    pattern.regex.lastIndex = 0;
  }

  return findings;
}

/* ─────────────────────────────────────────────
   🌐 GITHUB API HELPERS
───────────────────────────────────────────── */
const GH_HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
};

// ✅ Fetch with timeout — don't hang forever on slow GitHub responses
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

async function fetchFileContent(rawUrl) {
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

async function getCommitFiles(repoFullName, commitSha) {
  try {
    const res = await fetchWithTimeout(
      `https://api.github.com/repos/${repoFullName}/commits/${commitSha}`,
      { headers: GH_HEADERS }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.files || [];
  } catch {
    return [];
  }
}

/* ─────────────────────────────────────────────
   📦 PROCESS A SINGLE FILE — scan + alert
───────────────────────────────────────────── */
async function processFile(file, commitSha, repoFullName) {
  if (file.status === "removed") return;

  const filename = file.filename;
  let findings = [];

  // 1️⃣ Sensitive filename check
  if (isSensitiveFilename(filename)) {
    findings.push({ type: "Sensitive file committed", file: filename, entropy: null });
  }

  // 2️⃣ Scan file content
  if (file.raw_url) {
    const content = await fetchFileContent(file.raw_url);
    if (content) {
      findings = [...findings, ...scanForSecrets(content, filename)];
    }
  }

  // 3️⃣ Bulk insert all findings for this file in ONE query
  if (findings.length === 0) return;

  const alerts = findings.map((finding) => ({
    source: "github",
    message: `Secret detected in file: ${finding.file}`,
    risk: "critical",
    reason: `[${finding.type}] in ${finding.file} — commit ${commitSha.slice(0, 7)}${
      finding.entropy ? ` (entropy: ${finding.entropy})` : ""
    }`,
    suggestion:
      "Remove the secret immediately, rotate/revoke the key, and audit access logs. Consider using git-filter-repo to purge history.",
    repo: repoFullName,
    commit_sha: commitSha,
    file_path: finding.file,
  }));

  await supabase.from("alerts").insert(alerts); // ✅ one insert per file, not per finding
  findings.forEach((f) =>
    console.log(`🚨 [${f.type}] in ${f.file}` + (f.entropy ? ` | entropy: ${f.entropy}` : ""))
  );
}

/* ─────────────────────────────────────────────
   🔗 GITHUB WEBHOOK
───────────────────────────────────────────── */
app.post("/github-webhook", async (req, res) => {
  res.sendStatus(200); // respond immediately

  try {
    const { commits, repository } = req.body;
    if (!commits || !repository) return;

    const repoFullName = repository.full_name;

    // ✅ Fetch all commit file lists in PARALLEL
    const allCommitFiles = await Promise.all(
      commits.map((commit) => getCommitFiles(repoFullName, commit.id)
        .then((files) => ({ sha: commit.id, files }))
      )
    );

    // ✅ Process all files across all commits in PARALLEL
    const allTasks = allCommitFiles.flatMap(({ sha, files }) =>
      files.map((file) => processFile(file, sha, repoFullName))
    );

    await Promise.all(allTasks);

    console.log(`✅ Done scanning ${allTasks.length} files across ${commits.length} commits`);
  } catch (err) {
    console.error("Webhook processing error:", err);
  }
});

/* ✅ Test route */
app.get("/", (req, res) => res.send("AuditShield Backend Running 🚀"));

/* 🚀 Start server */
app.listen(5000, () => console.log("Server running on http://localhost:5000"));