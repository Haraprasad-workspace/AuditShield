"use client";

import React, { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { motion } from "framer-motion"; 
import Swal from "sweetalert2";
import { 
  CheckCircle2, Globe, Shield, Lock, Cpu, 
  Database, Server, Zap, Activity
} from "lucide-react";

// ----- Integration Card Component -----
const IntegrationCard = ({ Icon, title, description, status, color, onConnect }) => (
  <Card className="hover:border-cobalt-accent/50 transition-all group relative overflow-hidden bg-cobalt-surface/30 border-white/5">
    <div className="flex items-start justify-between mb-6 text-white">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20 flex items-center justify-center border border-white/5 shadow-inner`}>
        <Icon size={24} />
      </div>
      <div
        className={`text-[9px] font-black px-2.5 py-1 rounded-full border tracking-[0.15em] uppercase ${
          status === "Active"
            ? "border-risk-low text-risk-low bg-risk-low/5"
            : "border-cobalt-border text-cobalt-muted"
        }`}
      >
        {status}
      </div>
    </div>
    <h4 className="font-heading font-black text-white mb-2 uppercase tracking-tight group-hover:text-cobalt-accent transition-colors text-sm italic">
      {title}
    </h4>
    <p className="text-[11px] text-cobalt-muted mb-6 leading-relaxed min-h-[40px] font-medium">
      {description}
    </p>
    <Button
      onClick={onConnect}
      className="w-full text-[10px] py-2.5 font-black uppercase tracking-[0.2em] shadow-lg"
      variant={status === "Active" ? "outline" : "primary"}
    >
      {status === "Active" ? "Protocol Config" : `Initialize ${title}`}
    </Button>
  </Card>
);

// ----- Step Component -----
const Step = ({ number, title, desc, active, completed }) => (
  <div className="flex gap-4 pb-10 relative last:pb-0">
    <div className={`absolute left-[15px] top-8 w-[1px] h-full transition-colors ${completed ? "bg-cobalt-accent" : "bg-cobalt-border/30"}`}></div>
    <div
      className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-2xl ${
        completed
          ? "bg-cobalt-accent border-cobalt-accent"
          : active
          ? "border-cobalt-accent text-cobalt-accent shadow-[0_0_15px_#38BDF8]"
          : "border-cobalt-border text-cobalt-muted bg-cobalt-bg"
      }`}
    >
      {completed ? <CheckCircle2 size={16} className="text-cobalt-bg" /> : <span className="text-[10px] font-black">{number}</span>}
    </div>
    <div className="flex flex-col pt-1">
      <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] ${active || completed ? "text-white" : "text-cobalt-muted"}`}>
        {title}
      </h4>
      <p className="text-[10px] text-cobalt-muted/50 mt-1 max-w-[180px] leading-tight font-bold italic">{desc}</p>
    </div>
  </div>
);

const Inventory = () => {
  const [activeVectors] = useState(0);

  const comingSoonAlert = (module) => {
    Swal.fire({ 
      title: "ACCESS_RESTRICTED", 
      text: `${module} vector integration is currently locked by central command.`, 
      icon: "info", 
      background: "#0B1221", 
      color: "#fff",
      confirmButtonColor: "#38BDF8",
      customClass: {
        title: 'font-heading font-black uppercase tracking-widest text-sm',
        popup: 'rounded-[2rem] border border-white/10'
      }
    });
  };

  return (
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent/30">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
          
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
            {/* Left Sidebar: Onboarding Steps */}
            <div className="xl:col-span-3">
              <div className="sticky top-32 space-y-8">
                <h2 className="text-[10px] font-black text-cobalt-accent uppercase tracking-[0.4em] mb-10 flex items-center gap-2">
                  <Activity size={14}/> SYSTEM_ONBOARDING
                </h2>
                <Step number="01" title="Connect Sources" desc="Initialize cloud or local vectors." active={true} />
                <Step number="02" title="Define Policies" desc="Set neural scanning parameters." />
                <Step number="03" title="Verify Logs" desc="Validate detected risk hashes." />
                <Step number="04" title="Compliance PDF" desc="Generate final audit briefing." />
              </div>
            </div>

            {/* Right Side: Integration Cards */}
            <div className="xl:col-span-9 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Google Cloud Card */}
                <IntegrationCard
                  Icon={Globe}
                  title="Google Cloud"
                  description="Public bucket and file permission vulnerability assessment."
                  status="Standby"
                  color="bg-blue-500"
                  onConnect={() => comingSoonAlert("Google Cloud")}
                />

                {/* AWS Card */}
                <IntegrationCard
                  Icon={Database}
                  title="AWS S3 Core"
                  description="Automated audit of S3 bucket policies and object entropy."
                  status="Standby"
                  color="bg-orange-500"
                  onConnect={() => comingSoonAlert("AWS S3")}
                />

                {/* Auth Shield Card */}
                <IntegrationCard
                  Icon={Lock}
                  title="Auth Shield"
                  description="Monitor biometric and 2FA bypass attempts across logs."
                  status="Standby"
                  color="bg-purple-500"
                  onConnect={() => comingSoonAlert("Auth Shield")}
                />
              </div>

              {/* Status Footer Section */}
              <div className="p-10 bg-cobalt-surface/10 border border-white/5 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Server size={120} />
                </div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-5 bg-cobalt-accent/10 rounded-2xl text-cobalt-accent shadow-[0_0_20px_rgba(56,189,248,0.1)] group-hover:scale-110 transition-transform duration-500">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Perimeter Status: Dormant</h4>
                        <p className="text-[10px] text-cobalt-muted uppercase font-bold mt-2 italic tracking-widest opacity-60">System is awaiting manual source injection to initialize Grok-1 Pipeline.</p>
                    </div>
                </div>

                <div className="flex gap-3 relative z-10">
                    <div className="h-1.5 w-12 bg-cobalt-border/30 rounded-full overflow-hidden">
                        <div className="h-full bg-cobalt-accent/20 w-0"></div>
                    </div>
                    <div className="h-1.5 w-12 bg-cobalt-border/30 rounded-full"></div>
                    <div className="h-1.5 w-12 bg-cobalt-border/30 rounded-full"></div>
                </div>
              </div>

              {/* Neural Notice */}
              <div className="flex items-start gap-4 px-6 opacity-40 hover:opacity-100 transition-opacity">
                 <Zap size={14} className="text-cobalt-accent mt-1 shrink-0" />
                 <p className="text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed text-cobalt-muted">
                   All integration vectors are processed via the AuditShield Neural Engine. Data remains end-to-end encrypted during transit and analysis phases.
                 </p>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Inventory;