import fetch from "node-fetch";

/**
 * --- Slack Alert Engine ---
 * Dispatches structured security alerts to a user's Slack workspace.
 */
export const sendSlackAlert = async (webhookUrl, logData) => {
  try {
    // 1. Resolve Frontend URL for the button (Local dev vs Production)
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    // 🎨 Color coding based on risk level
    const riskColors = {
      critical: "#FF4B5C", // Red
      high: "#F97316",     // Orange
      medium: "#FBBF24",   // Amber
      low: "#10B981"       // Green
    };

    const risk = logData.risk?.toLowerCase() || 'high';
    const color = riskColors[risk] || riskColors.high;

    // 🏗️ Slack Block Message Structure
    const slackMessage = {
      attachments: [
        {
          color: color,
          fallback: `AuditShield Alert: ${logData.message}`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "🚨 Security Perimeter Breach",
                emoji: true
              }
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Threat Detected:*\n${logData.message}`
              }
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Risk Level:*\n${risk.toUpperCase()}`
                },
                {
                  type: "mrkdwn",
                  text: `*Source:*\n${logData.source || 'GitHub Scanner'}`
                },
                {
                  type: "mrkdwn",
                  text: `*File Context:*\n\`${logData.filename || logData.file_path || 'unknown_node'}\``
                },
                {
                  type: "mrkdwn",
                  text: `*Status:*\nUNRESOLVED`
                }
              ]
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "🔍 Open Audit Console",
                    emoji: true
                  },
                  // ✅ Dynamic production link
                  url: `${FRONTEND_URL}/logs`, 
                  style: "primary",
                  action_id: "view_logs"
                }
              ]
            },
            {
              type: "context",
              elements: [
                {
                  type: "mrkdwn",
                  text: `🕒 Timestamp: ${new Date().toLocaleString('en-IN')}`
                }
              ]
            }
          ]
        }
      ]
    };

    // 📡 Network Dispatch
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(slackMessage)
    });

    if (response.ok) {
      console.log(`✅ [SLACK_SUCCESS]: Notification delivered to workspace.`);
    } else {
      const errorText = await response.text();
      console.error(`❌ [SLACK_API_ERROR]: ${response.status} - ${errorText}`);
    }
  } catch (err) {
    console.error(`❌ [SLACK_FATAL_ERROR]: ${err.message}`);
  }
};