"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Shield, Apple, Globe } from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const bootSequence = [
      { type: 'system', content: `Last login: ${new Date().toUTCString()} on ttys001` },
      { type: 'header', content: '--- AUDITSHIELD SECURITY KERNEL v4.0.2 ---' },
      { type: 'guide', content: 'READY. Type "help" for commands.' }
    ];
    setHistory(bootSequence);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const focusInput = () => inputRef.current?.focus();

  const processCommand = async (cmd) => {
    const fullCmd = cmd.trim();
    const args = fullCmd.toLowerCase().split(' ');
    const baseCmd = args[0];

    let output = { type: 'output', content: 'Processing...' };
    setHistory(prev => [...prev, { type: 'command', content: fullCmd }]);

    switch (baseCmd) {
      case 'help':
        output.content = 'Commands: ls, logs --github, logs --drive, score, whoami, clear, exit';
        break;
      case 'ls':
        output.content = '[+] GitHub_Sync\n[+] Google_Drive\n[+] Document_Vault';
        break;
      case 'score':
        output.content = 'SHIELD_SCORE: 94.2% [OPTIMAL]';
        break;
      case 'logs':
        const source = args.includes('--github') ? 'github' : args.includes('--drive') ? 'google_drive' : null;
        if (!source) {
          output.content = 'Error: Use logs --github or logs --drive';
        } else {
          try {
            const res = await fetch(`${API_BASE_URL}/api/alerts?source=${source}`);
            const data = await res.json();
            if (data.length === 0) {
              output.content = `CLEAN: ${source.toUpperCase()} sector safe.`;
            } else {
              output.content = `LOGS_${source.toUpperCase()}:\n` + 
                data.slice(0, 5).map(l => `[${l.risk[0].toUpperCase()}] ${l.message}`).join('\n');
            }
          } catch (err) {
            output.content = 'CONNECTION_ERROR: Check backend status.';
          }
        }
        break;
      case 'whoami':
        output.content = `USER: ${localStorage.getItem("auditshield_user_id")?.slice(0,8) || "ADMIN"}\nLEVEL: EXECUTIVE`;
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
    <div className="min-h-screen bg-cobalt-bg text-white font-mono overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        <main className="p-4 md:p-10 flex-1 flex flex-col items-center justify-center">
          
          <div 
            className="w-full max-w-5xl h-[60vh] md:h-[75vh] bg-black/80 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-3xl"
            onClick={focusInput}
          >
            {/* Title Bar - Scaled for Mobile */}
            <div className="bg-white/10 px-3 md:px-4 py-2 flex items-center justify-between border-b border-white/5">
              <div className="flex gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <div className="flex items-center gap-2 opacity-40">
                <Shield size={10} className="text-cobalt-accent" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">auditor — ssh</span>
              </div>
              <div className="w-8 md:w-10" />
            </div>

            {/* Scrollable Content - Smaller text on mobile */}
            <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar text-xs md:text-sm leading-relaxed">
              <div className="space-y-1">
                {history.map((line, i) => (
                  <div key={i}>
                    {line.type === 'command' ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#38BDF8] font-bold">➜</span>
                        <span className="text-white break-all">{line.content}</span>
                      </div>
                    ) : line.type === 'output' ? (
                      <pre className="text-green-400 whitespace-pre-wrap ml-4 my-1 opacity-90 border-l border-white/5 pl-3">
                        {line.content}
                      </pre>
                    ) : line.type === 'header' ? (
                      <div className="text-cobalt-accent font-black text-[10px] md:text-sm">{line.content}</div>
                    ) : (
                      <div className="text-gray-500 text-[10px] md:text-xs">{line.content}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input Line */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-[#38BDF8] font-bold animate-pulse">➜</span>
                <input 
                  ref={inputRef}
                  autoFocus
                  className="bg-transparent border-none outline-none flex-1 text-white caret-cobalt-accent"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  spellCheck="false"
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Footer Metadata - Hidden on very small screens */}
          <div className="mt-6 hidden sm:flex gap-8 text-[8px] md:text-[9px] text-cobalt-muted font-black uppercase tracking-[0.2em]">
             <div className="flex items-center gap-2"><Apple size={10}/> NEURAL_CORE_V4</div>
             <div className="flex items-center gap-2"><Globe size={10}/> SSH_ENCRYPTED</div>
          </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(56, 189, 248, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Terminal;