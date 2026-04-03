// ─── ALLOWLIST ───────────────────────────────
export const SAFE_VALUES = new Set([
  "your_api_key_here", "your-api-key", "xxxxxxxxxxxx", "placeholder",
  "changeme", "example", "insert_key_here", "xxxxxxxxxxxxxxxx",
  "replace_with_your_key", "todo", "fixme", "1234567890", "abcdefghijklmnop",
]);

export function isSafeValue(val) {
  if (!val || typeof val !== "string") return true;
  const lower = val.toLowerCase();
  return (
    SAFE_VALUES.has(lower) ||
    /^(.)\1+$/.test(val) ||
    /^[0-9]+$/.test(val) ||
    /^[a-z]+$/.test(val) ||
    /localhost|127\.0\.0\.1|example\.com/.test(lower) ||
    /^\/[a-z\/\-]+$/.test(val) ||
    /^#[0-9a-f]{3,8}$/i.test(val) ||
    /^https?:\/\//.test(val) ||
    val.includes(" ") ||
    /^[A-Za-z\s\-]+$/.test(val)
  );
}

// ─── SECRET PATTERNS ─────────────────────────
export const SECRET_PATTERNS = [
  {
    name: "Secret-like variable assignment",
    regex: /(?:api[_-]?key|api[_-]?secret|access[_-]?key|auth[_-]?key|auth[_-]?token|private[_-]?key|secret[_-]?key|client[_-]?secret|app[_-]?secret|encryption[_-]?key|signing[_-]?key|jwt[_-]?secret|session[_-]?secret|master[_-]?key|token|password|passwd|pwd|credential|secret)\s*[:=]\s*['"`]?([A-Za-z0-9+/=_\-\.]{16,})['"`]?/gi,
    extract: (match) => match[2] ?? null,
  },
  {
    name: "Hardcoded env override",
    regex: /process\.env\.[A-Z_]+\s*=\s*['"`]([A-Za-z0-9+/=_\-\.]{16,})['"`]/g,
    extract: (match) => match[1] ?? null,
  },
  {
    name: "Hardcoded Authorization header",
    regex: /Authorization\s*[:=]\s*['"`]?\s*(Bearer|Basic)\s+([A-Za-z0-9+/=_\-\.]{16,})['"`]?/gi,
    extract: (match) => match[2] ?? null,
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
    extract: (match) => match[1] ?? null,
  },
];

// ─── SENSITIVE FILENAMES ──────────────────────
export const SENSITIVE_FILENAME_PATTERNS = [
  /^\.env(\.\w+)?$/i,
  /\.pem$/i,
  /\.key$/i,
  /\.pfx$/i,
  /\.p12$/i,
  /^id_rsa/i,
  /^id_dsa/i,
  /^id_ecdsa/i,
  /^id_ed25519/i,
  /credentials\.json$/i,
  /secret[s]?\.json$/i,
  /secrets?\.ya?ml$/i,
  /keystore\.(jks|p12)$/i,
  /service[_-]?account.*\.json$/i,
  /\.htpasswd$/i,
  /auth\.json$/i,
];

export function isSensitiveFilename(filepath) {
  const filename = filepath.split("/").pop();
  return SENSITIVE_FILENAME_PATTERNS.some((p) => p.test(filename));
}

// ─── EXCLUDED FILES ───────────────────────────
export const EXCLUDED_FILES = [
  "backend/index.js",
  "backend/supabase.js",
  "backend/routes/webhook.js",
  "backend/controllers/webhookController.js",
  "backend/utils/entropy.js",
  "backend/utils/patterns.js",
  "backend/utils/scanner.js",
  "backend/utils/github.js",
];

export const EXCLUDED_EXTENSIONS = [
  ".lock", ".css", ".md", ".svg",
  ".png", ".jpg", ".jpeg", ".gif",
  ".ico", ".woff", ".woff2", ".map",
];

export const EXCLUDED_FILENAMES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
];

export function isExcludedFile(filepath) {
  const filename = filepath.split("/").pop();
  const ext = filename.includes(".") ? "." + filename.split(".").pop() : "";
  return (
    EXCLUDED_FILES.includes(filepath) ||
    EXCLUDED_FILENAMES.includes(filename) ||
    EXCLUDED_EXTENSIONS.includes(ext)
  );
}