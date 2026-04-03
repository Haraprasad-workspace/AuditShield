import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhook.js";
import repoRoutes from "./routes/repo.js";        // ← add this

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use("/", webhookRoutes);
app.use("/repo", repoRoutes);                      // ← add this

app.listen(5000, () => console.log("Server running on http://localhost:5000"));