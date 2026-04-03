import React, { useState, useEffect, useMemo, useRef } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Swal from 'sweetalert2'
import { 
  Terminal, Search, Cpu, Database, 
  Globe, ShieldCheck, RefreshCcw, 
  ChevronLeft, ChevronRight, FileText, CheckCircle 
} from 'lucide-react'

const LogEntry = ({ id, timestamp, source, event, status, resolved, onResolve }) => {
  const sourceIcons = {
    github: <Globe size={14} />,
    document: <FileText size={14} />,
    system: <Cpu size={14} />,
    agent: <ShieldCheck size={14} />
  }

  return (
    <div className={`grid grid-cols-12 gap-4 py-3 px-6 border-b border-cobalt-border/30 hover:bg-cobalt-accent/5 transition-all group items-center font-mono text-[11px] animate-in fade-in duration-300 ${resolved ? 'opacity-40' : ''}`}>
      <div className="col-span-2 text-cobalt-muted tabular-nums uppercase">{timestamp}</div>
      <div className="col-span-2 flex items-center gap-2">
        <span className="px-2 py-1 bg-cobalt-bg border border-cobalt-border rounded-md text-cobalt-accent uppercase text-[9px] font-black flex items-center gap-1.5 shadow-sm">
          {sourceIcons[source] || <Terminal size={12} />} {source}
        </span>
      </div>
      <div className={`col-span-5 text-white group-hover:text-cobalt-accent transition-colors truncate font-medium ${resolved ? 'line-through decoration-cobalt-accent/50' : ''}`}>
        {event}
      </div>
      <div className="col-span-1 flex justify-center">
        <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-tighter ${
          status === 'Flagged' ? 'border-risk-high text-risk-high bg-risk-high/5' : 
          status === 'Success' ? 'border-risk-low text-risk-low bg-risk-low/5' : 
          'border-amber-500 text-amber-500 bg-amber-500/5'
        }`}>
          {status}
        </span>
      </div>
      <div className="col-span-2 flex justify-end">
        {!resolved && status === 'Flagged' ? (
          <button 
            onClick={() => onResolve(id)}
            className="flex items-center gap-1.5 px-3 py-1 bg-risk-low/10 border border-risk-low/20 rounded text-[9px] font-black uppercase text-risk-low hover:bg-risk-low hover:text-white transition-all shadow-[0_0_10px_rgba(16,185,129,0.1)]"
          >
            <CheckCircle size={12} /> Neutralize
          </button>
        ) : resolved ? (
          <span className="text-[9px] font-black uppercase text-risk-low italic tracking-[0.2em] opacity-80">Verified Clean</span>
        ) : null}
      </div>
    </div>
  )
}

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0, resolved: 0 });
  
  // ✅ FIX 1: Use a Ref to track counts to avoid closure staleness
  const lastLogCount = useRef(0);

  const fetchLogs = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsRefreshing(true);
    
    try {
      // ✅ FIX 2: Added Cache-Busting Timestamp (?t=...) to bypass browser cache
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

        // Trigger alert only if NEW logs are added (not on every refresh)
        if (isAutoRefresh && formattedLogs.length > lastLogCount.current) {
          const latest = formattedLogs[0];
          if (latest.risk === 'critical' && !latest.resolved) {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'warning',
              title: 'NEW THREAT DETECTED',
              text: latest.event,
              background: '#0B1221',
              color: '#fff',
              showConfirmButton: false,
              timer: 3000
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
      console.error("Neural Trace Failed:", err.message);
    } finally {
      if (!isAutoRefresh) setIsRefreshing(false);
    }
  }

  const handleResolve = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alerts/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.ok) fetchLogs(true);
    } catch (err) {
      console.error("Manual Resolution Error:", err);
    }
  }

  // ✅ FIX 3: Clean useEffect that sets up a single persistent interval
  useEffect(() => {
    fetchLogs();
    const interval = setInterval(() => fetchLogs(true), 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, logs]);

  return (
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent/30">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-8 space-y-6 flex-1">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-3xl font-heading font-black text-white flex items-center gap-4 tracking-tighter uppercase italic">
                <Terminal className="text-cobalt-accent" size={28} /> Perimeter Audit Trace
              </h2>
              <p className="text-cobalt-muted text-[10px] mt-2 uppercase tracking-[0.4em] font-black flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse"></span>
                Grok-1 Intelligence Feed / Live
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cobalt-muted" size={14} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH_BY_HASH_OR_SOURCE..." 
                  className="w-full bg-cobalt-surface/30 border border-cobalt-border/50 rounded-2xl py-3 pl-10 pr-4 text-[10px] font-bold text-white focus:border-cobalt-accent outline-none transition-all placeholder:text-gray-700 uppercase tracking-widest"
                />
              </div>
              <Button 
                variant="outline" 
                className="text-[10px] font-black uppercase px-6 py-3 border-cobalt-border hover:border-cobalt-accent transition-all flex items-center gap-2" 
                onClick={() => fetchLogs()}
              >
                <RefreshCcw size={14} className={isRefreshing ? 'animate-spin' : ''} /> Synchronize
              </Button>
            </div>
          </div>

          <Card className="p-0 border-cobalt-border overflow-hidden bg-cobalt-surface/5 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl">
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-4 py-5 px-8 bg-cobalt-surface/40 border-b border-cobalt-border/50 text-[10px] uppercase font-black tracking-[0.25em] text-cobalt-muted italic">
              <div className="col-span-2">Log Timestamp</div>
              <div className="col-span-2">Origin Vector</div>
              <div className="col-span-5">Audit Payload</div>
              <div className="col-span-1 text-center">Threat</div>
              <div className="col-span-2 text-right">Protocol</div>
            </div>

            {/* Logs List */}
            <div className="max-h-[550px] overflow-y-auto custom-scrollbar">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <LogEntry key={log.id} {...log} onResolve={handleResolve} />
                ))
              ) : (
                <div className="py-32 text-center flex flex-col items-center justify-center opacity-20 group">
                  <Database size={48} className="text-cobalt-muted mb-4 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-cobalt-muted font-black text-[11px] uppercase tracking-[0.5em]">
                    -- Perimeter Trace Buffer Empty --
                  </p>
                </div>
              )}
            </div>

            {/* Footer Stats Row */}
            <div className="p-6 bg-cobalt-bg/40 border-t border-cobalt-border/50 flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-risk-low shadow-[0_0_8px_#10B981]"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-risk-low">DB_Sync: Connected</span>
                </div>
                <div className="flex items-center gap-2.5 text-cobalt-muted">
                  <Database size={14} className="text-cobalt-accent" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Integrity: Verified</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <span className="text-[10px] text-cobalt-muted uppercase font-black tracking-widest font-mono">
                  Frames_Index: {filteredLogs.length}
                </span>
                <div className="flex gap-1.5">
                  <button className="p-2 border border-cobalt-border rounded-xl bg-cobalt-bg hover:bg-cobalt-surface transition-colors text-cobalt-muted hover:text-white border-none shadow-lg">
                    <ChevronLeft size={16}/>
                  </button>
                  <button className="p-2 border border-cobalt-border rounded-xl bg-cobalt-bg hover:bg-cobalt-surface transition-colors text-cobalt-muted hover:text-white border-none shadow-lg">
                    <ChevronRight size={16}/>
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Bottom Summary Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8">
            {[
              { label: 'Neural Latency', val: '142ms', color: 'text-white' },
              { label: 'Trace Volume', val: stats.total, color: 'text-cobalt-accent' },
              { label: 'Active Threats', val: stats.critical, color: 'text-risk-high' },
              { label: 'Remediated', val: stats.resolved, color: 'text-risk-low' }
            ].map((s, i) => (
              <div key={i} className="p-6 bg-cobalt-surface/30 border border-cobalt-border/50 rounded-3xl hover:border-cobalt-accent/40 transition-all group">
                <p className="text-[9px] uppercase text-cobalt-muted font-black tracking-widest mb-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  {s.label}
                </p>
                <h4 className={`text-2xl font-black font-mono tracking-tighter ${s.color}`}>
                  {s.val}
                </h4>
              </div>
            ))}
          </div>
        </main>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #1E293B; 
          border-radius: 20px; 
          border: 1px solid rgba(56,189,248,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  )
}

export default Logs