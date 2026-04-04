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
    title: "Connect Your Repository",
    icon: Globe,
    description: "Link your GitHub repository securely.",
    internalLogic: "We scan your repository structure to identify important files like .env, .json, and .yml without downloading everything.",
    details: ["Secure read-only access", "Supports private & public repos", "Automatic monitoring using webhooks"],
    codeSnippet: "Connect → Scan → Monitor"
  },
  {
    step: "02",
    title: "Connect Google Drive",
    icon: HardDrive,
    description: "Analyze files in your cloud storage.",
    internalLogic: "We access your Drive using Google authentication and scan files and folders to detect sensitive data or risky sharing.",
    details: ["Secure Google login", "Scans all folders", "Supports multiple file types"],
    codeSnippet: "Drive Connect → Fetch → Analyze"
  },
  {
    step: "03",
    title: "Smart Detection Engine",
    icon: Cpu,
    description: "Detect secrets and sensitive data.",
    internalLogic: "We use pattern matching and intelligent scanning to detect API keys, passwords, and sensitive data.",
    details: ["Regex-based detection", "Smart pattern matching", "Context-aware scanning"],
    codeSnippet: "Scan → Detect → Classify"
  },
  {
    step: "04",
    title: "Risk Detection",
    icon: ShieldAlert,
    description: "Identify and flag risky data.",
    internalLogic: "If any issue is found, it is marked as a risk and shown in the dashboard with details.",
    details: ["Instant alerts", "File-level detection", "Clear risk labeling"],
    codeSnippet: "Detect → Alert → Store"
  },
  {
    step: "05",
    title: "Resolve Issues",
    icon: CheckCircle2,
    description: "Fix and verify issues easily.",
    internalLogic: "Once the issue is fixed, you can mark it as resolved and the system will verify it.",
    details: ["One-click resolve", "Status tracking", "Audit logs maintained"],
    codeSnippet: "Fix → Verify → Complete"
  }
];

const HowToUse = () => {
  const [index, setIndex] = useState(0);

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % docsContent.length);
  };

  const currentData = docsContent[index];

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans selection:bg-cobalt-accent/30 overflow-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 relative">
          
          {/* Background Decorative Element */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <Database size={600} className="text-white/5 rotate-12" />
          </div>

          {/* Header */}
          <div className="text-center space-y-4 mb-8 z-10">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-cobalt-accent"
            >
              <Zap size={10} className="animate-pulse" /> Swipe or Click Arrow to Navigate
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter uppercase italic">
              How It <span className="text-cobalt-accent">Works</span>
            </h1>
          </div>

          {/* Card Container */}
          <div className="relative w-full max-w-[500px] h-[550px] md:h-[600px] flex items-center justify-center z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.x < -100) nextCard();
                  if (info.offset.x > 100) setIndex((prev) => (prev - 1 + docsContent.length) % docsContent.length);
                }}
                initial={{ scale: 0.9, opacity: 0, x: 100 }}
                animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0.9, opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="absolute w-full h-full bg-cobalt-surface/30 border border-white/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 shadow-2xl backdrop-blur-3xl cursor-grab active:cursor-grabbing flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <div className="p-4 bg-cobalt-accent/10 rounded-2xl text-cobalt-accent border border-cobalt-accent/20">
                      <currentData.icon size={32} />
                    </div>
                    <span className="text-4xl font-black text-white/5">{currentData.step}</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {currentData.title}
                  </h3>
                  <p className="text-cobalt-accent text-sm mb-6">{currentData.description}</p>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold text-white/70 mb-2 flex items-center gap-2">
                        <Fingerprint size={14}/> Internal Protocol
                      </h4>
                      <p className="text-sm text-cobalt-muted leading-relaxed">
                        {currentData.internalLogic}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {currentData.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/80">
                          <CheckCircle2 size={14} className="text-cobalt-accent" />
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                   <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-[10px] md:text-sm text-cobalt-accent flex-1 mr-4 font-mono truncate">
                      {currentData.codeSnippet}
                   </div>
                   <button 
                    onClick={nextCard}
                    className="p-3 bg-cobalt-accent text-cobalt-bg rounded-xl hover:scale-105 transition-all shadow-lg shadow-cobalt-accent/20"
                   >
                    <ArrowRight size={18} />
                   </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress Indicators */}
          <div className="absolute bottom-10 flex gap-3 items-center z-10">
            {docsContent.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? 'w-10 bg-cobalt-accent' : 'w-2 bg-white/10 hover:bg-white/30'}`}
              />
            ))}
            <button 
                onClick={() => setIndex(0)} 
                className="ml-4 p-2 text-cobalt-muted hover:text-white transition-colors"
                title="Reset Tour"
            >
                <RefreshCcw size={14} />
            </button>
          </div>

        </main>
      </div>
    </div>
  )
}

export default HowToUse;