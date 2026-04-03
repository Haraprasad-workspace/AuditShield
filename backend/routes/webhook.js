import express from "express";
import { handleGithubWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.get("/", (req, res) => res.send("AuditShield Backend Running 🚀"));
router.post("/github-webhook", handleGithubWebhook);

export default router;