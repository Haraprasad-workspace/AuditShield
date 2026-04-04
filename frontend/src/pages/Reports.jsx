"use client";

import React, { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Button from '../components/ui/Button'
import { 
  FileText, Globe, HardDrive, Printer, 
  Zap, Cpu, RefreshCcw, Database
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])
  const [metrics, setMetrics] = useState({
    score: 100, total: 0, critical: 0, resolved: 0, github: 0, drive: 0, document: 0
  })

  const processLogData = (rawData) => {
    const total = rawData.length;
    const critical = rawData.filter(l => l.risk === 'critical' && !l.resolved).length;
    const resolved = rawData.filter(l => l.resolved).length;
    const score = total === 0 ? 100 : Math.max(0, Math.floor(((total - critical) / total) * 100));

    setMetrics({ 
      score, total, critical, resolved,
      github: rawData.filter(l => l.source === 'github').length,
      drive: rawData.filter(l => l.source === 'drive').length,
      document: rawData.filter(l => l.source === 'document').length,
    });
    setLogs(rawData);
  };

  const fetchFullAuditData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts?t=${Date.now()}`);
      const data = await res.json();
      if (res.ok) processLogData(data);
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
    <div className="mt-8 md:mt-12 break-after-page">
      <h3 className="text-lg md:text-xl font-heading font-black uppercase tracking-tight border-b-2 border-white/10 pb-2 mb-4 md:mb-6 print:text-black print:border-black print:text-lg italic">
        {title} Vector Analysis
      </h3>
      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-slate-500 border-b border-white/10 print:text-black print:border-black">
              <th className="py-3 px-2">Timestamp</th>
              <th className="py-3 px-2">Resource_ID</th>
              <th className="py-3 px-2">Description</th>
              <th className="py-3 px-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="text-[10px] md:text-[11px] print:text-[10px]">
            {logItems.length > 0 ? logItems.map((log, i) => (
              <tr key={i} className="border-b border-white/5 print:border-black hover:bg-white/[0.02]">
                <td className="py-3 px-2 font-mono whitespace-nowrap opacity-70">
                  {new Date(log.created_at).toLocaleString('en-IN', { hour12: false, dateStyle: 'short', timeStyle: 'short' })}
                </td>
                <td className="py-3 px-2 opacity-60 font-mono tracking-tighter">
                  {log.id.slice(0, 8).toUpperCase()}
                </td>
                <td className="py-3 px-2 font-medium print:text-black truncate max-w-[200px] md:max-w-none">{log.message}</td>
                <td className={`py-3 px-2 text-right font-black uppercase ${log.risk === 'critical' ? 'text-risk-high' : 'text-risk-low'}`}>
                  {log.resolved ? 'RESOLVED' : log.risk}
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" className="py-8 text-center opacity-40 text-[10px] uppercase tracking-widest italic">-- Perimeter Sector Clear --</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans print:bg-white selection:bg-cobalt-accent/30 overflow-x-hidden">
      <div className="print:hidden"><Sidebar /></div>
      
      <div className="ml-0 md:ml-64 transition-all duration-300 print:ml-0">
        <div className="print:hidden"><Navbar /></div>

        <main className="p-4 sm:p-8 md:p-10 space-y-8 md:space-y-10 max-w-7xl mx-auto print:p-0 print:max-w-full print:text-black">
          
          {/* WEB UI HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end print:hidden border-b border-white/5 pb-8 gap-6">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-heading font-black tracking-tighter uppercase italic text-white">
                Audit_<span className="text-cobalt-accent">Briefing</span>
              </h2>
              <p className="text-cobalt-muted text-[8px] md:text-[10px] uppercase font-black tracking-[0.3em]">
                System Forensic Summary // Logs: {logs.length}
              </p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <button onClick={fetchFullAuditData} className="flex-1 md:flex-none px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black uppercase text-white hover:bg-white/10 flex items-center justify-center gap-2">
                <RefreshCcw size={14} /> Sync
              </button>
              <Button onClick={handlePrint} className="flex-1 md:flex-none px-6 py-3 bg-cobalt-accent text-cobalt-bg font-black uppercase tracking-widest text-[9px] flex items-center justify-center gap-2">
                <Printer size={16} /> PDF Export
              </Button>
            </div>
          </div>

          <div className="print:block">
            {/* PDF LETTERHEAD */}
            <div className="hidden print:flex justify-between items-start border-b-[3px] border-black pb-4 mb-8">
              <div>
                <h1 className="text-2xl font-black uppercase">AuditShield Forensic Report</h1>
                <p className="text-[10px] font-bold tracking-widest uppercase">Automated Intelligence Assessment</p>
              </div>
              <div className="text-right text-[9px] font-mono">
                <p>REF: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                <p>DATE: {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* QUICK METRICS */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 print:grid-cols-4 print:border-b print:border-black print:pb-6">
               {[
                 { label: 'Defense Score', val: `${metrics.score}%`, color: 'text-cobalt-accent' },
                 { label: 'Incidents', val: metrics.total, color: 'text-white' },
                 { label: 'Critical', val: metrics.critical, color: 'text-risk-high' },
                 { label: 'Fixed', val: metrics.resolved, color: 'text-risk-low' }
               ].map((m, i) => (
                 <div key={i} className="bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl print:bg-white print:p-0">
                    <span className="block text-[8px] md:text-[9px] font-black uppercase text-cobalt-muted print:text-black">{m.label}</span>
                    <span className={`block text-xl md:text-3xl font-black ${m.color} print:text-black`}>{m.val}</span>
                 </div>
               ))}
            </section>

            {/* DETAILED TABLES */}
            <LogTable title="GitHub Perimeter" logItems={getLogsBySource('github')} />
            <LogTable title="Cloud Storage" logItems={getLogsBySource('drive')} />
            <LogTable title="Static Artifacts" logItems={getLogsBySource('document')} />

            {/* PDF SIGNATURE */}
            <footer className="mt-12 md:mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 print:border-black print:text-black">
                <div className="text-[8px] md:text-[9px] max-w-sm opacity-50 print:opacity-100 italic">
                    <p className="font-bold uppercase mb-1 not-italic">Confidentiality Notice</p>
                    <p>This document contains sensitive security telemetry. Unauthorized distribution is prohibited. Generated by AuditShield Engine v4.0.</p>
                </div>
                <div className="text-left md:text-right w-full md:w-auto">
                    <div className="w-40 border-b border-black mb-2 hidden print:block ml-auto"></div>
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
          .rounded-2xl, .rounded-3xl, .rounded-xl { border-radius: 0 !important; }
          .bg-white\\/5 { background: transparent !important; border: none !important; }
          table { width: 100% !important; border-bottom: 1px solid black; }
          * { color: black !important; text-shadow: none !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  )
}

export default Reports;