import express from 'express';
import { 
  auditGoogleDrive, 
  handleGoogleCallback,
  revokeFileAccess, // 🛡️ New Controller Action
  deleteDriveFile    // 🗑️ New Controller Action
} from '../controllers/driveController.js';

const router = express.Router();

// --- Core Audit Routes ---
// POST /api/drive/audit - Performs the recursive scan
router.post('/audit', auditGoogleDrive);

// POST /api/drive/callback - Handles OAuth2 code exchange
router.post('/callback', handleGoogleCallback);

// --- Remediation Routes ---
// POST /api/drive/revoke - Removes 'anyone' permissions (Makes file private)
router.post('/revoke', revokeFileAccess);

// POST /api/drive/delete - Moves the flagged file to Trash
router.post('/delete', deleteDriveFile);

export default router;