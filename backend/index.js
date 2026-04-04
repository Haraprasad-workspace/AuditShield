import { supabase } from "./supabase.js";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";                  // ← Add this
import webhookRoutes from "./routes/webhook.js";
import repoRoutes from "./routes/repo.js";
import authRoutes from "./routes/auth.js";
import documentRoutes from "./routes/document.js";
import alertRoutes from "./routes/alertRoutes.js";
import reportRoutes from './routes/reportRoutes.js';
import driveRoutes from './routes/driveRoutes.js';

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: "*", // allow all origins (for testing). Replace with your frontend URL in production
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(bodyParser.json());

// Routes
app.use("/", webhookRoutes);
app.use("/repo", repoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", documentRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/drive', driveRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));