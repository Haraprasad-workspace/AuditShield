"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { motion } from "motion/react";
import Swal from "sweetalert2";
import { Zap, CheckCircle2, Trash2 } from "lucide-react";

// ----- Brand Logos -----
const GitHubLogo = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.724-4.033-1.61-4.033-1.61-.546-1.385-1.334-1.754-1.334-1.754-1.09-.746.082-.73.082-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.76-1.605-2.665-.304-5.466-1.334-5.466-5.933 0-1.31.47-2.38 1.236-3.22-.124-.304-.536-1.527.116-3.182 0 0 1.008-.322 3.3 1.23a11.5 11.5 0 013-.403c1.02.005 2.043.138 3 .403 2.29-1.552 3.296-1.23 3.296-1.23.655 1.655.243 2.878.12 3.182.77.84 1.236 1.91 1.236 3.22 0 4.61-2.807 5.625-5.478 5.922.43.37.815 1.1.815 2.22v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.296 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const DriveLogo = (props) => (
  <svg {...props} viewBox="0 0 256 262" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M250 145.3 182 22H74L6 145.3l72 125.3h108l72-125.3zM180 42l68 123-68 123H76L8 165.3 76 42h104z" />
  </svg>
);

const SlackLogo = (props) => (
  <svg {...props} viewBox="0 0 122.8 122.8" fill="currentColor">
    <path d="M30.5 122.8c16.8 0 30.5-13.6 30.5-30.5 0-16.8-13.6-30.5-30.5-30.5S0 75.5 0 92.3s13.7 30.5 30.5 30.5zm5.1-46.1c-2.8 0-5.1 2.3-5.1 5.1v10.3c0 2.8 2.3 5.1 5.1 5.1s5.1-2.3 5.1-5.1v-10.3c0-2.8-2.3-5.1-5.1-5.1zM92.3 122.8c16.8 0 30.5-13.6 30.5-30.5 0-16.8-13.6-30.5-30.5-30.5-16.8 0-30.5 13.6-30.5 30.5s13.7 30.5 30.5 30.5zm-5.1-46.1c2.8 0 5.1 2.3 5.1 5.1v10.3c0 2.8-2.3 5.1-5.1 5.1s-5.1-2.3-5.1-5.1v-10.3c0-2.8 2.3-5.1 5.1-5.1zM0 30.5C0 13.7 13.6 0 30.5 0c16.8 0 30.5 13.7 30.5 30.5s-13.7 30.5-30.5 30.5C13.6 61 0 47.3 0 30.5zm46.1-5.1c0-2.8-2.3-5.1-5.1-5.1H30.5c-2.8 0-5.1 2.3-5.1 5.1s2.3 5.1 5.1 5.1h10.5c2.8 0 5.1-2.3 5.1-5.1zM122.8 30.5c0-16.8-13.6-30.5-30.5-30.5s-30.5 13.7-30.5 30.5 13.6 30.5 30.5 30.5 30.5-13.7 30.5-30.5zm-46.1-5.1c0 2.8 2.3 5.1 5.1 5.1h10.3c2.8 0 5.1-2.3 5.1-5.1s-2.3-5.1-5.1-5.1h-10.3c-2.8 0-5.1 2.3-5.1 5.1z" />
  </svg>
);

// ----- Integration Card Component -----
const IntegrationCard = ({ Icon, title, description, status, color = "bg-blue-200", onConnect }) => (
  <Card className="hover:border-blue-400 transition-all group">
    <motion.div layout>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-30 flex items-center justify-center`}>
          <Icon size={32} className="text-white" />
        </div>
        <div
          className={`text-[10px] font-bold px-2 py-1 rounded border ${
            status === "Connected"
              ? "border-green-400 text-green-600"
              : "border-blue-300 text-blue-400"
          }`}
        >
          {status.toUpperCase()}
        </div>
      </div>
      <h4 className="font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-blue-500 transition-colors">
        {title}
      </h4>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
        {description}
      </p>
      <Button
        onClick={onConnect}
        className="w-full text-xs py-2"
        variant={status === "Connected" ? "outline" : "primary"}
      >
        {status === "Connected" ? "Add Another Repository" : `Connect ${title}`}
      </Button>
    </motion.div>
  </Card>
);

// ----- Step Component -----
const Step = ({ number, title, desc, active, completed }) => (
  <div className="flex gap-4 pb-8 relative last:pb-0">
    <div className="absolute left-[15px] top-8 w-[2px] h-full bg-cobalt-border last:hidden"></div>
    <div
      className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
        completed
          ? "bg-cobalt-accent border-cobalt-accent"
          : active
          ? "border-cobalt-accent text-cobalt-accent"
          : "border-cobalt-border text-cobalt-muted"
      }`}
    >
      {completed ? <CheckCircle2 size={16} className="text-cobalt-bg" /> : <span className="text-xs font-bold">{number}</span>}
    </div>
    <div>
      <h4 className={`text-sm font-bold uppercase tracking-wider ${active || completed ? "text-white" : "text-cobalt-muted"}`}>
        {title}
      </h4>
      <p className="text-xs text-cobalt-muted mt-1 max-w-[200px]">{desc}</p>
    </div>
  </div>
);

// ----- Inventory Page -----
const Inventory = () => {
  const [showGhModal, setShowGhModal] = useState(false);
  const [repoName, setRepoName] = useState("");
  const [ghToken, setGhToken] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [monitoredRepos, setMonitoredRepos] = useState([]);

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

  const fetchRepos = async () => {
    try {
      const res = await fetch("http://localhost:5000/repo/list");
      const data = await res.json();
      if (res.ok) setMonitoredRepos(data.repos?.map((r) => r.repo) || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleConnectRepo = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const res = await fetch("http://localhost:5000/repo/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repoName, token: ghToken }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowGhModal(false);
        setRepoName("");
        setGhToken("");
        fetchRepos();
        Toast.fire({
          icon: "success",
          title: "Perimeter Guard Active",
          text: `Linked to ${repoName}`,
        });
      } else throw new Error(data.error || "Connection failed");
    } catch (err) {
      Swal.fire({
        title: "Connection Refused",
        text: err.message,
        icon: "error",
        background: "#0B1221",
        color: "#FFFFFF",
        confirmButtonColor: "#38BDF8",
        iconColor: "#FF4B5C",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (name) => {
    const result = await Swal.fire({
      title: "Deauthorize Repository?",
      text: `AuditShield will stop monitoring ${name}.`,
      icon: "warning",
      showCancelButton: true,
      background: "#0B1221",
      color: "#FFFFFF",
      confirmButtonColor: "#FF4B5C",
      cancelButtonColor: "#1E293B",
      confirmButtonText: "Stop Monitoring",
    });
    if (result.isConfirmed) {
      try {
        const res = await fetch("http://localhost:5000/repo/disconnect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ repo: name }),
        });
        if (res.ok) {
          Toast.fire({
            icon: "info",
            title: "Monitoring Terminated",
            text: `Disconnected from ${name}`,
          });
          fetchRepos();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left Steps */}
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-xl font-heading font-bold text-white mb-8 uppercase tracking-widest text-sm">
                  Onboarding Progress
                </h2>
                <Step number="01" title="Connect Sources" desc="Link your GitHub repositories." completed={monitoredRepos.length > 0} />
                <Step number="02" title="Scan Perimeter" desc="Grok analyzes code for threats." active={monitoredRepos.length > 0} />
                <Step number="03" title="Verify Logs" desc="Review detected risks in logs." />
                <Step number="04" title="Final Report" desc="Generate compliance audit." />
              </div>
            </div>

            {/* Right Cards */}
            <div className="xl:col-span-3 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard
                  Icon={GitHubLogo}
                  title="GitHub"
                  description="Real-time scanning for hardcoded secrets and leaked keys."
                  status={monitoredRepos.length > 0 ? "Connected" : "Disconnected"}
                  color="bg-gray-700"
                  onConnect={() => setShowGhModal(true)}
                />
                <IntegrationCard
                  Icon={DriveLogo}
                  title="Google Drive"
                  description="Scan public file permissions."
                  status="Disconnected"
                  color="bg-blue-500"
                  onConnect={() => Swal.fire("Coming Soon!", "Google Drive integration is under development.", "info")}
                />
                <IntegrationCard
                  Icon={SlackLogo}
                  title="Slack"
                  description="Instant remediation alerts."
                  status="Disconnected"
                  color="bg-purple-500"
                  onConnect={() => Swal.fire("Coming Soon!", "Slack integration is under development.", "info")}
                />
              </div>

              {/* Monitored Repositories */}
              {monitoredRepos.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                    Monitored Repositories ({monitoredRepos.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {monitoredRepos.map((repo, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-cobalt-surface/50 border border-cobalt-border rounded-xl group transition-all hover:border-cobalt-accent/30 shadow-md"
                      >
                        <GitHubLogo size={18} className="text-cobalt-accent" />
                        <span className="font-mono text-sm text-white">{repo}</span>
                        <button
                          onClick={() => handleDisconnect(repo)}
                          className="text-cobalt-muted hover:text-risk-high transition-colors p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* GitHub Modal */}
      {showGhModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-white mb-4">Connect GitHub Repository</h3>
            <form onSubmit={handleConnectRepo} className="space-y-3">
              <Input
                placeholder="Repository Name (e.g., user/repo)"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
              <Input
                placeholder="GitHub Token"
                type="password"
                value={ghToken}
                onChange={(e) => setGhToken(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowGhModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Inventory;