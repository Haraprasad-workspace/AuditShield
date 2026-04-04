import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RefreshCw, Activity } from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DriveCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');

      if (!code) {
        console.error("❌ [DRIVE_CALLBACK] No code found in URL.");
        navigate("/inventory");
        return;
      }

      try {
        console.log("📡 [DRIVE_CALLBACK] Handshake Initialized. Exchanging code...");

        const response = await fetch(`${API_BASE_URL}/api/drive/callback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        const finalToken = data.access_token || data.tokens?.access_token;

        if (response.ok && finalToken) {
          console.log("✅ [DRIVE_CALLBACK] Handshake Successful. Storing Vector.");
          
          localStorage.setItem("google_drive_token", finalToken);
          
          const refreshToken = data.refresh_token || data.tokens?.refresh_token;
          if (refreshToken) {
            localStorage.setItem("google_drive_refresh_token", refreshToken);
          }

          navigate("/drive-audit");
        } else {
          console.error("❌ [DRIVE_CALLBACK] Handshake Failure:", data);
          
          await Swal.fire({
            title: "NEURAL_LINK_FAILED",
            text: data.error || "The Google OAuth exchange was rejected by the server.",
            icon: "error",
            background: "#0B1221",
            color: "#fff",
            confirmButtonColor: "#FF4B5C",
            customClass: {
              popup: 'w-[90%] md:w-auto rounded-2xl'
            }
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
    <div className="min-h-screen bg-cobalt-bg flex flex-col items-center justify-center text-white font-sans p-6">
      
      {/* Visual Loader - Scaled for Mobile */}
      <div className="relative mb-8 md:mb-10">
        <div className="absolute -inset-4 md:-inset-6 bg-cobalt-accent/20 rounded-full blur-xl md:blur-2xl animate-pulse"></div>
        <RefreshCw className="relative text-cobalt-accent animate-spin w-12 h-12 md:w-[60px] md:h-[60px]" />
        <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50 w-4 h-4 md:w-5 md:h-5" />
      </div>
      
      {/* Status Messages - Responsive Typography */}
      <div className="text-center space-y-4 max-w-xs md:max-w-md">
        <h2 className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em] text-cobalt-accent animate-pulse leading-relaxed">
          Initializing_Neural_Handshake
        </h2>
        <div className="flex items-center justify-center gap-2">
            <span className="h-[1px] w-3 md:w-4 bg-white/10"></span>
            <p className="text-[7px] md:text-[8px] font-bold text-cobalt-muted uppercase tracking-[0.2em] md:tracking-[0.3em] whitespace-nowrap">
                Vector Exchange: Phase_2_Active
            </p>
            <span className="h-[1px] w-3 md:w-4 bg-white/10"></span>
        </div>
      </div>

      {/* Background HUD elements - Hidden on small mobile to avoid overlap */}
      <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 opacity-10 font-mono text-[7px] md:text-[8px] uppercase tracking-tighter hidden xs:block">
        Trace_ID: {Math.random().toString(16).slice(2, 10).toUpperCase()}<br />
        Protocol: OAuth_2.0_Secure_Tunnel
      </div>
    </div>
  );
};

export default DriveCallback;