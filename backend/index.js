import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

/* ─────────────────────────────────────────────
   🔬 ENTROPY ANALYSIS
   High-entropy strings are almost always secrets.
   Real words / sentences score low; random keys score high.
───────────────────────────────────────────── */
function shannonEntropy(str) {
  const freq = {};
  for (const ch of str) freq[ch] = (freq[ch] || 0) + 1;
  return Object.values(freq).reduce((entropy, count) => {
    const p = count / str.length;
    return entropy - p * Math.log2(p);
  }, 0);
}

const ENTROPY_THRESHOLD = 3.5; // bits — tune up to reduce false positives
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
   🚫 ALLOWLIST — skip obviously safe strings
   (common placeholder values, dummy strings, etc.)
───────────────────────────────────────────── */
const SAFE_VALUES = new Set([
  "your_api_key_here",
  "your-api-key",
  "xxxxxxxxxxxx",
  "placeholder",
  "changeme",
  "example",
  "insert_key_here",
  "xxxxxxxxxxxxxxxx",
  "replace_with_your_key",
  "todo",
  "fixme",
  "1234567890",
  "abcdefghijklmnop",
]);

function isSafeValue(val) {
  const lower = val.toLowerCase();
  return (
    SAFE_VALUES.has(lower) ||
    /^(.)\1+$/.test(val) || // all same character e.g. "aaaaaaa"
    /^[0-9]+$/.test(val) || // pure numbers
    /^[a-z]+$/.test(val) || // pure lowercase words (likely English)
    /localhost|127\.0\.0\.1|example\.com/.test(lower)
  );
}

/* ─────────────────────────────────────────────
   🔑 GENERIC SECRET PATTERNS
   These catch the structural shape of any secret,
   not company-specific prefixes.
───────────────────────────────────────────── */
const SECRET_PATTERNS = [
  {
    // KEY = "value" or KEY: "value" assignments where the name looks secret-like
    // Covers: API_KEY=, AUTH_TOKEN=, MY_COMPANY_SECRET=, DB_PASSWORD=, etc.
    name: "Secret-like variable assignment",
    regex:
      /(?:api[_-]?key|api[_-]?secret|access[_-]?key|auth[_-]?key|auth[_-]?token|private[_-]?key|secret[_-]?key|client[_-]?secret|app[_-]?secret|encryption[_-]?key|signing[_-]?key|jwt[_-]?secret|session[_-]?secret|master[_-]?key|token|password|passwd|pwd|credential|secret)\s*[:=]\s*['"`]?([A-Za-z0-9+/=_\-\.]{16,})['"`]?/gi,
    extract: (match) => match[2],
  },
  {
    // process.env.ANYTHING = "hardcoded_value"  ← secret hardcoded instead of env ref
    name: "Hardcoded env override",
    regex:
      /process\.env\.[A-Z_]+\s*=\s*['"`]([A-Za-z0-9+/=_\-\.]{16,})['"`]/g,
    extract: (match) => match[1],
  },
  {
    // Authorization: Bearer <token>  or  Authorization: Basic <base64>
    name: "Hardcoded Authorization header",
    regex:
      /Authorization\s*[:=]\s*['"`]?\s*(Bearer|Basic)\s+([A-Za-z0-9+/=_\-\.]{16,})['"`]?/gi,
    extract: (match) => match[2],
  },
  {
    // Any URL with embedded credentials: scheme://user:pass@host
    name: "URL with embedded credentials",
    regex: /[a-z][a-z0-9+\-.]*:\/\/[^:@\s]+:[^@\s]{8,}@[^\s]+/gi,
    extract: () => null, // always flag, no value extraction needed
  },
  {
    // -----BEGIN * PRIVATE KEY-----
    name: "Private key block",
    regex: /-----BEGIN [A-Z ]*(PRIVATE|ENCRYPTED) KEY-----/gi,
    extract: () => null,
  },
  {
    // Generic high-entropy quoted strings anywhere in code
    // "some-random-high-entropy-string"
    name: "High-entropy quoted string",
    regex: /['"`]([A-Za-z0-9+/=_\-\.]{20,})['"`]/g,
    extract: (match) => match[1],
  },
];

/* ─────────────────────────────────────────────
   🗂️ SENSITIVE FILE DETECTION
   Flags files that should never be committed.
───────────────────────────────────────────── */
const SENSITIVE_FILENAME_PATTERNS = [
  /^\.env(\.\w+)?$/i,             // .env, .env.local, .env.production
  /\.pem$/i,                       // certificates
  /\.key$/i,                       // key files
  /\.pfx$/i,                       // PKCS12 bundles
  /\.p12$/i,
  /^id_rsa/i,                      // SSH private keys
  /^id_dsa/i,
  /^id_ecdsa/i,
  /^id_ed25519/i,
  /credentials\.json$/i,           // GCP, AWS credential files
  /secret[s]?\.json$/i,
  /secrets?\.ya?ml$/i,
  /keystore\.(jks|p12)$/i,
  /service[_-]?account.*\.json$/i, // GCP service accounts
  /\.htpasswd$/i,
  /auth\.json$/i,
];

function isSensitiveFilename(filepath) {
  const filename = filepath.split("/").pop(); // just the file name
  return SENSITIVE_FILENAME_PATTERNS.some((pattern) => pattern.test(filename));
}

/* ─────────────────────────────────────────────
   🔍 MAIN SCANNER
───────────────────────────────────────────── */
function scanForSecrets(content, filename) {
  const findings = [];
  const seen = new Set(); // deduplicate same finding type per file

  for (const pattern of SECRET_PATTERNS) {
    pattern.regex.lastIndex = 0;
    let match;

    while ((match = pattern.regex.exec(content)) !== null) {
      const extractedValue = pattern.extract ? pattern.extract(match) : null;

      // If we can extract a value, validate it with entropy + allowlist
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
async function fetchFileContent(rawUrl) {
  try {
    const response = await fetch(rawUrl, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3.raw",
      },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

async function getCommitFiles(repoFullName, commitSha) {
  const url = `https://api.github.com/repos/${repoFullName}/commits/${commitSha}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!response.ok) return [];
  const data = await response.json();
  return data.files || [];
}

/* ─────────────────────────────────────────────
   🔗 GITHUB WEBHOOK
───────────────────────────────────────────── */
app.post("/github-webhook", async (req, res) => {
  res.sendStatus(200); // respond fast so GitHub doesn't time out

  try {
    const { commits, repository } = req.body;
    if (!commits || !repository) return;

    const repoFullName = repository.full_name;

    for (const commit of commits) {
      const commitSha = commit.id;
      console.log(`\n🔍 Scanning commit: ${commitSha}`);

      const files = await getCommitFiles(repoFullName, commitSha);

      for (const file of files) {
        if (file.status === "removed") continue;

        const filename = file.filename;
        let findings = [];

        // 1️⃣ Flag sensitive filenames immediately
        if (isSensitiveFilename(filename)) {
          findings.push({ type: "Sensitive file committed", file: filename, entropy: null });
        }

        // 2️⃣ Scan actual file content
        if (file.raw_url) {
          const content = await fetchFileContent(file.raw_url);
          if (content) {
            const contentFindings = scanForSecrets(content, filename);
            findings = [...findings, ...contentFindings];
          }
        }

        // 3️⃣ Insert one alert per finding
        for (const finding of findings) {
          const alertPayload = {
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
          };

          await supabase.from("alerts").insert([alertPayload]);
          console.log(
            `🚨 [${finding.type}] in ${finding.file}` +
              (finding.entropy ? ` | entropy: ${finding.entropy}` : "")
          );
        }
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
  }
});

/* ✅ Test route */
app.get("/", (req, res) => res.send("AuditShield Backend Running 🚀"));

/* 🚀 Start server */
app.listen(5000, () => console.log("Server running on http://localhost:5000"));