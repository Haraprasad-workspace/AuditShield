import { supabase } from "./supabase.js";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import webhookRoutes from "./routes/webhook.js";
import repoRoutes from "./routes/repo.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/document.js";
import alertRoutes from "./routes/alertRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import driveRoutes from './routes/driveRoutes.js';
import autoFixRoutes from "./routes/autoFix.js";
import remediateSecretsRoutes from './routes/remediateSecrets.js';

dotenv.config();

const app = express();

// --- DEPLOYMENT CONFIG ---
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// ✅ Enhanced CORS for Production
app.use(cors({
  // Allows local development AND your specific production frontend
  origin: [FRONTEND_URL, "http://localhost:5173"], 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(bodyParser.json());

// --- HEALTH CHECK ---
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Online", kernel: "v4.0.2", timestamp: new Date().toISOString() });
});

// --- ROUTES ---
app.use("/", webhookRoutes);
app.use("/repo", repoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", documentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/drive', driveRoutes);
app.use('/api', autoFixRoutes);
app.use('/api', remediateSecretsRoutes);

// ✅ Dynamic Port Binding
app.listen(PORT, "0.0.0.0", () => {
  console.log(`
  🚀 --- AUDITSHIELD BACKEND ACTIVE ---
  📡 Listening on Port: ${PORT}
  🔗 Authorized Origin: ${FRONTEND_URL}
  --------------------------------------
  `);
});