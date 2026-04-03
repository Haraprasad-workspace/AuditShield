import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";                  // ← Add this
import webhookRoutes from "./routes/webhook.js";
import repoRoutes from "./routes/repo.js";

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

app.listen(5000, () => console.log("Server running on http://localhost:5000"));