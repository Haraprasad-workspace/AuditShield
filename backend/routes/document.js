import express from "express";
import multer from "multer";
import { uploadAndAudit } from "../controllers/documentController.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(pdf|docx|xlsx|txt)$/)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOCX, XLSX, TXT allowed."));
    }
  },
});

router.post("/upload", upload.single("document"), uploadAndAudit);

export default router;