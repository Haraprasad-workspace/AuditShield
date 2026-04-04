import { supabase } from "../supabase.js";

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

// --- Deduplication Logic (Anti-Spam Bridge) ---
export const createLogEntry = async (logData) => {
  try {
    const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
    
    // Check for a duplicate message in the last 5 seconds
    const { data: existing, error: checkError } = await supabase
      .from("alerts")
      .select("id, created_at")
      .eq("message", logData.message)
      .eq("filename", logData.filename || null)
      .gt("created_at", fiveSecondsAgo)
      .maybeSingle();

    if (checkError) throw checkError;

    if (existing) {
      return { success: true, duplicated: true };
    }

    // Insert unique log
    const { data, error } = await supabase.from("alerts").insert([logData]).select();
    
    if (error) throw error;
    
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