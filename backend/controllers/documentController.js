import Groq from "groq-sdk";
import mammoth from "mammoth";
import { supabase } from "../supabase.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
// ✅ IMPORT: Unified engine for Slack and Deduplication
import { createLogEntry } from "./alertController.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── PDF extraction ────────────────────────────────────────────────
const extractPdfText = async (buffer) => {
  const uint8Array = new Uint8Array(buffer);
  const loadingTask = pdfjsLib.getDocument({
    data: uint8Array,
    disableWorker: true,
    disableFontFace: true,
  });

  const pdfDoc = await loadingTask.promise;
  let text = "";
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(" ") + "\n";
  }
  return text;
};

// ── Extract text ──────────────────────────────────────────────────
const extractText = async (buffer, mimetype, originalname) => {
  try {
    if (mimetype.includes("pdf") || originalname.endsWith(".pdf")) {
      return await extractPdfText(buffer);
    }
    if (mimetype.includes("docx") || originalname.endsWith(".docx")) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
    return buffer.toString("utf-8");
  } catch (err) {
    throw new Error("FAILED_TO_EXTRACT_TEXT: " + err.message);
  }
};

// ── Chunking ──────────────────────────────────────────────────────
const chunkText = (text, size = 4000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
};

// ── Safe JSON ─────────────────────────────────────────────────────
const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return { findings: [] };
  }
};

// ── Fallback detection ───────────────────────────────────────────
const fallbackScan = (text) => {
  const findings = [];
  if (/\b\d{4} \d{4} \d{4} \d{4}\b/.test(text)) {
    findings.push({ type: "sensitive", severity: "critical", detail: "Credit card detected", suggestion: "Mask or remove card details" });
  }
  if (/sk-[a-zA-Z0-9\-]+/.test(text)) {
    findings.push({ type: "sensitive", severity: "critical", detail: "API key detected", suggestion: "Store in environment variables" });
  }
  if (/password/i.test(text)) {
    findings.push({ type: "policy", severity: "critical", detail: "Hardcoded password found", suggestion: "Never store plaintext passwords" });
  }
  if (/\b\d{3}-\d{2}-\d{4}\b/.test(text)) {
    findings.push({ type: "pii", severity: "critical", detail: "SSN detected", suggestion: "Remove sensitive identity info" });
  }
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    findings.push({ type: "pii", severity: "medium", detail: "Email detected", suggestion: "Mask personal email" });
  }
  if (/\b\d{10}\b/.test(text)) {
    findings.push({ type: "pii", severity: "medium", detail: "Phone number detected", suggestion: "Mask phone number" });
  }
  return findings;
};

// ── Groq audit ────────────────────────────────────────────────────
const auditChunkWithGroq = async (chunk) => {
  try {
    const res = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `You are a STRICT security auditor. Detect ALL: Emails, Phone numbers, Passwords, API keys, Credit cards, SSN, Hardcoded credentials. Return JSON: {"findings":[{"type":"","severity":"","detail":"","suggestion":""}]}`,
        },
        { role: "user", content: chunk },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });
    return safeJsonParse(res.choices[0]?.message?.content || "{}");
  } catch {
    return { findings: [] };
  }
};

// ── MAIN ──────────────────────────────────────────────────────────
const uploadAndAudit = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { buffer, mimetype, originalname } = req.file;
    const text = await extractText(buffer, mimetype, originalname);

    if (!text || text.trim().length < 5) return res.status(422).json({ error: "Empty document" });

    const chunks = chunkText(text);
    const aiResults = await Promise.all(chunks.map((c) => auditChunkWithGroq(c)));
    const aiFindings = aiResults.flatMap((r) => r.findings || []);
    const fallbackFindings = fallbackScan(text);
    const allFindings = [...aiFindings, ...fallbackFindings];

    // ✅ UPDATED: Call createLogEntry for each finding
    if (allFindings.length > 0) {
      console.log(`📑 [DOC_AUDIT]: Routing ${allFindings.length} findings to Unified Engine...`);
      
      for (const f of allFindings) {
        const logData = {
          source: "document",
          message: `[${f.type}] ${f.detail}`,
          risk: f.severity, // Usually 'critical' or 'medium'
          filename: originalname,
          resolved: false,
          created_at: new Date().toISOString(),
        };

        // This triggers deduplication and Slack
        await createLogEntry(logData);
      }
    }

    return res.json({
      findings: allFindings.length,
      critical: allFindings.filter((f) => f.severity === "critical").length,
      details: allFindings,
    });
  } catch (err) {
    console.error(`[DOCUMENT_AUDIT_ERROR]: ${err.message}`);
    return res.status(500).json({ error: err.message });
  }
};

export { uploadAndAudit };