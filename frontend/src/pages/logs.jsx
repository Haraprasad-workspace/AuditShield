"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Swal from 'sweetalert2';
import { 
  Terminal, Search, Cpu, Database, 
  Globe, ShieldCheck, RefreshCcw, 
  ChevronLeft, ChevronRight, FileText, CheckCircle,
  Zap, Activity
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const LogEntry = ({ id, timestamp, source, event, status, resolved, onResolve, index }) => {
  const sourceIcons = {
    github: <Globe size={12} />,
    document: <FileText size={12} />,
    system: <Cpu size={12} />,
    agent: <ShieldCheck size={12} />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: resolved ? 0.4 : 1, y: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.02 }}
      className={`flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8 py-5 px-6 md:px-10 border-b border-white/5 hover:bg-white/[0.03] transition-all group`}
    >
      <div className="flex justify-between items-center md:col-span-2">
        <div className="text-cobalt-muted tabular-nums font-mono text-[9px] md:text-[10px] tracking-widest uppercase">
          {timestamp.split(',')[1]}
        </div>
        <div className="md:hidden">
            <span className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase tracking-widest ${
              status === 'Flagged' ? 'border-risk-high text-risk-high bg-risk-high/10' : 'border-risk-low text-risk-low'
            }`}>
              {status === 'Flagged' ? 'Alert' : 'Clear'}
            </span>
        </div>
      </div>
      
      <div className="md:col-span-2 flex items-center">
        <span className="px-2 md:px-3 py-1 bg-cobalt-accent/10 border border-cobalt-accent/20 rounded-lg text-cobalt-accent uppercase text-[8px] md:text-[9px] font-black flex items-center gap-2 tracking-widest w-fit">
          {sourceIcons[source] || <Terminal size={10} />} {source}
        </span>
      </div>

      <div className={`md:col-span-5 text-slate-100 group-hover:text-white transition-colors font-medium tracking-wide text-xs md:text-sm ${resolved ? 'line-through opacity-50' : ''}`}>
        {event}
      </div>

      <div className="hidden md:flex md:col-span-1 justify-center">
        <span className={`px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${
          status === 'Flagged' ? 'border-risk-high text-risk-high bg-risk-high/10 animate-pulse' : 'border-risk-low text-risk-low bg-risk-low/10'
        }`}>
          {status === 'Flagged' ? 'Alert' : 'Clear'}
        </span>
      </div>

      <div className="md:col-span-2 flex justify-end items-center mt-2 md:mt-0">
        {!resolved && status === 'Flagged' ? (
          <button 
            // FIXED: Passing the ID back to the handler
            onClick={() => onResolve(id)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-risk-low/20 border border-risk-low/40 rounded-xl text-[9px] font-black uppercase text-risk-low hover:bg-risk-low hover:text-white transition-all shadow-lg"
          >
            <CheckCircle size={14} /> Fix
          </button>
        ) : (
          <span className="text-[9px] font-black uppercase text-white/30 italic tracking-widest">
            {resolved ? 'Verified_Patch' : 'Sector_Stable'}
          </span>
        )}
      </div>
    </motion.div>
  );
};

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSource, setActiveSource] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, resolved: 0 });
  const logsPerPage = 15;
  
  const fetchLogs = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsRefreshing(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts?t=${Date.now()}`);
      const data = await res.json();
      if (res.ok) {
        const formattedLogs = data.map(item => ({
          id: item.id,
          timestamp: new Date(item.created_at).toLocaleString('en-IN', { hour12: false }),
          source: item.source || 'github',
          event: item.message,
          status: item.risk === 'critical' ? 'Flagged' : 'Success',
          risk: item.risk,
          resolved: item.resolved
        }));
        setLogs(formattedLogs);
        setStats({ 
          total: data.length, 
          critical: data.filter(a => a.risk === 'critical' && !a.resolved).length,
          resolved: data.filter(a => a.resolved).length
        });
      }
    } catch (err) { console.error(err); } finally { if (!isAutoRefresh) setIsRefreshing(false); }
  };

  // The missing function that was causing the error
  const handleResolve = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) {
        // Refresh logs after successful resolution
        fetchLogs(true);
        // Optional success toast
        Swal.fire({
          toast: true, position: 'top-end', icon: 'success',
          title: 'SECURITY_PATCH_APPLIED',
          background: '#0B1221', color: '#10B981', showConfirmButton: false, timer: 2000
        });
      }
    } catch (err) { console.error("Resolution Error:", err); }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => fetchLogs(true), 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSource = activeSource === 'all' || log.source.toLowerCase() === activeSource;
      return matchesSearch && matchesSource;
    });
  }, [searchTerm, logs, activeSource]);

  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * logsPerPage;
    return filteredLogs.slice(startIndex, startIndex + logsPerPage);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        <motion.main 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="p-4 sm:p-8 lg:p-12 space-y-8 md:space-y-12 max-w-[1700px] mx-auto w-full"
        >
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tighter uppercase italic">
                Audit_<span className="text-cobalt-accent">History</span>
              </h2>
              <div className="flex items-center gap-4">
                <p className="text-cobalt-muted text-[8px] md:text-[10px] uppercase tracking-[0.4em] font-black flex items-center gap-2">
                  <Activity size={12} className="text-risk-low animate-pulse"/> Live_Perimeter_Updates
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
              <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex w-full sm:w-auto overflow-x-auto no-scrollbar">
                {['all', 'github', 'drive', 'document'].map((source) => (
                  <button
                    key={source}
                    onClick={() => {setActiveSource(source); setCurrentPage(1);}}
                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeSource === source ? 'bg-cobalt-accent text-cobalt-bg' : 'text-cobalt-muted'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cobalt-muted" size={14} />
                <input 
                  type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH_LOGS..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-[10px] font-bold text-white focus:border-cobalt-accent outline-none transition-all placeholder:text-slate-600 uppercase"
                />
              </div>
              <button onClick={() => fetchLogs()} className="p-3 bg-white/5 border border-white/10 rounded-xl text-cobalt-accent"><RefreshCcw size={16} className={isRefreshing ? 'animate-spin' : ''} /></button>
            </div>
          </div>

          <Card className="p-0 border-white/5 overflow-hidden bg-white/[0.01] backdrop-blur-3xl rounded-[2rem] md:rounded-[3rem] shadow-2xl">
            <div className="hidden md:grid grid-cols-12 gap-8 py-6 px-10 bg-white/[0.04] border-b border-white/10 text-[9px] uppercase font-black tracking-[0.3em] text-cobalt-muted italic">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-5">Event Description</div>
              <div className="col-span-1 text-center">Risk</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log, index) => (
                    // FIXED: Passing handleResolve as the onResolve prop
                    <LogEntry key={log.id} {...log} index={index} onResolve={handleResolve} />
                  ))
                ) : (
                  <div className="py-40 text-center opacity-20 uppercase tracking-[1em] text-xs">-- No Records Found --</div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-6 md:p-10 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
              <span className="text-[10px] text-cobalt-muted uppercase font-black tracking-widest font-mono">
                Page {currentPage} of {totalPages || 1}
              </span>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-cobalt-accent hover:text-cobalt-bg disabled:opacity-10 transition-all"
                >
                  <ChevronLeft size={14}/> Prev
                </button>

                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest hover:bg-cobalt-accent hover:text-cobalt-bg disabled:opacity-10 transition-all"
                >
                  Next <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 pb-10">
            {[
              { label: 'Latency', val: '142ms', color: 'text-white', icon: <Zap size={14}/> },
              { label: 'Total', val: stats.total, color: 'text-cobalt-accent', icon: <Database size={14}/> },
              { label: 'Critical', val: stats.critical, color: 'text-risk-high', icon: <Terminal size={14}/> },
              { label: 'Safe', val: stats.resolved, color: 'text-risk-low', icon: <ShieldCheck size={14}/> }
            ].map((s, i) => (
              <div key={i} className="p-5 md:p-8 bg-white/[0.02] border border-white/5 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden">
                <p className="text-[8px] md:text-[10px] uppercase text-cobalt-muted font-black tracking-widest mb-4">{s.label}</p>
                <h4 className={`text-2xl md:text-4xl font-black font-heading tracking-tighter italic ${s.color}`}>{s.val}</h4>
                <div className="absolute top-4 right-4 opacity-10">{s.icon}</div>
              </div>
            ))}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Logs;