import { supabase } from "../supabase.js";
import { sendSlackAlert } from "../utils/slackNotifier.js";

// --- GET: Fetch all alerts (Handles Logs & Document History) ---
export const getAlerts = async (req, res) => {
  try {
    const { source } = req.query;

    // Prevent browser/proxy caching
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    let query = supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (source) {
      query = query.eq("source", source);
    }

    const { data, error } = await query;
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error(`[ALERT_FETCH_ERROR]: ${err.message}`);
    res.status(500).json({ error: "Failed to retrieve audit trail." });
  }
};

// --- GET: Recent Alerts (For Dashboard Feed) ---
export const getRecentAlerts = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-cache');

    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error(`[DASHBOARD_FEED_ERROR]: ${err.message}`);
    res.status(500).json({ error: "Dashboard feed failed." });
  }
};

/**
 * --- Unified Log Engine (Enhanced Debug Version) ---
 * Handles Deduplication, DB Insertion, Hardcoded Identity, and Slack Notifications
 */
export const createLogEntry = async (logData) => {
  try {
    // --- 🛠️ IDENTITY OVERRIDE ---
    // Hardcoded UUID for testing to ensure Slack lookup works regardless of webhook payload
    const HARDCODED_UUID = "2f5340fe-e53b-4304-b29d-3ae078f0d642";
    logData.user_id = HARDCODED_UUID; 

    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
    
    // 1. DEDUPLICATION: Anti-spam check
    const { data: existing, error: checkError } = await supabase
      .from("alerts")
      .select("id, created_at")
      .eq("message", logData.message)
      .eq("filename", logData.filename || null)
      .gt("created_at", fiveSecondsAgo)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existing) {
      console.log("⏭️ [LOG_SKIP]: Duplicate alert suppressed.");
      return { success: true, duplicated: true };
    }

    // 2. INSERTION: Save unique log to DB
    const { data, error } = await supabase.from("alerts").insert([logData]).select();
    if (error) throw error;

    // 3. ⚡ SLACK TRIGGER (Bulletproof Implementation)
    const riskLevel = logData.risk?.toLowerCase();
    
    // Debug point: Check if risk level qualifies
    console.log(`🛡️ [ENGINE_CHECK]: Risk=${riskLevel} | Forcing ID=${HARDCODED_UUID}`);

    if (riskLevel === 'critical' || riskLevel === 'high' || riskLevel === 'medium') {
       
       // Lookup the specific user's webhook URL
       const { data: profileList, error: profileError } = await supabase
         .from('profiles')
         .select('slack_webhook_url')
         .eq('id', HARDCODED_UUID);

       if (profileError) {
         console.error(`❌ [DB_ERR]: Profile lookup failed: ${profileError.message}`);
       } else if (!profileList || profileList.length === 0) {
         console.error(`⚠️ [ID_ERR]: No profile found in DB for UUID: ${HARDCODED_UUID}`);
       } else {
         const webhook = profileList[0].slack_webhook_url;
         
         if (webhook) {
           console.log(`🚀 [SLACK_SIGNAL]: Dispatching to workspace via Notifier...`);
           // ✅ ADDED AWAIT: Ensures the network call finishes before the function exits
           await sendSlackAlert(webhook, logData); 
         } else {
           console.warn("⚠️ [CONFIG_ERR]: Profile found, but slack_webhook_url is NULL or Empty.");
         }
       }
    }
    
    return { success: true, duplicated: false, data };
  } catch (err) {
    console.error(`[LOG_INSERT_ERROR]: ${err.message}`);
    return { success: false, error: err.message };
  }
};

// --- PATCH: Mark an alert as resolved ---
export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("alerts")
      .update({ resolved: true })
      .eq("id", id)
      .select();

    if (error) throw error;

    res.status(200).json({ message: "Threat neutralized", data });
  } catch (err) {
    console.error(`[RESOLUTION_ERROR]: ${err.message}`);
    res.status(500).json({ error: "Failed to update alert status." });
  }
};