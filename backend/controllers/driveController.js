import { google } from 'googleapis';
import { supabase } from '../supabase.js';
import { createLogEntry } from './alertController.js';

const isValidUUID = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

// --- HELPER: Create Client ---
const createDriveClient = (token) => {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  auth.setCredentials({ access_token: token });
  return google.drive({ version: 'v3', auth });
};

const analyzeFileRisk = (file) => {
  const isPublic = file.permissions?.some(p => p.type === 'anyone');
  const hasSensitiveName = /(credentials|password|config|env|backup|secret|key|token|\.pem|\.key|\.sql)/i.test(file.name);
  const isExternal = file.permissions?.some(p => p.type === 'user' && p.emailAddress && !p.emailAddress.endsWith('@yourdomain.com'));

  if (isPublic) return { level: 'critical', score: 90 };
  if (hasSensitiveName || isExternal) return { level: 'warning', score: 50 };
  return { level: 'safe', score: 0 };
};

// --- Action: Sync & Audit Drive ---
export const auditGoogleDrive = async (req, res) => {
  console.log("📡 [DRIVE_AUDIT]: Request Received");
  
  try {
    const { token, userId } = req.body;

    // --- DEBUGGING LOGS ---
    console.log("🔍 [DEBUG] Token provided:", token ? "YES (truncated: " + token.substring(0, 10) + "...)" : "NO");
    console.log("🔍 [DEBUG] UserId provided:", userId || "MISSING");

    if (!token) {
      return res.status(400).json({ error: "Access token is missing from request." });
    }

    if (!userId) {
      return res.status(400).json({ error: "User Identifier is missing from request." });
    }

    if (!isValidUUID(userId)) {
      console.warn(`⚠️ [AUTH_WARN]: UserId "${userId}" is not a valid UUID. Proceeding with caution.`);
      // For strict mode, uncomment the line below:
      // return res.status(400).json({ error: "Security Session Format Invalid." });
    }

    const drive = createDriveClient(token);
    
    console.log("⚡ [DRIVE_AUDIT]: Fetching files from Google API...");
    const response = await drive.files.list({
      pageSize: 150,
      fields: 'files(id, name, mimeType, permissions, owners, size, webViewLink, parents, modifiedTime)',
      q: "trashed = false",
      orderBy: "modifiedTime desc"
    });

    const files = response.data.files || [];
    console.log(`✅ [DRIVE_AUDIT]: Successfully retrieved ${files.length} files.`);

    const auditResults = files.map(file => {
      const risk = analyzeFileRisk(file);
      return {
        file_id: file.id,
        user_id: userId,
        name: file.name,
        mime_type: file.mimeType,
        risk_level: risk.level,
        metadata: file,
        last_scanned: new Date().toISOString()
      };
    });

    // Logging criticals to Audit History
    for (const item of auditResults) {
      if (item.risk_level === 'critical') {
        await createLogEntry({
          user_id: userId,
          source: 'drive',
          message: `Public Exposure: ${item.name}`,
          risk: 'critical',
          reason: `Asset "${item.name}" is shared globally.`,
          suggestion: "Revoke public access immediately.",
          file_path: item.metadata.webViewLink,
          status: 'open'
        });
      }
    }

    console.log("💾 [DRIVE_AUDIT]: Syncing snapshots to Supabase...");
    const { error: upsertError } = await supabase
      .from('drive_snapshots')
      .upsert(auditResults, { onConflict: 'file_id, user_id' });

    if (upsertError) {
      console.error("❌ [SUPABASE_ERROR]:", upsertError.message);
    }

    res.status(200).json({ 
        stats: {
            total: files.length,
            critical: auditResults.filter(r => r.risk_level === 'critical').length,
            warning: auditResults.filter(r => r.risk_level === 'warning').length
        },
        files: auditResults 
    });
  } catch (err) {
    console.error("❌ [DRIVE_AUDIT_FATAL]:", err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- Action: Revoke Public Access ---
export const revokeFileAccess = async (req, res) => {
  const { token, fileId } = req.body;
  console.log(`🛡️ [REMEDIATE]: Revoking access for file ${fileId}`);

  if (!token || !fileId) {
    return res.status(400).json({ error: "Missing required parameters: token or fileId" });
  }

  try {
    const drive = createDriveClient(token);
    const file = await drive.files.get({
      fileId: fileId,
      fields: 'permissions'
    });

    const publicPermission = file.data.permissions?.find(p => p.type === 'anyone');

    if (!publicPermission) {
      return res.status(404).json({ error: "No public permissions found. Node is already private." });
    }

    await drive.permissions.delete({
      fileId: fileId,
      permissionId: publicPermission.id
    });

    res.status(200).json({ message: "Access revoked. Protocol: File is now private." });
  } catch (err) {
    console.error("❌ [REVOKE_ERROR]:", err.response?.data || err.message);
    const errorMessage = err.response?.data?.error?.message || err.message;
    res.status(err.response?.status || 500).json({ error: `Failed to revoke access: ${errorMessage}` });
  }
};

// --- Action: Delete File ---
export const deleteDriveFile = async (req, res) => {
  const { token, fileId } = req.body;
  if (!token || !fileId) {
    return res.status(400).json({ error: "Missing parameters: token or fileId" });
  }

  try {
    const drive = createDriveClient(token);
    await drive.files.update({
      fileId: fileId,
      requestBody: { trashed: true }
    });
    res.status(200).json({ message: "Node purged successfully." });
  } catch (err) {
    console.error("❌ [DELETE_ERROR]:", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
};

// --- Action: OAuth Callback ---
export const handleGoogleCallback = async (req, res) => {
  const { code } = req.body;
  console.log("🔑 [AUTH]: Exchanging code for tokens...");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID, 
    process.env.GOOGLE_CLIENT_SECRET, 
    process.env.GOOGLE_REDIRECT_URI
  );
  
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log("✅ [AUTH]: Handshake successful.");
    res.status(200).json(tokens);
  } catch (error) {
    console.error("❌ [AUTH_EXCHANGE_ERROR]:", error.message);
    res.status(500).json({ error: "Auth exchange failed." });
  }
};