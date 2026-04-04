"use client";

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { 
  FileText, Globe, HardDrive, Printer, 
  Zap, Cpu, RefreshCcw, Database
} from 'lucide-react'

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [metrics, setMetrics] = useState({
    score: 100,
    total: 0,
    critical: 0,
    resolved: 0,
    github: 0,
    drive: 0,
    document: 0
  })

  const processLogData = (rawData) => {
    const total = rawData.length;
    const critical = rawData.filter(l => l.risk === 'critical' && !l.resolved).length;
    const resolved = rawData.filter(l => l.resolved).length;
    
    // Calculate a dynamic Defense Score
    const score = total === 0 ? 100 : Math.max(0, Math.floor(((total - critical) / total) * 100));

    const distribution = {
      github: rawData.filter(l => l.source === 'github').length,
      drive: rawData.filter(l => l.source === 'drive').length,
      document: rawData.filter(l => l.source === 'document').length,
    };

    setMetrics({ score, total, critical, resolved, ...distribution });
    setLogs(rawData);
  };

  const fetchFullAuditData = async (forceRefresh = false) => {
    setLoading(true);
    try {
      // Using the live alerts route from Logs page to get the most recent data
      const res = await fetch(`http://localhost:5000/api/alerts?t=${Date.now()}`);
      const data = await res.json();
      
      if (res.ok) {
        processLogData(data);
      }
    } catch (err) {
      console.error("Forensic Retrieval Failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFullAuditData() }, [])

  const handlePrint = () => window.print();

  const getLogsBySource = (source) => logs.filter(log => log.source.toLowerCase() === source.toLowerCase());

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Cpu className="text-cobalt-accent animate-spin" size={40} />
    </div>
  )

  const LogTable = ({ title, logItems }) => (
    <div className="mt-12 break-after-page">
      <h3 className="text-xl font-heading font-black uppercase tracking-tight border-b-2 border-white/10 pb-2 mb-6 print:text-black print:border-black print:text-lg">
        {title} Vector Analysis
      </h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-500 border-b border-white/10 print:text-black print:border-black">
            <th className="py-3 px-2">Timestamp</th>
            <th className="py-3 px-2">Resource_ID</th>
            <th className="py-3 px-2">Security_Event_Description</th>
            <th className="py-3 px-2 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="text-[11px] print:text-[10px]">
          {logItems.length > 0 ? logItems.map((log, i) => (
            <tr key={i} className="border-b border-white/5 print:border-black">
              <td className="py-3 px-2 font-mono whitespace-nowrap">
                {new Date(log.created_at).toLocaleString('en-IN', { hour12: false })}
              </td>
              <td className="py-3 px-2 opacity-60 font-mono print:opacity-100">
                {log.id.slice(0, 8).toUpperCase()}
              </td>
              <td className="py-3 px-2 font-medium print:text-black">{log.message}</td>
              <td className={`py-3 px-2 text-right font-black uppercase ${log.risk === 'critical' ? 'text-risk-high print:text-black' : 'text-risk-low print:text-black'}`}>
                {log.resolved ? 'RESOLVED' : log.risk}
              </td>
            </tr>
          )) : (
            <tr><td colSpan="4" className="py-8 text-center opacity-40 italic">No anomalies detected in this perimeter sector.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans print:bg-white">
      <div className="print:hidden"><Sidebar /></div>
      
      <div className="ml-0 md:ml-64 transition-all print:ml-0">
        <div className="print:hidden"><Navbar /></div>

        <main className="p-10 space-y-10 max-w-7xl mx-auto print:p-0 print:max-w-full print:text-black">
          
          {/* WEB UI HEADER */}
          <div className="flex justify-between items-end print:hidden border-b border-white/5 pb-8">
            <div className="space-y-1">
              <h2 className="text-4xl font-heading font-black tracking-tighter uppercase italic text-white">
                Final_<span className="text-cobalt-accent">Audit_Export</span>
              </h2>
              <p className="text-cobalt-muted text-[10px] uppercase font-black tracking-[0.4em]">
                System Forensic Summary // Total Frames: {logs.length}
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => fetchFullAuditData(true)} className="px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all flex items-center gap-2">
                <RefreshCcw size={14} /> Refresh Data
              </button>
              <Button onClick={handlePrint} className="px-8 py-4 bg-cobalt-accent text-cobalt-bg font-black uppercase tracking-[0.2em] text-[11px]">
                <Printer size={16} className="mr-2" /> Export to PDF
              </Button>
            </div>
          </div>

          <div className="print:block">
            
            {/* PDF LETTERHEAD */}
            <div className="hidden print:flex justify-between items-start border-b-[3px] border-black pb-4 mb-8">
              <div>
                <h1 className="text-2xl font-black uppercase">AuditShield Security Forensic Report</h1>
                <p className="text-[10px] font-bold tracking-widest uppercase">Automated Perimeter Assessment</p>
              </div>
              <div className="text-right text-[9px] font-mono">
                <p>REF: AS-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p>DATE: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* QUICK METRICS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 print:grid-cols-4 print:border-b print:border-black print:pb-6">
               {[
                 { label: 'Defense Score', val: `${metrics.score}%` },
                 { label: 'Total Incidents', val: metrics.total },
                 { label: 'Critical Leaks', val: metrics.critical },
                 { label: 'Remediated', val: metrics.resolved }
               ].map((m, i) => (
                 <div key={i} className="bg-white/5 p-6 rounded-3xl print:bg-white print:p-2">
                    <span className="block text-[9px] font-black uppercase text-cobalt-muted print:text-black">{m.label}</span>
                    <span className="block text-3xl font-black print:text-xl">{m.val}</span>
                 </div>
               ))}
            </section>

            {/* DETAILED TABLES - ONE PER SOURCE */}
            <LogTable title="GitHub Repositories" logItems={getLogsBySource('github')} />
            <LogTable title="Google Drive Storage" logItems={getLogsBySource('drive')} />
            <LogTable title="System Documents" logItems={getLogsBySource('document')} />

            {/* PDF SIGNATURE */}
            <footer className="mt-20 pt-10 border-t border-white/5 flex justify-between items-end print:border-black print:text-black">
                <div className="text-[9px] max-w-sm opacity-50 print:opacity-100">
                    <p className="font-bold uppercase mb-1">Confidentiality Notice</p>
                    <p>This report contains sensitive security telemetry. Unauthorized distribution is prohibited. Generated by Neural Engine v4.0.</p>
                </div>
                <div className="text-right">
                    <div className="w-40 border-b border-black mb-2 hidden print:block"></div>
                    <p className="text-[10px] font-black uppercase italic">H. Mahapatra</p>
                    <p className="text-[8px] font-bold uppercase opacity-60 print:opacity-100">Chief Security Auditor</p>
                </div>
            </footer>
          </div>
        </main>
      </div>

      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body { background: white !important; color: black !important; }
          .print\\:hidden, aside, nav, button { display: none !important; }
          .print\\:ml-0 { margin-left: 0 !important; }
          .print\\:text-black { color: black !important; }
          .rounded-3xl, .rounded-xl { border-radius: 0 !important; }
          .bg-white\\/5 { background: transparent !important; border: none !important; }
          table { page-break-inside: auto; border-bottom: 1px solid black; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          .break-after-page { page-break-after: auto; margin-bottom: 40px; }
          * { color: black !important; text-shadow: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}

export default Reports