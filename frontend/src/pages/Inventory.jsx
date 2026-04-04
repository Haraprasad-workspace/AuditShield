"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Zap, CheckCircle2, Trash2, ShieldCheck, Activity, Globe, ExternalLink, X } from "lucide-react";

// Environment Variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const FRONTEND_URL = window.location.origin;

// --- Brand Logos (Kept same for logic) ---
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
  <Card className="hover:border-cobalt-accent transition-all group bg-cobalt-surface/30 border-white/5 p-5 md:p-6">
    <motion.div layout>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 md:p-3 rounded-xl ${color} bg-opacity-20 flex items-center justify-center border border-white/5`}>
          <Icon size={24} className="text-white md:w-8 md:h-8" />
        </div>
        <div className={`text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded border tracking-widest uppercase ${
            status === "Connected" || status === "Active" ? "border-risk-low text-risk-low" : "border-cobalt-border text-cobalt-muted"
          }`}>
          {status}
        </div>
      </div>
      <h4 className="text-sm md:text-base font-heading font-black text-white mb-1 group-hover:text-cobalt-accent italic">
        {title}
      </h4>
      <p className="text-[10px] md:text-[11px] text-cobalt-muted mb-6 leading-relaxed">
        {description}
      </p>
      <Button onClick={onConnect} className="w-full text-[9px] md:text-[10px] py-2 md:py-2.5 font-black uppercase tracking-widest" variant={status === "Connected" || status === "Active" ? "outline" : "primary"}>
        {btnText || `Connect`}
      </Button>
    </motion.div>
  </Card>
);

const Step = ({ number, title, desc, active, completed }) => (
  <div className="flex gap-4 pb-6 md:pb-8 relative last:pb-0">
    <div className="absolute left-[15px] top-8 w-[1px] h-full bg-cobalt-border last:hidden opacity-20"></div>
    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${completed ? "bg-cobalt-accent border-cobalt-accent" : active ? "border-cobalt-accent text-cobalt-accent" : "border-cobalt-border text-cobalt-muted"}`}>
      {completed ? <CheckCircle2 size={16} className="text-cobalt-bg" /> : <span className="text-[10px] font-black">{number}</span>}
    </div>
    <div className="pt-0.5">
      <h4 className={`text-[10px] md:text-[11px] font-black uppercase tracking-widest ${active || completed ? "text-white" : "text-cobalt-muted"}`}>{title}</h4>
      <p className="text-[9px] text-cobalt-muted/60 mt-0.5 max-w-[180px] leading-tight italic">{desc}</p>
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
    toast: true, position: "top-end", showConfirmButton: false, timer: 3000, background: "#0B1221", color: "#FFFFFF",
  });

  useEffect(() => {
    fetchRepos();
    if (localStorage.getItem("google_drive_token")) setDriveConnected(true);
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
        setShowGhModal(false); setRepoName(""); setGhToken(""); fetchRepos();
        Toast.fire({ icon: "success", title: "Linked to " + repoName });
      }
    } catch (err) { console.error(err); } finally { setIsConnecting(false); }
  };

  const handleDriveAction = () => {
    if (driveConnected) navigate("/drive-audit");
    else {
      const options = {
        redirect_uri: `${FRONTEND_URL}/drive-callback`,
        client_id: "124506016301-47ppcaa1pu2bpvr4d6h5dtbiu65e2u05.apps.googleusercontent.com", 
        access_type: "offline", response_type: "code", prompt: "consent",
        scope: ["https://www.googleapis.com/auth/drive", "https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(" "),
      };
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(options).toString()}`;
    }
  };

  const handleDisconnectRepo = async (name) => {
    const result = await Swal.fire({
      title: "Terminate?", background: "#0B1221", color: "#FFFFFF", confirmButtonColor: "#FF4B5C", showCancelButton: true
    });
    if (result.isConfirmed) {
      const res = await fetch(`${API_BASE_URL}/repo/disconnect`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ repo: name }),
      });
      if (res.ok) fetchRepos();
    }
  };

  const handleDisconnectDrive = () => {
    localStorage.removeItem("google_drive_token");
    setDriveConnected(false);
  };

  return (
    <div className="min-h-screen bg-cobalt-bg selection:bg-cobalt-accent/30 font-sans overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        <main className="p-4 sm:p-8 lg:p-12 max-w-[1400px] mx-auto space-y-8 md:space-y-12 w-full">
          
          {/* HEADER HUB */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8 md:pb-10">
            <div className="space-y-1">
               <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter uppercase italic text-white">
                 Vector_<span className="text-cobalt-accent">Inventory</span>
               </h2>
               <div className="flex flex-wrap gap-3 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-cobalt-muted">
                 <span className="flex items-center gap-1.5"><Globe size={12} className="text-cobalt-accent"/> System: Stable</span>
                 <span className="flex items-center gap-1.5"><Activity size={12} className="text-risk-low animate-pulse"/> Perimeter: Active</span>
               </div>
            </div>
            <div className="p-3 md:p-4 bg-cobalt-surface/20 border border-white/5 rounded-2xl flex items-center gap-4 md:gap-6 w-full md:w-auto justify-center md:justify-start">
               <div className="text-center">
                 <p className="text-[7px] md:text-[8px] font-black text-cobalt-muted uppercase mb-1">GitHub Repos</p>
                 <p className="text-lg md:text-xl font-heading font-black italic">{monitoredRepos.length}</p>
               </div>
               <div className="w-[1px] h-8 bg-white/5"></div>
               <div className="text-center">
                 <p className="text-[7px] md:text-[8px] font-black text-cobalt-muted uppercase mb-1">Cloud Vectors</p>
                 <p className="text-lg md:text-xl font-heading font-black italic text-cobalt-accent">{driveConnected ? 1 : 0}</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 md:gap-16">
            {/* STEPPER (Top on Mobile) */}
            <div className="xl:col-span-3">
              <div className="lg:sticky lg:top-32 flex flex-col">
                <h2 className="text-[9px] md:text-[10px] font-black text-cobalt-accent uppercase tracking-[0.4em] mb-8 md:mb-12 flex items-center gap-2"><ShieldCheck size={14} /> Handshake</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-x-4">
                  <Step number="01" title="Sources" desc="Link providers." completed={monitoredRepos.length > 0 || driveConnected} />
                  <Step number="02" title="Neural Scan" desc="AI identification." active={monitoredRepos.length > 0 || driveConnected} />
                </div>
              </div>
            </div>

            {/* MAIN CARDS */}
            <div className="xl:col-span-9 space-y-10 md:space-y-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                <IntegrationCard Icon={GitHubLogo} title="GitHub" description="Real-time perimeter scanning for hardcoded secrets." status={monitoredRepos.length > 0 ? "Connected" : "Disconnected"} color="bg-gray-700" onConnect={() => setShowGhModal(true)} />
                <IntegrationCard Icon={DriveLogo} title="G_Drive" description="Scan for public file permissions." status={driveConnected ? "Active" : "Disconnected"} color="bg-blue-500" onConnect={handleDriveAction} btnText={driveConnected ? "Open Explorer" : "Connect"} />
                <IntegrationCard Icon={SlackLogo} title="Slack" description="Remediation alerts for teams." status="Standby" color="bg-purple-500" onConnect={() => {}} />
              </div>

              {/* ACTIVE SCANNERS LIST */}
              {(monitoredRepos.length > 0 || driveConnected) && (
                <div className="space-y-6 md:space-y-8 pt-8 border-t border-white/5">
                  <h3 className="text-[9px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic"><Zap size={14} className="text-cobalt-accent"/> Active_Scanners</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {driveConnected && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 md:p-6 bg-cobalt-accent/5 border border-cobalt-accent/20 rounded-2xl md:rounded-[2rem]">
                         <div className="flex items-center gap-4 overflow-hidden">
                           <div className="p-2.5 bg-cobalt-accent/10 rounded-xl shrink-0"><DriveLogo size={16} className="text-cobalt-accent" /></div>
                           <div className="flex flex-col truncate">
                             <span className="font-mono text-[10px] md:text-xs font-bold text-slate-200 uppercase truncate">Cloud_Storage</span>
                             <span className="text-[7px] md:text-[8px] font-black text-cobalt-accent/60 uppercase">OAuth_2.0</span>
                           </div>
                         </div>
                         <div className="flex gap-2 shrink-0">
                            <button onClick={() => navigate("/drive-audit")} className="text-cobalt-accent p-2 hover:bg-cobalt-accent/10 rounded-lg"><ExternalLink size={16} /></button>
                            <button onClick={handleDisconnectDrive} className="text-cobalt-muted p-2 hover:bg-risk-high/10 rounded-lg"><Trash2 size={16} /></button>
                         </div>
                       </motion.div>
                    )}
                    {monitoredRepos.map((repo, i) => (
                      <motion.div key={i} className="flex items-center justify-between p-4 md:p-6 bg-cobalt-surface/40 border border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden">
                        <div className="flex items-center gap-4 truncate">
                          <div className="p-2.5 bg-cobalt-accent/5 rounded-xl shrink-0"><GitHubLogo size={16} className="text-cobalt-accent" /></div>
                          <span className="font-mono text-[10px] md:text-xs font-bold text-slate-200 truncate">{repo}</span>
                        </div>
                        <button onClick={() => handleDisconnectRepo(repo)} className="text-cobalt-muted p-2 hover:bg-risk-high/10 rounded-lg shrink-0"><Trash2 size={16} /></button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showGhModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="max-w-md w-full">
              <Card className="p-6 md:p-10 bg-cobalt-surface border-cobalt-accent/20 rounded-[2rem] md:rounded-[3rem] relative">
                <button onClick={() => setShowGhModal(false)} className="absolute top-6 right-6 text-cobalt-muted hover:text-white"><X size={20}/></button>
                <div className="flex flex-col items-center text-center mb-6 md:mb-8">
                   <div className="p-3 bg-cobalt-accent/10 rounded-2xl mb-4"><GitHubLogo size={28} className="text-cobalt-accent" /></div>
                   <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase italic">Link Repo</h3>
                </div>
                <form onSubmit={handleConnectRepo} className="space-y-4">
                  <Input placeholder="username/repository" className="h-12 md:h-14 text-xs" value={repoName} onChange={(e) => setRepoName(e.target.value)} />
                  <Input placeholder="PAT Token" type="password" className="h-12 md:h-14 text-xs" value={ghToken} onChange={(e) => setGhToken(e.target.value)} />
                  <Button type="submit" className="w-full h-12 md:h-14 text-[10px] uppercase font-black tracking-widest bg-cobalt-accent text-cobalt-bg mt-4" disabled={isConnecting}>
                    {isConnecting ? "ENCRYPTING..." : "ACTIVATE"}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;