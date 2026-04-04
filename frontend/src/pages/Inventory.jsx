"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Zap, CheckCircle2, Trash2, ShieldCheck, Activity, Globe, ExternalLink } from "lucide-react";

// Environment Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const FRONTEND_URL = window.location.origin; // Dynamically gets current URL (localhost or deployed domain)

// --- Brand Logos ---
const GitHubLogo = ({ size = 24, ...props }) => (
  <svg {...props} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.724-4.033-1.61-4.033-1.61-.546-1.385-1.334-1.754-1.334-1.754-1.09-.746.082-.73.082-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.47-2.38 1.236-3.22-.124-.304-.536-1.527.116-3.182 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013-.403c1.02.005 2.043.138 3 .403 2.29-1.552 3.296-1.23 3.296-1.23.655 1.655.243 2.878.12 3.182.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.625-5.478 5.922.43.37.815 1.1.815 2.22v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.296 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const DriveLogo = ({ size = 24, ...props }) => (
  <svg {...props} width={size} height={size} viewBox="0 0 256 262" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M250 145.3 182 22H74L6 145.3l72 125.3h108l72-125.3zM180 42l68 123-68 123H76L8 165.3 76 42h104z" />
  </svg>
);

const SlackLogo = ({ size = 24, ...props }) => (
  <svg {...props} width={size} height={size} viewBox="0 0 122.8 122.8" fill="currentColor">
    <path d="M30.5 122.8c16.8 0 30.5-13.6 30.5-30.5 0-16.8-13.6-30.5-30.5-30.5S0 75.5 0 92.3s13.7 30.5 30.5 30.5zm5.1-46.1c-2.8 0-5.1 2.3-5.1 5.1v10.3c0 2.8 2.3 5.1 5.1 5.1s5.1-2.3 5.1-5.1v-10.3c0-2.8-2.3-5.1-5.1-5.1zM92.3 122.8c16.8 0 30.5-13.6 30.5-30.5 0-16.8-13.6-30.5-30.5-30.5-16.8 0-30.5 13.6-30.5 30.5s13.7 30.5 30.5 30.5zm-5.1-46.1c2.8 0 5.1 2.3 5.1 5.1v10.3c0 2.8-2.3 5.1-5.1 5.1s-5.1-2.3-5.1-5.1v-10.3c0-2.8 2.3-5.1 5.1-5.1zM0 30.5C0 13.7 13.6 0 30.5 0c16.8 0 30.5 13.7 30.5 30.5s-13.7 30.5-30.5 30.5C13.6 61 0 47.3 0 30.5zm46.1-5.1c0-2.8-2.3-5.1-5.1-5.1H30.5c-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1h10.5c2.8 0 5.1-2.3 5.1-5.1zM122.8 30.5c0-16.8-13.6-30.5-30.5-30.5s-30.5 13.7-30.5 30.5 13.6 30.5 30.5 30.5 30.5-13.7 30.5-30.5zm-46.1-5.1c0 2.8 2.3 5.1 5.1 5.1h10.3c2.8 0 5.1-2.3 5.1-5.1s-2.3-5.1-5.1-5.1h-10.3c-2.8 0-5.1 2.3-5.1 5.1z" />
  </svg>
);

const IntegrationCard = ({ Icon, title, description, status, color = "bg-blue-200", onConnect, btnText }) => (
  <Card className="hover:border-cobalt-accent transition-all group bg-cobalt-surface/30 border-white/5">
    <motion.div layout>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-20 flex items-center justify-center border border-white/5 shadow-inner`}>
          <Icon size={32} className="text-white" />
        </div>
        <div
          className={`text-[9px] font-black px-2.5 py-1 rounded border tracking-[0.2em] uppercase ${
            status === "Connected" || status === "Active"
              ? "border-risk-low text-risk-low bg-risk-low/5"
              : "border-cobalt-border text-cobalt-muted"
          }`}
        >
          {status}
        </div>
      </div>
      <h4 className="font-heading font-black text-white mb-1 group-hover:text-cobalt-accent transition-colors uppercase tracking-tight italic">
        {title}
      </h4>
      <p className="text-[11px] text-cobalt-muted mb-6 leading-relaxed font-medium">
        {description}
      </p>
      <Button
        onClick={onConnect}
        className="w-full text-[10px] py-2.5 font-black uppercase tracking-widest shadow-lg"
        variant={status === "Connected" || status === "Active" ? "outline" : "primary"}
      >
        {btnText || `Connect ${title}`}
      </Button>
    </motion.div>
  </Card>
);

const Step = ({ number, title, desc, active, completed }) => (
  <div className="flex gap-4 pb-8 relative last:pb-0">
    <div className="absolute left-[15px] top-8 w-[1px] h-full bg-cobalt-border last:hidden opacity-30"></div>
    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-md ${completed ? "bg-cobalt-accent border-cobalt-accent" : active ? "border-cobalt-accent text-cobalt-accent" : "border-cobalt-border text-cobalt-muted"}`}>
      {completed ? <CheckCircle2 size={16} className="text-cobalt-bg" /> : <span className="text-[10px] font-black">{number}</span>}
    </div>
    <div className="pt-0.5">
      <h4 className={`text-[11px] font-black uppercase tracking-widest ${active || completed ? "text-white" : "text-cobalt-muted"}`}>{title}</h4>
      <p className="text-[10px] text-cobalt-muted/60 mt-1 max-w-[200px] leading-tight italic font-medium">{desc}</p>
    </div>
  </div>
);

const Inventory = () => {
  const navigate = useNavigate();
  const [showGhModal, setShowGhModal] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [ghToken, setGhToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [monitoredRepos, setMonitoredRepos] = useState([]);
  const [driveConnected, setDriveConnected] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#0B1221",
    color: "#FFFFFF",
    iconColor: "#38BDF8",
  });

  useEffect(() => {
    fetchRepos();
    const driveToken = localStorage.getItem("google_drive_token");
    if (driveToken) setDriveConnected(true);
  }, []);

  const fetchRepos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/repo/list`);
      const data = await res.json();
      if (res.ok) setMonitoredRepos(data.repos?.map((r) => r.repo) || []);
    } catch (err) { console.error(err); }
  };

  const handleConnectRepo = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/repo/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repoName, token: ghToken }),
      });
      if (res.ok) {
        setShowGhModal(false);
        setRepoName("");
        setGhToken("");
        fetchRepos();
        Toast.fire({ icon: "success", title: "Perimeter Guard Active", text: `Linked to ${repoName}` });
      } else throw new Error("Connection failed");
    } catch (err) {
      Swal.fire({ title: "AUTH_FAILURE", text: err.message, icon: "error", background: "#0B1221", color: "#FFFFFF" });
    } finally { setIsConnecting(false); }
  };

  const handleDriveAction = () => {
    if (driveConnected) {
      navigate("/drive-audit");
    } else {
      const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
      const options = {
        redirect_uri: `${FRONTEND_URL}/drive-callback`, // Dynamically uses current frontend URL
        client_id: "124506016301-47ppcaa1pu2bpvr4d6h5dtbiu65e2u05.apps.googleusercontent.com", 
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
      ].join(" "),
      };
      window.location.href = `${rootUrl}?${new URLSearchParams(options).toString()}`;
    }
  };

  const handleDisconnectRepo = async (name) => {
    const result = await Swal.fire({
      title: "Deauthorize Vector?",
      text: `AuditShield will stop monitoring ${name}.`,
      icon: "warning",
      showCancelButton: true,
      background: "#0B1221",
      color: "#FFFFFF",
      confirmButtonColor: "#FF4B5C",
      cancelButtonColor: "#1E293B",
      confirmButtonText: "Terminate Scan",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/repo/disconnect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo: name }),
        });
        if (res.ok) {
          Toast.fire({ icon: "info", title: "Monitoring Terminated", text: `Disconnected from ${name}` });
          fetchRepos();
        }
      } catch (err) { console.error(err); }
    }
  };

  const handleDisconnectDrive = async () => {
    const result = await Swal.fire({
      title: "Deauthorize Cloud Vector?",
      text: "This will terminate the connection to Google Drive and clear your local security tokens.",
      icon: "warning",
      showCancelButton: true,
      background: "#0B1221",
      color: "#FFFFFF",
      confirmButtonColor: "#FF4B5C",
      cancelButtonColor: "#1E293B",
      confirmButtonText: "Deauthorize Drive",
    });

    if (result.isConfirmed) {
      localStorage.removeItem("google_drive_token");
      localStorage.removeItem("google_drive_refresh_token");
      setDriveConnected(false);
      Toast.fire({ icon: "info", title: "Vector Deauthorized", text: "Google Drive connection severed." });
    }
  };

  return (
    <div className="min-h-screen bg-cobalt-bg selection:bg-cobalt-accent/30 font-sans">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-8 lg:p-12 max-w-[1400px] mx-auto space-y-12 w-full">
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-10">
            <div className="space-y-1">
               <h2 className="text-4xl font-heading font-black tracking-tighter uppercase italic text-white">
                 Vector_<span className="text-cobalt-accent">Inventory</span>
               </h2>
               <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                 <span className="flex items-center gap-1.5"><Globe size={12} className="text-cobalt-accent"/> System Status: Stable</span>
                 <span className="flex items-center gap-1.5"><Activity size={12} className="text-risk-low animate-pulse"/> Perimeter Heartbeat: Active</span>
               </div>
            </div>
            <div className="p-4 bg-cobalt-surface/20 border border-white/5 rounded-2xl flex items-center gap-6 shadow-inner">
               <div className="text-center">
                 <p className="text-[8px] font-black text-cobalt-muted uppercase mb-1">GitHub Repos</p>
                 <p className="text-xl font-heading font-black italic">{monitoredRepos.length}</p>
               </div>
               <div className="w-[1px] h-8 bg-white/5"></div>
               <div className="text-center">
                 <p className="text-[8px] font-black text-cobalt-muted uppercase mb-1">Cloud Vectors</p>
                 <p className="text-xl font-heading font-black italic text-cobalt-accent">{driveConnected ? 1 : 0}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
            <div className="xl:col-span-3">
              <div className="sticky top-32">
                <h2 className="text-[10px] font-black text-cobalt-accent uppercase tracking-[0.5em] mb-12 flex items-center gap-2"><ShieldCheck size={14} /> System_Handshake</h2>
                <Step number="01" title="Connect Sources" desc="Link GitHub & Cloud providers." completed={monitoredRepos.length > 0 || driveConnected} />
                <Step number="02" title="Neural Scan" desc="AI identifies hidden risks." active={monitoredRepos.length > 0 || driveConnected} />
                <Step number="03" title="Review Logs" desc="Verify findings in log hub." />
                <Step number="04" title="Compliance" desc="Download audit briefing." />
              </div>
            </div>

            <div className="xl:col-span-9 space-y-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <IntegrationCard Icon={GitHubLogo} title="GitHub" description="Real-time perimeter scanning for hardcoded secrets and leaked keys." status={monitoredRepos.length > 0 ? "Connected" : "Disconnected"} color="bg-gray-700" onConnect={() => setShowGhModal(true)} />
                <IntegrationCard 
                  Icon={DriveLogo} 
                  title="Google Drive" 
                  description="Reconstruct folder trees and scan for public file permissions." 
                  status={driveConnected ? "Active" : "Disconnected"} 
                  color="bg-blue-500" 
                  onConnect={handleDriveAction}
                  btnText={driveConnected ? "Open Cloud Explorer" : "Connect Google Drive"}
                />
                <IntegrationCard Icon={SlackLogo} title="Slack Hub" description="Integrate instant remediation alerts for response teams." status="Standby" color="bg-purple-500" onConnect={() => Swal.fire({ title: "In Testing", text: "Slack module under development.", icon: "info", background: "#0B1221", color: "#fff" })} />
              </div>

              {(monitoredRepos.length > 0 || driveConnected) && (
                <div className="space-y-8 pt-12 border-t border-white/5">
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em] flex items-center gap-3 italic"><Zap size={16} className="text-cobalt-accent fill-cobalt-accent/20"/> Active_Scanners</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {driveConnected && (
                       <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-6 bg-cobalt-accent/5 border border-cobalt-accent/20 rounded-[2rem] shadow-xl backdrop-blur-sm group transition-all hover:border-cobalt-accent/40">
                         <div className="flex items-center gap-5">
                           <div className="p-3 bg-cobalt-accent/10 rounded-xl group-hover:scale-110 transition-transform">
                              <DriveLogo size={18} className="text-cobalt-accent" />
                           </div>
                           <div className="flex flex-col">
                             <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-widest">Google_Cloud_Storage</span>
                             <span className="text-[8px] font-black text-cobalt-accent/60 uppercase tracking-tighter">Vector Protocol: OAuth_2.0</span>
                           </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <button onClick={() => navigate("/drive-audit")} className="text-cobalt-accent p-3 hover:bg-cobalt-accent/10 rounded-xl transition-all" title="Open Cloud Explorer">
                              <ExternalLink size={18} />
                            </button>
                            <button onClick={handleDisconnectDrive} className="text-cobalt-muted hover:text-risk-high transition-all p-3 hover:bg-risk-high/10 rounded-xl" title="Sever Connection">
                              <Trash2 size={18} />
                            </button>
                         </div>
                       </motion.div>
                    )}

                    {monitoredRepos.map((repo, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between p-6 bg-cobalt-surface/40 border border-white/5 rounded-[2rem] group transition-all hover:border-cobalt-accent/30 shadow-2xl backdrop-blur-sm">
                        <div className="flex items-center gap-5">
                          <div className="p-3 bg-cobalt-accent/5 rounded-xl group-hover:scale-110 transition-transform">
                             <GitHubLogo size={18} className="text-cobalt-accent" />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-200 tracking-tight">{repo}</span>
                        </div>
                        <button onClick={() => handleDisconnectRepo(repo)} className="text-cobalt-muted hover:text-risk-high transition-all p-3 hover:bg-risk-high/10 rounded-xl">
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* GitHub Link Modal */}
      {showGhModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <Card className="p-10 max-w-md w-full bg-cobalt-surface border-cobalt-accent/20 shadow-2xl rounded-[3rem]">
            <div className="flex flex-col items-center text-center mb-8">
               <div className="p-4 bg-cobalt-accent/10 rounded-2xl mb-4"><GitHubLogo size={32} className="text-cobalt-accent" /></div>
               <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tighter italic">Link Repository</h3>
            </div>
            <form onSubmit={handleConnectRepo} className="space-y-4">
              <Input placeholder="username/repository" className="bg-cobalt-bg border-white/10 h-14 text-sm font-mono" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
              <Input placeholder="Personal Access Token" type="password" className="bg-cobalt-bg border-white/10 h-14 text-sm font-mono" value={ghToken} onChange={(e) => setGhToken(e.target.value)} />
              <div className="flex flex-col gap-3 pt-6">
                <Button type="submit" className="h-14 uppercase font-black tracking-[0.2em] text-[11px] bg-cobalt-accent text-cobalt-bg" disabled={isConnecting}>{isConnecting ? "ENCRYPTING..." : "ACTIVATE PERIMETER"}</Button>
                <button type="button" className="text-[9px] font-black text-cobalt-muted uppercase py-3 hover:text-white" onClick={() => setShowGhModal(false)}>Abort_Session</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Inventory;