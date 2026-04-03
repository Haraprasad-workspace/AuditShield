import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Swal from 'sweetalert2'
import { 
  Terminal, Search, Filter, Cpu, Database, 
  Globe, HardDrive, ShieldCheck, Download, 
  RefreshCcw, ChevronLeft, ChevronRight 
} from 'lucide-react'

const LogEntry = ({ timestamp, source, event, status }) => {
  const sourceIcons = {
    github: <Globe size={14} />,
    drive: <HardDrive size={14} />,
    system: <Cpu size={14} />,
    agent: <ShieldCheck size={14} />
  }

  return (
    <div className="grid grid-cols-12 gap-4 py-3 px-6 border-b border-cobalt-border/30 hover:bg-cobalt-accent/5 transition-all group items-center font-mono text-[11px] animate-in fade-in duration-300">
      <div className="col-span-2 text-cobalt-muted tabular-nums">{timestamp}</div>
      <div className="col-span-2 flex items-center gap-2">
        <span className="px-2 py-1 bg-cobalt-bg border border-cobalt-border rounded-md text-cobalt-accent uppercase text-[9px] font-black flex items-center gap-1.5 shadow-sm">
          {sourceIcons[source] || <Terminal size={12} />} {source}
        </span>
      </div>
      <div className="col-span-6 text-white group-hover:text-cobalt-accent transition-colors truncate font-medium">
        {event}
      </div>
      <div className="col-span-2 flex justify-end">
        <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black uppercase tracking-tighter ${
          status === 'Flagged' ? 'border-risk-high text-risk-high bg-risk-high/5' : 
          status === 'Success' ? 'border-risk-low text-risk-low bg-risk-low/5' : 
          'border-amber-500 text-amber-500 bg-amber-500/5'
        }`}>
          {status}
        </span>
      </div>
    </div>
  )
}

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, critical: 0 });

  // 🔄 FETCH FROM BACKEND: Pulls data from your Express API
  const fetchLogs = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) setIsRefreshing(true);
    
    try {
      const res = await fetch("http://localhost:5000/api/alerts");
      const data = await res.json();

      if (res.ok) {
        // Map backend data to UI format
        const formattedLogs = data.map(item => ({
          timestamp: new Date(item.created_at).toLocaleString(),
          source: item.source || 'github',
          event: item.message,
          status: item.risk === 'critical' ? 'Flagged' : 'Success',
          risk: item.risk
        }));

        // Only show Toast if new critical logs arrived during auto-refresh
        if (isAutoRefresh && formattedLogs.length > logs.length) {
            const hasNewCritical = formattedLogs[0].risk === 'critical';
            if (hasNewCritical) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'warning',
                    title: 'New Security Breach Detected',
                    background: '#0B1221',
                    color: '#fff',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        }

        setLogs(formattedLogs);
        
        const criticalCount = data.filter(a => a.risk === 'critical').length;
        setStats({ total: data.length, critical: criticalCount });
      }
    } catch (err) {
      console.error("Backend Log Sync Error:", err.message);
    } finally {
      if (!isAutoRefresh) setIsRefreshing(false);
    }
  }

  useEffect(() => {
    fetchLogs();

    // ⏲️ LONG POLLING: Sync with backend every 10 seconds
    const interval = setInterval(() => {
      fetchLogs(true);
    }, 10000);

    return () => clearInterval(interval);
  }, [logs.length]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.source.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, logs]);

  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8 space-y-6">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3 tracking-tight">
                <Terminal className="text-cobalt-accent" /> SYSTEM AUDIT TRAIL
              </h2>
              <p className="text-cobalt-muted text-[10px] mt-1 uppercase tracking-[0.2em] font-black">
                Backend-Verified Operation Logs
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cobalt-muted" size={14} />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter logs by keyword..." 
                  className="w-full bg-cobalt-surface border border-cobalt-border rounded-xl py-2.5 pl-9 pr-4 text-xs text-white focus:border-cobalt-accent outline-none transition-all placeholder:text-gray-600"
                />
              </div>
              <Button variant="outline" className="text-[10px] font-bold uppercase px-4" onClick={() => fetchLogs()}>
                <RefreshCcw size={14} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} /> Sync
              </Button>
              <Button variant="outline" className="text-[10px] font-bold uppercase px-4 border-cobalt-accent/30 text-cobalt-accent">
                <Download size={14} className="mr-2" /> Export
              </Button>
            </div>
          </div>

          <Card className="p-0 border-cobalt-border overflow-hidden bg-cobalt-surface/20 backdrop-blur-md">
            <div className="grid grid-cols-12 gap-4 py-4 px-6 bg-cobalt-surface/60 border-b border-cobalt-border text-[9px] uppercase font-black tracking-[0.25em] text-cobalt-muted">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">Origin Source</div>
              <div className="col-span-6">Audit Payload / Operation</div>
              <div className="col-span-2 text-right">Verification</div>
            </div>

            <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-cobalt-border">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <LogEntry key={index} {...log} />
                ))
              ) : (
                <div className="py-20 text-center text-cobalt-muted font-mono text-xs italic uppercase tracking-widest">
                  -- Perimeter Secured: No Log Entries --
                </div>
              )}
            </div>

            <div className="p-4 bg-cobalt-surface/40 border-t border-cobalt-border flex items-center justify-between font-mono">
              <div className="flex items-center gap-6 text-[10px]">
                <div className="flex items-center gap-2 text-risk-low">
                  <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                  <span className="font-black uppercase tracking-widest uppercase">Backend Linked</span>
                </div>
                <div className="flex items-center gap-2 text-cobalt-muted">
                  <Database size={12} className="text-cobalt-accent" />
                  <span className="font-bold uppercase tracking-widest">Data Integrity: Verified</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-cobalt-muted uppercase font-bold">
                  Showing {filteredLogs.length} Records
                </span>
                <div className="flex gap-1">
                  <button className="p-1.5 border border-cobalt-border rounded bg-cobalt-bg hover:bg-cobalt-surface text-cobalt-muted"><ChevronLeft size={14}/></button>
                  <button className="p-1.5 border border-cobalt-border rounded bg-cobalt-bg hover:bg-cobalt-surface text-cobalt-muted"><ChevronRight size={14}/></button>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl shadow-sm">
                <p className="text-[9px] uppercase text-cobalt-muted font-black tracking-widest mb-1">Audit Latency</p>
                <h4 className="text-xl font-bold font-mono text-white tracking-tighter">142ms</h4>
            </div>
            <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl shadow-sm">
                <p className="text-[9px] uppercase text-cobalt-muted font-black tracking-widest mb-1">Assets Indexed</p>
                <h4 className="text-xl font-bold font-mono text-white tracking-tighter">{stats.total}</h4>
            </div>
            <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl shadow-sm border-risk-high/30">
                <p className="text-[9px] uppercase text-cobalt-muted font-black tracking-widest mb-1 text-risk-high">Detected Risks</p>
                <h4 className="text-xl font-bold font-mono text-risk-high tracking-tighter">{stats.critical}</h4>
            </div>
            <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl shadow-sm">
                <p className="text-[9px] uppercase text-cobalt-muted font-black tracking-widest mb-1">System Trust</p>
                <h4 className="text-xl font-bold font-mono text-risk-low tracking-tighter">99.9%</h4>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Logs