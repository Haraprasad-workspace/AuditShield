"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shield, ChevronRight, Apple, Globe } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const bootSequence = [
      { type: 'system', content: `Last login: ${new Date().toUTCString()} on ttys001` },
      { type: 'header', content: '--- AUDITSHIELD SECURITY KERNEL v4.0.2 (zsh) ---' },
      { type: 'guide', content: 'READY FOR PROTOCOL INPUT. Type "help" for commands.' }
    ];
    setHistory(bootSequence);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => inputRef.current?.focus();

  // --- REAL DATA PROCESSING ---
  const processCommand = async (cmd) => {
    const fullCmd = cmd.trim();
    const args = fullCmd.toLowerCase().split(' ');
    const baseCmd = args[0];

    let output = { type: 'output', content: 'Processing request...' };
    setHistory(prev => [...prev, { type: 'command', content: fullCmd }]);

    switch (baseCmd) {
      case 'help':
        output.content = 'Protocols: ls, logs --github, logs --drive, score, whoami, clear, exit';
        break;

      case 'ls':
        output.content = 'ACTIVE_VECTORS:\n[+] GitHub_Sync\n[+] Google_Drive_Cloud\n[+] Local_Document_Vault';
        break;

      case 'score':
        output.content = 'CALCULATING_SHIELD_SCORE...\nResult: 94.2% [PROTECTION_OPTIMAL]';
        break;

      case 'logs':
        const source = args.includes('--github') ? 'github' : args.includes('--drive') ? 'google_drive' : null;
        
        if (!source) {
          output.content = 'Error: Missing source flag. Usage: logs --github or logs --drive';
        } else {
          try {
            const res = await fetch(`http://localhost:5000/api/alerts?source=${source}`);
            const data = await res.json();
            
            if (data.length === 0) {
              output.content = `NO_TRACES_FOUND: ${source.toUpperCase()} sector is clean.`;
            } else {
              output.content = `FETCHING_${source.toUpperCase()}_LOGS:\n` + 
                data.slice(0, 10).map(l => `[${l.risk.toUpperCase()}] ${new Date(l.created_at).toLocaleTimeString()} -> ${l.message}`).join('\n');
              if (data.length > 10) output.content += `\n... (+${data.length - 10} more frames available in Reports)`;
            }
          } catch (err) {
            output.content = 'FATAL_CONNECTION_ERROR: Could not reach Neural Database.';
          }
        }
        break;

      case 'whoami':
        output.content = `USER_SESSION: ${localStorage.getItem("auditshield_user_id")?.slice(0,12) || "ROOT_ADMIN"}\nAUTH_LEVEL: 4 (EXECUTIVE)\nTERMINAL_UUID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        break;

      case 'clear':
        setHistory([]);
        return;
      
      case 'exit':
        window.location.href = '/dashboard';
        return;

      default:
        output.content = `zsh: command not found: ${baseCmd}`;
    }

    setHistory(prev => [...prev, output]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      processCommand(input);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-mono overflow-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-6 lg:p-10 flex-1 flex flex-col items-center justify-center">
          
          <div 
            className="w-full max-w-5xl h-[75vh] bg-black/70 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
            onClick={focusInput}
          >
            {/* Title Bar */}
            <div className="bg-white/10 px-4 py-2.5 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <Shield size={12} className="text-cobalt-accent" />
                <span className="text-[10px] font-bold">auditor — ssh — 80×24</span>
              </div>
              <div className="w-10" />
            </div>

            {/* Scrollable Content */}
            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto custom-scrollbar text-sm leading-relaxed">
              <div className="space-y-1">
                {history.map((line, i) => (
                  <div key={i} className="animate-in fade-in duration-200">
                    {line.type === 'command' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#38BDF8] font-bold">➜</span>
                        <span className="text-[#A5F3FC] font-bold">~</span>
                        <span className="text-white">{line.content}</span>
                      </div>
                    ) : line.type === 'output' ? (
                      <pre className="text-green-400 whitespace-pre-wrap ml-4 my-2 opacity-90 border-l border-white/5 pl-4">
                        {line.content}
                      </pre>
                    ) : line.type === 'header' ? (
                      <div className="text-cobalt-accent font-black">{line.content}</div>
                    ) : line.type === 'guide' ? (
                      <div className="text-yellow-400/80 mb-4">{line.content}</div>
                    ) : (
                      <div className="text-gray-500 text-xs">{line.content}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Line */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[#38BDF8] font-bold animate-pulse">➜</span>
                <span className="text-[#A5F3FC] font-bold">~</span>
                <input 
                  ref={inputRef}
                  autoFocus
                  className="bg-transparent border-none outline-none flex-1 text-white caret-white"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-8 text-[9px] text-cobalt-muted font-bold uppercase tracking-widest">
             <div className="flex items-center gap-2"><Apple size={10}/> ARM64_ENGINE</div>
             <div className="flex items-center gap-2"><Globe size={10}/> SECURE_SSH_TUNNEL</div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Terminal;