import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import webhookRoutes from "./routes/webhook.js";

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use("/", webhookRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));