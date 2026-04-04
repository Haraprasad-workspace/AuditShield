import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Activity } from 'lucide-react';
import Swal from 'sweetalert2';

const DriveCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Extract the 'code' and other params from the URL
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (!code) {
        console.error("❌ [DRIVE_CALLBACK] No code found in URL.");
        navigate("/inventory");
        return;
      }

      try {
        console.log("📡 [DRIVE_CALLBACK] Handshake Initialized. Exchanging code...");

        // 2. Exchange code for real tokens at the backend
        const response = await fetch("http://localhost:5000/api/drive/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        // 3. Handle specific Token mappings (Google sometimes nests them)
        const finalToken = data.access_token || data.tokens?.access_token;

        if (response.ok && finalToken) {
          console.log("✅ [DRIVE_CALLBACK] Handshake Successful. Storing Vector.");
          
          // Store the token and the refresh token if provided
          localStorage.setItem("google_drive_token", finalToken);
          if (data.refresh_token || data.tokens?.refresh_token) {
            localStorage.setItem("google_drive_refresh_token", data.refresh_token || data.tokens.refresh_token);
          }

          // 🚀 Success: Launch the Audit Dashboard
          navigate("/drive-audit");
        } else {
          // 🛑 ERROR HANDLING: This will now tell us WHY it failed
          console.error("❌ [DRIVE_CALLBACK] Handshake Failure:", data);
          
          await Swal.fire({
            title: "NEURAL_LINK_FAILED",
            text: data.error || "The Google OAuth exchange was rejected by the server.",
            icon: "error",
            background: "#0B1221",
            color: "#fff",
            confirmButtonColor: "#FF4B5C"
          });

          navigate("/inventory");
        }
      } catch (err) {
        console.error("❌ [DRIVE_CALLBACK] Network/System Error:", err);
        navigate("/inventory");
      }
    };

    handleCallback();
  }, [location, navigate]);

  return (
    <div className="min-h-screen bg-cobalt-bg flex flex-col items-center justify-center text-white font-sans">
      <div className="relative mb-8">
        <div className="absolute -inset-4 bg-cobalt-accent/20 rounded-full blur-xl animate-pulse"></div>
        <RefreshCw className="relative text-cobalt-accent animate-spin" size={60} />
        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" size={20} />
      </div>
      
      <div className="text-center space-y-3">
        <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-cobalt-accent animate-pulse">
          Initializing_Neural_Handshake
        </h2>
        <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-4 bg-white/10"></span>
            <p className="text-[8px] font-bold text-cobalt-muted uppercase tracking-[0.3em]">
                Vector Exchange: Phase_2_Active
            </p>
            <span className="h-[1px] w-4 bg-white/10"></span>
        </div>
      </div>

      {/* Background HUD elements for the 'Elite' look */}
      <div className="fixed bottom-10 left-10 opacity-10 font-mono text-[8px] uppercase tracking-tighter">
        Trace_ID: {Math.random().toString(16).slice(2, 10)}<br />
        Protocol: OAuth_2.0_Secure_Tunnel
      </div>
    </div>
  );
};

export default DriveCallback;