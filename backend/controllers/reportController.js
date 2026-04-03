import { supabase } from "../supabase.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateExecutiveReport = async (req, res) => {
  try {
    const { data: alerts, error } = await supabase
      .from("alerts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // ✅ FIX: Handle empty database gracefully
    const safeAlerts = alerts || [];
    const total = safeAlerts.length;
    
    const critical = safeAlerts.filter(a => a.risk === 'critical').length;
    const resolved = safeAlerts.filter(a => a.resolved).length;
    const githubCount = safeAlerts.filter(a => a.source === 'github').length;
    const docCount = safeAlerts.filter(a => a.source === 'document').length;

    const openCriticals = safeAlerts.filter(a => a.risk === 'critical' && !a.resolved).length;
    const openLows = safeAlerts.filter(a => a.risk !== 'critical' && !a.resolved).length;
    
    // Safety score for empty data
    const postureScore = total === 0 ? 100 : Math.max(0, 100 - (openCriticals * 12) - (openLows * 3));

    // ✅ AI Summary with fallback
    let summary = "Perimeter analysis complete. System is in standby mode awaiting data.";
    if (total > 0) {
        const aiResponse = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are a CISO. Write a 2-sentence professional summary." },
                { role: "user", content: `Stats: Total: ${total}, Critical: ${openCriticals}, Score: ${postureScore}%` }
            ],
            temperature: 0.5,
        });
        summary = aiResponse.choices[0]?.message?.content || summary;
    }

    res.status(200).json({
      reportId: `AS-X-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      score: postureScore,
      summary: summary,
      metrics: {
        total_incidents: total, // 👈 This was likely missing or null
        critical_threats: critical,
        resolved_actions: resolved,
        active_risks: total - resolved
      },
      distribution: {
        github: githubCount,
        documents: docCount
      },
      status: postureScore > 80 ? "SECURE" : postureScore > 50 ? "WARNING" : "CRITICAL_BREACH"
    });

  } catch (err) {
    console.error("Report Engine Error:", err);
    res.status(500).json({ error: "Failed to compile security intelligence." });
  }
};