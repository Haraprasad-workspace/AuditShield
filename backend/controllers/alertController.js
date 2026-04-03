import { supabase } from "../supabase.js";

// --- GET: Fetch all alerts (Handles Logs & Document History) ---
export const getAlerts = async (req, res) => {
  try {
    const { source } = req.query;

    // ✅ FIX 1: Set headers to prevent browser/proxy caching
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
    console.error("Alert Fetch Error:", err.message);
    res.status(500).json({ error: "Failed to retrieve audit trail." });
  }
};

// --- GET: Recent Alerts (For Dashboard Feed) ---
export const getRecentAlerts = async (req, res) => {
  try {
    // Prevent caching for dashboard as well
    res.setHeader('Cache-Control', 'no-cache');

    const { data, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Dashboard feed failed." });
  }
};

/**
 * ✅ FIX 2: Deduplication Logic (The "Anti-Spam" Bridge)
 * This helps prevent the "1 change = 4 logs" issue.
 * We only allow inserting a log if a similar one wasn't created in the last 5 seconds.
 */
export const createLogEntry = async (logData) => {
  try {
    // 1. Check for a duplicate message in the last 5 seconds
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
    
    const { data: existing } = await supabase
      .from("alerts")
      .select("id")
      .eq("message", logData.message)
      .eq("filename", logData.filename || null)
      .gt("created_at", fiveSecondsAgo)
      .maybeSingle();

    if (existing) {
      console.log("🛡️ Deduplication: Blocked redundant log entry.");
      return { success: true, duplicated: true };
    }

    // 2. If unique, insert it
    const { error } = await supabase.from("alerts").insert([logData]);
    if (error) throw error;
    
    return { success: true, duplicated: false };
  } catch (err) {
    console.error("Internal Logging Error:", err.message);
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
    console.error("Resolution Error:", err.message);
    res.status(500).json({ error: "Failed to update alert status." });
  }
};