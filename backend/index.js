import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());


/* 🔗 GitHub Webhook Route */
app.post("/github-webhook", async (req, res) => {
  try {
    const commits = req.body.commits;

    if (!commits) {
      return res.sendStatus(200);
    }

    for (let commit of commits) {
      const text = JSON.stringify(commit);

      // 🔴 Detect secrets
      if (
        text.includes(".env") ||
        text.match(/API_KEY|SECRET|PASSWORD|TOKEN/)
      ) {
        await supabase.from("alerts").insert([
          {
            source: "github",
            message: "Sensitive data detected in commit",
            risk: "critical",
            reason: "Possible API key or secret exposed",
            suggestion: "Remove secrets and rotate keys",
          },
        ]);

        console.log("🚨 Alert inserted!");
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Error:", err);
    res.sendStatus(500);
  }
});

/* ✅ Test route */
app.get("/", (req, res) => {
  res.send("AuditShield Backend Running 🚀");
});

/* 🚀 Start server */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});