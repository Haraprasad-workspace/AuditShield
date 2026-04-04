"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added for animations
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Swal from 'sweetalert2';
import { 
  Terminal, Search, Cpu, Database, 
  Globe, ShieldCheck, RefreshCcw, 
  ChevronLeft, ChevronRight, FileText, CheckCircle,
  Zap, Activity
} from 'lucide-react';

const LogEntry = ({ id, timestamp, source, event, status, resolved, onResolve, index }) => {
  const sourceIcons = {
    github: <Globe size={14} />,
    document: <FileText size={14} />,
    system: <Cpu size={14} />,
    agent: <ShieldCheck size={14} />
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: resolved ? 0.4 : 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ delay: index * 0.03 }}
      className={`grid grid-cols-12 gap-8 py-5 px-10 border-b border-white/5 hover:bg-white/[0.03] transition-all group items-center`}
    >
      <div className="col-span-2 text-cobalt-muted tabular-nums font-mono text-[10px] tracking-widest uppercase">
        {timestamp}
      </div>
      
      <div className="col-span-2 flex items-center">
        <span className="px-3 py-1 bg-cobalt-accent/10 border border-cobalt-accent/20 rounded-lg text-cobalt-accent uppercase text-[9px] font-black flex items-center gap-2 tracking-[0.1em]">
          {sourceIcons[source] || <Terminal size={12} />} {source}
        </span>
      </div>

      <div className={`col-span-5 text-slate-100 group-hover:text-white transition-colors truncate font-medium tracking-wide text-xs ${resolved ? 'line-through decoration-cobalt-accent/40' : ''}`}>
        {event}
      </div>

      <div className="col-span-1 flex justify-center">
        <span className={`px-3 py-1 rounded border text-[9px] font-black uppercase tracking-widest ${
          status === 'Flagged' ? 'border-risk-high text-risk-high bg-risk-high/10 animate-pulse' : 
          status === 'Success' ? 'border-risk-low text-risk-low bg-risk-low/10' : 
          'border-amber-500 text-amber-500 bg-amber-500/10'
        }`}>
          {status === 'Flagged' ? 'Alert' : 'Clear'}
        </span>
      </div>

      <div className="col-span-2 flex justify-end">
        {!resolved && status === 'Flagged' ? (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onResolve(id)}
            className="flex items-center gap-2 px-4 py-2 bg-risk-low/20 border border-risk-low/40 rounded-xl text-[9px] font-black uppercase text-risk-low hover:bg-risk-low hover:text-white transition-all shadow-lg"
          >
            <CheckCircle size={14} /> Fix Issue
          </motion.button>
        ) : (
          <span className="text-[9px] font-black uppercase text-white/30 italic tracking-widest">
            {resolved ? 'Verified' : 'Stable'}
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
  const logsPerPage = 20;
  
  const lastLogCount = useRef(0);

  const fetchLogs = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsRefreshing(true);
    try {
      const res = await fetch(`http://localhost:5000/api/alerts?t=${Date.now()}`);
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

        if (isAutoRefresh && formattedLogs.length > lastLogCount.current) {
          const latest = formattedLogs[0];
          if (latest.risk === 'critical' && !latest.resolved) {
            Swal.fire({
              toast: true, position: 'top-end', icon: 'warning',
              title: 'THREAT DETECTED', text: latest.event,
              background: '#0B1221', color: '#fff', showConfirmButton: false, timer: 3000
            });
          }
        }
        setLogs(formattedLogs);
        lastLogCount.current = formattedLogs.length;
        setStats({ 
          total: data.length, 
          critical: data.filter(a => a.risk === 'critical' && !a.resolved).length,
          resolved: data.filter(a => a.resolved).length
        });
      }
    } catch (err) {
      console.error("Log Fetch Error:", err.message);
    } finally {
      if (!isAutoRefresh) setIsRefreshing(false);
    }
  };

  const handleResolve = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alerts/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) fetchLogs(true);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => fetchLogs(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = log.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           log.source.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent/30 font-sans">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <motion.main 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="p-10 lg:p-14 space-y-12 max-w-[1700px] mx-auto w-full"
        >
          
          {/* --- TOP SECTION --- */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
            <div className="space-y-4">
              <h2 className="text-6xl font-heading font-black text-white flex items-center gap-6 tracking-tighter uppercase italic">
                Audit_<span className="text-cobalt-accent">History</span>
              </h2>
              <div className="flex items-center gap-6">
                <p className="text-cobalt-muted text-[10px] uppercase tracking-[0.5em] font-black flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-risk-low animate-pulse shadow-[0_0_15px_#10B981]"></span>
                  Live_Updates_Active
                </p>
                <div className="h-px w-32 bg-white/10"></div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-6 w-full xl:w-auto items-center">
              <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-1">
                {['all', 'github', 'document', 'system'].map((source) => (
                  <button
                    key={source}
                    onClick={() => {setActiveSource(source); setCurrentPage(1);}}
                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeSource === source ? 'bg-cobalt-accent text-cobalt-bg' : 'text-cobalt-muted hover:text-white'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 xl:w-96">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-cobalt-muted" size={16} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH LOGS OR SOURCE..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white focus:border-cobalt-accent outline-none transition-all placeholder:text-slate-600 uppercase tracking-widest"
                />
              </div>
              
              <motion.button 
                whileTap={{ scale: 0.9 }}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-cobalt-accent transition-all text-cobalt-accent group" 
                onClick={() => fetchLogs()}
              >
                <RefreshCcw size={20} className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              </motion.button>
            </div>
          </div>

          {/* --- AUDIT CONSOLE --- */}
          <Card className="p-0 border-white/5 overflow-hidden bg-white/[0.01] backdrop-blur-3xl rounded-[3rem] shadow-2xl">
            <div className="grid grid-cols-12 gap-8 py-7 px-12 bg-white/[0.04] border-b border-white/10 text-[10px] uppercase font-black tracking-[0.4em] text-cobalt-muted italic">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-5">Event Description</div>
              <div className="col-span-1 text-center">Risk</div>
              <div className="col-span-2 text-right">Quick Actions</div>
            </div>

            <div className="min-h-[700px]">
              <AnimatePresence mode="wait">
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log, index) => (
                    <LogEntry key={log.id} {...log} index={index} onResolve={handleResolve} />
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="py-60 text-center flex flex-col items-center justify-center opacity-30"
                  >
                    <Database size={80} className="text-cobalt-muted mb-8" />
                    <p className="text-cobalt-muted font-black text-sm uppercase tracking-[1.5em]">
                      No Logs Found
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- PAGINATION --- */}
            <div className="p-10 bg-white/[0.02] border-t border-white/5 flex flex-col xl:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-12">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-risk-low shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-risk-low">System Status: Optimal</span>
                </div>
                <span className="text-[11px] text-cobalt-muted uppercase font-black tracking-widest font-mono border-l border-white/10 pl-12">
                  Page {currentPage} — {filteredLogs.length} Events Total
                </span>
              </div>
              
              <div className="flex items-center gap-8">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cobalt-accent hover:text-cobalt-bg disabled:opacity-10 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft size={18}/> Previous
                </button>

                <div className="text-[10px] font-black text-cobalt-accent bg-cobalt-accent/10 px-4 py-2 rounded-lg border border-cobalt-accent/20">
                  {currentPage} / {totalPages || 1}
                </div>

                <button 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cobalt-accent hover:text-cobalt-bg disabled:opacity-10 disabled:pointer-events-none transition-all"
                >
                  Next <ChevronRight size={18}/>
                </button>
              </div>
            </div>
          </Card>

          {/* --- SUMMARY HUB --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 pb-20">
            {[
              { label: 'Sync Latency', val: '142ms', color: 'text-white', icon: <Zap size={20}/> },
              { label: 'Total Events', val: stats.total, color: 'text-cobalt-accent', icon: <Database size={20}/> },
              { label: 'Open Threats', val: stats.critical, color: 'text-risk-high', icon: <Terminal size={20}/> },
              { label: 'Verified Safe', val: stats.resolved, color: 'text-risk-low', icon: <ShieldCheck size={20}/> }
            ].map((s, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-cobalt-accent/30 transition-all group overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                    {s.icon}
                </div>
                <p className="text-[11px] uppercase text-cobalt-muted font-black tracking-[0.4em] mb-6 group-hover:text-cobalt-accent transition-colors">
                  {s.label}
                </p>
                <h4 className={`text-5xl font-black font-heading tracking-tighter italic ${s.color}`}>
                  {s.val}
                </h4>
              </motion.div>
            ))}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default Logs;