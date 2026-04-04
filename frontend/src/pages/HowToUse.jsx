"use client";

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import { 
  Globe, HardDrive, ShieldAlert, Cpu, CheckCircle2, 
  Database, Fingerprint, Zap, 
  RefreshCcw, ArrowRight
} from 'lucide-react'

const docsContent = [
  {
    step: "01",
    title: "Connect Repo",
    icon: Globe,
    description: "Link your GitHub repository securely.",
    internalLogic: "We scan repository structure to identify important files like .env and .yml without downloading everything.",
    details: ["Read-only access", "Private & Public repos", "Webhook monitoring"],
    codeSnippet: "Connect → Scan → Monitor"
  },
  {
    step: "02",
    title: "Cloud Drive",
    icon: HardDrive,
    description: "Analyze files in your cloud storage.",
    internalLogic: "We access Drive using Google OAuth to detect sensitive data or risky sharing settings.",
    details: ["Google Auth login", "Recursive folder scan", "Metadata analysis"],
    codeSnippet: "Drive → Fetch → Analyze"
  },
  {
    step: "03",
    title: "Neural Engine",
    icon: Cpu,
    description: "Detect secrets and sensitive data.",
    internalLogic: "Pattern matching and intelligent scanning to detect API keys and passwords with high entropy.",
    details: ["Regex detection", "Pattern matching", "Context-aware"],
    codeSnippet: "Scan → Detect → Classify"
  },
  {
    step: "04",
    title: "Risk Labeling",
    icon: ShieldAlert,
    description: "Identify and flag risky data.",
    internalLogic: "Issues are categorized by risk level and piped to your security dashboard with remediation steps.",
    details: ["Instant alerts", "File-level granularity", "Risk scoring"],
    codeSnippet: "Detect → Alert → Store"
  },
  {
    step: "05",
    title: "Remediation",
    icon: CheckCircle2,
    description: "Fix and verify issues easily.",
    internalLogic: "Once fixed, the system verifies the patch and maintains an immutable audit trail.",
    details: ["One-click resolve", "Status tracking", "Audit logs"],
    codeSnippet: "Fix → Verify → Complete"
  }
];

const HowToUse = () => {
  const [index, setIndex] = useState(0);

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % docsContent.length);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + docsContent.length) % docsContent.length);
  };

  const currentData = docsContent[index];

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans selection:bg-cobalt-accent/30 overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-10 relative">
          
          {/* Background Decorative Element - Scaled for Mobile */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 md:opacity-10 pointer-events-none">
            <Database size={300} className="md:w-[600px] md:h-[600px] text-white/5 rotate-12" />
          </div>

          {/* Header */}
          <div className="text-center space-y-3 md:space-y-4 mb-6 md:mb-8 z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-cobalt-accent"
            >
              <Zap size={10} className="animate-pulse" /> Swipe to navigate
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase italic">
              Audit<span className="text-cobalt-accent">Flow</span>
            </h1>
          </div>

          {/* Card Container - Adjusted height for mobile */}
          <div className="relative w-full max-w-[450px] h-[500px] md:h-[600px] flex items-center justify-center z-10 px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -70) nextCard();
                  if (info.offset.x > 70) prevCard();
                }}
                initial={{ scale: 0.9, opacity: 0, x: 50 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute w-full h-full bg-cobalt-surface/30 border border-white/10 rounded-[2rem] md:rounded-[3.5rem] p-6 md:p-10 shadow-2xl backdrop-blur-3xl cursor-grab active:cursor-grabbing flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="p-3 md:p-4 bg-cobalt-accent/10 rounded-xl md:rounded-2xl text-cobalt-accent border border-cobalt-accent/20">
                      <currentData.icon size={24} className="md:w-8 md:h-8" />
                    </div>
                    <span className="text-3xl md:text-4xl font-black text-white/5">{currentData.step}</span>
                  </div>

                  <h3 className="text-xl md:text-3xl font-bold text-white mb-2 leading-tight">
                    {currentData.title}
                  </h3>
                  <p className="text-cobalt-accent text-[11px] md:text-sm mb-4 md:mb-6 font-bold uppercase tracking-widest">{currentData.description}</p>
                  
                  <div className="space-y-4 md:space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-[9px] md:text-sm font-black uppercase tracking-widest text-white/70 flex items-center gap-2">
                        <Fingerprint size={12}/> Protocol
                      </h4>
                      <p className="text-[11px] md:text-sm text-cobalt-muted leading-relaxed font-medium">
                        {currentData.internalLogic}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {currentData.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] md:text-sm text-white/80">
                          <CheckCircle2 size={12} className="text-cobalt-accent shrink-0" />
                          <span className="truncate">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[9px] md:text-sm text-cobalt-accent flex-1 font-mono truncate tracking-tighter">
                       {currentData.codeSnippet}
                    </div>
                    <button 
                      onClick={nextCard}
                      className="p-3 bg-cobalt-accent text-cobalt-bg rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-cobalt-accent/20 shrink-0"
                    >
                      <ArrowRight size={18} />
                    </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators - Responsive spacing */}
          <div className="flex gap-2 md:gap-3 items-center z-10 mt-10">
            {docsContent.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1 rounded-full transition-all duration-300 ${index === i ? 'w-8 md:w-10 bg-cobalt-accent' : 'w-1.5 md:w-2 bg-white/10'}`}
              />
            ))}
            <button 
                onClick={() => setIndex(0)} 
                className="ml-2 p-2 text-cobalt-muted hover:text-white transition-colors"
                title="Reset"
            >
                <RefreshCcw size={12} />
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}

export default HowToUse;