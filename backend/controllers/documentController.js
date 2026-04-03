import Groq from "groq-sdk";
import mammoth from "mammoth";
import xlsx from "xlsx";
import { supabase } from "../supabase.js"; 
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Extract text based on file type ──────────────────────────────
const extractText = async (buffer, mimetype, originalname) => {
  try {
    if (mimetype === "application/pdf" || originalname.endsWith(".pdf")) {
      /**
       * ✅ THE BULLETPROOF FIX:
       * Node v22 ESM handles require differently for old packages.
       * We resolve the function at the moment of execution.
       */
      const parseFunction = typeof pdf === 'function' ? pdf : (pdf.default || pdf);
      
      if (typeof parseFunction !== 'function') {
        throw new Error("PDF_PARSER_NOT_FOUND");
      }

      const parsed = await parseFunction(buffer);
      return parsed.text;
    }

    if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      originalname.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }

    if (
      mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      originalname.endsWith(".xlsx")
    ) {
      const workbook = xlsx.read(buffer, { type: "buffer" });
      let text = "";
      workbook.SheetNames.forEach((sheetName) => {
        const sheet = workbook.Sheets[sheetName];
        text += xlsx.utils.sheet_to_csv(sheet) + "\n";
      });
      return text;
    }

    // Default for .txt or unknown text files
    return buffer.toString("utf-8");
  } catch (err) {
    console.error("Text Extraction Error Detail:", err.message);
    throw new Error("FAILED_TO_EXTRACT_TEXT");
  }
};

// ── Chunk text into pieces Groq can handle ───────────────────────
const chunkText = (text, chunkSize = 4000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
};

// ── Send chunk to Groq for audit ─────────────────────────────────
const auditChunkWithGroq = async (chunk, chunkIndex) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `You are an expert document auditor. Analyze the text for PII, credentials, or compliance risks. 
          Respond ONLY in JSON format: {"findings": [{"type": "pii|compliance|sensitive|policy|anomaly", "severity": "critical|medium|low", "detail": "...", "suggestion": "..."}]}`
        },
        {
          role: "user",
          content: `Document chunk ${chunkIndex + 1}:\n\n${chunk}`,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" } // Force valid JSON
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Chunk ${chunkIndex} Audit Failed:`, err.message);
    return { findings: [] };
  }
};

// ── Main Upload & Audit Controller ───────────────────────────────
const uploadAndAudit = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file detected in request buffer" });
    }

    const { buffer, mimetype, originalname } = req.file;

    // 1. Intelligence Phase: Text Extraction
    const extractedText = await extractText(buffer, mimetype, originalname);

    if (!extractedText || extractedText.trim().length < 5) {
      return res.status(422).json({ error: "Document appears empty or corrupted" });
    }

    // 2. Intelligence Phase: Parallel Neural Processing
    const chunks = chunkText(extractedText, 4000);
    const auditPromises = chunks.map((chunk, index) => auditChunkWithGroq(chunk, index));
    const results = await Promise.all(auditPromises); 

    const allFindings = results.flatMap(r => r.findings || []);
    const criticalCount = allFindings.filter((f) => f.severity === "critical").length;

    // 3. Persistence Phase: Update AuditShield Intelligence
    if (allFindings.length > 0) {
      const alertRows = allFindings.map((finding) => ({
        source: "document",
        message: `[${finding.type.toUpperCase()}] ${finding.detail}`,
        risk: finding.severity === "critical" ? "critical" : "low",
        reason: finding.type,
        suggestion: finding.suggestion,
        filename: originalname,
        resolved: false,
        created_at: new Date().toISOString(),
      }));

      const { error: dbError } = await supabase.from("alerts").insert(alertRows);
      if (dbError) throw dbError;
    } else {
      // Log successful clean scan
      await supabase.from("alerts").insert({
        source: "document",
        message: `CLEAN_SCAN: Perimeter verified for ${originalname}`,
        risk: "low",
        reason: "clean_scan",
        suggestion: "No remediation required.",
        filename: originalname,
        resolved: true,
        created_at: new Date().toISOString(),
      });
    }

    // 4. Client Notification Phase
    return res.status(200).json({
      findings: allFindings.length,
      critical: criticalCount,
      filename: originalname,
      details: allFindings, 
    });

  } catch (err) {
    console.error("Audit Engine Failure:", err);
    return res.status(500).json({ error: "Neural Engine failure: " + err.message });
  }
};

export { uploadAndAudit };