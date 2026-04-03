import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { 
  FileBarChart, ShieldAlert, CheckCircle2, Globe, FileText, 
  Zap, Printer, ShieldCheck, Lock, Fingerprint, Activity,
  AlertTriangle, Cpu
} from 'lucide-react'

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [reportData, setReportData] = useState(null)

  const fetchReport = async (forceRefresh = false) => {
    // ✅ RATE LIMIT FIX: Check Cache first unless "Reset Scan" is clicked
    const cachedReport = localStorage.getItem('auditshield_last_report');
    if (!forceRefresh && cachedReport) {
      setReportData(JSON.parse(cachedReport));
      setLoading(false);
      return;
    }

    setLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/api/reports/generate?t=${Date.now()}`)
      const data = await res.json()
      
      if (data && data.metrics) {
        setReportData(data)
        // Save to cache
        localStorage.setItem('auditshield_last_report', JSON.stringify(data));
      }
    } catch (err) {
      console.error("Intelligence Retrieval Failed:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchReport() }, [])

  const handlePrint = () => window.print();

  if (loading || !reportData) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Cpu className="text-cobalt-accent animate-spin" size={40} />
        <p className="text-cobalt-muted font-black text-[10px] uppercase tracking-[0.4em]">Syncing Neural Metrics...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans">
      <div className="print:hidden"><Sidebar /></div>
      
      <div className="ml-0 md:ml-64 transition-all print:ml-0">
        <div className="print:hidden"><Navbar /></div>

        <main className="p-10 space-y-10 max-w-7xl mx-auto print:p-0 print:max-w-full">
          
          {/* --- UI HEADER --- */}
          <div className="flex justify-between items-start print:hidden border-b border-white/5 pb-8">
            <div className="space-y-1">
              <h2 className="text-4xl font-heading font-black tracking-tighter uppercase italic text-white">
                Audit Brief <span className="text-cobalt-accent">v4.0</span>
              </h2>
              <p className="text-cobalt-muted text-[10px] uppercase font-black tracking-[0.4em]">
                Classified Security Assessment // RID-{reportData?.reportId}
              </p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => fetchReport(true)} className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-xl border border-white/10 text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all">
                <Zap size={14} className="text-cobalt-accent" /> Reset Scan
              </button>
              <Button onClick={handlePrint} className="px-8 py-4 bg-cobalt-accent text-cobalt-bg font-black uppercase tracking-[0.2em] text-[11px] shadow-xl transition-transform active:scale-95">
                <Printer size={16} className="mr-2" /> Dispatch PDF
              </Button>
            </div>
          </div>

          {/* --- PRINTABLE CONTENT --- */}
          <div className="space-y-10 relative print:text-black">
            
            {/* Header for PDF only */}
            <div className="hidden print:block border-b-2 border-black pb-4 mb-8">
                <h1 className="text-2xl font-bold uppercase tracking-tight">Perimeter Security Audit Report</h1>
                <div className="flex justify-between text-[10px] mt-2 font-mono uppercase">
                    <span>Report ID: {reportData?.reportId}</span>
                    <span>Date: {new Date(reportData?.timestamp).toLocaleDateString()}</span>
                </div>
            </div>

            {/* AI Summary Table (Print Optimized) */}
            <div className="print:block">
                <h3 className="hidden print:block text-xs font-bold uppercase mb-2">01. Executive Intelligence Summary</h3>
                <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2rem] print:bg-white print:border-black print:p-4 print:rounded-none">
                    <p className="text-2xl font-medium leading-[1.4] text-slate-100 italic print:text-[12px] print:not-italic print:font-normal">
                        "{reportData?.summary}"
                    </p>
                </div>
            </div>

            {/* Metrics Table (Pure Data for PDF) */}
            <div className="print:mt-8">
                <h3 className="hidden print:block text-xs font-bold uppercase mb-2">02. Quantitative Telemetry</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 print:grid-cols-1 print:gap-0">
                    {[
                        { label: 'Security Score', val: `${reportData?.score}%`, desc: 'Overall Defense Grade' },
                        { label: 'Total Incidents', val: reportData?.metrics?.total_incidents, desc: 'Logged security events' },
                        { label: 'Critical Breaches', val: reportData?.metrics?.critical_threats, desc: 'High-risk unmitigated leaks' },
                        { label: 'Neutralized', val: reportData?.metrics?.resolved_actions, desc: 'Threats successfully eliminated' }
                    ].map((m, i) => (
                        <div key={i} className="p-6 bg-white/5 rounded-3xl print:flex print:justify-between print:bg-white print:border-b print:border-black print:rounded-none print:px-2 print:py-3">
                            <div className="print:flex print:flex-col">
                                <span className="text-[9px] font-black uppercase text-slate-500 print:text-black print:font-bold">{m.label}</span>
                                <span className="hidden print:block text-[8px] italic">{m.desc}</span>
                            </div>
                            <span className="block text-2xl font-black mt-2 print:mt-0 print:text-[14px]">{m.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Vector Table (Professional List) */}
            <div className="print:mt-8">
                <h3 className="hidden print:block text-xs font-bold uppercase mb-2">03. Vector Distribution</h3>
                <Card className="p-8 bg-slate-900/40 border-white/5 rounded-[2.5rem] print:p-0 print:border-none print:rounded-none">
                    <table className="w-full text-left print:border-collapse">
                        <thead className="print:border-b-2 print:border-black">
                            <tr className="text-[10px] uppercase font-black tracking-widest text-slate-500 print:text-black">
                                <th className="pb-4 print:pb-2">Audit Vector</th>
                                <th className="pb-4 print:pb-2">Frequency</th>
                                <th className="pb-4 print:pb-2">Weight</th>
                            </tr>
                        </thead>
                        <tbody className="print:text-[10px]">
                            <tr className="border-t border-white/5 print:border-black">
                                <td className="py-4 flex items-center gap-3 print:py-2">
                                    <Globe size={14} className="text-cobalt-accent print:hidden"/> GitHub Repositories
                                </td>
                                <td className="py-4 font-mono print:py-2">{reportData?.distribution?.github}</td>
                                <td className="py-4 print:py-2 text-[9px] text-cobalt-muted print:text-black italic">Active Monitoring</td>
                            </tr>
                            <tr className="border-t border-white/5 print:border-black">
                                <td className="py-4 flex items-center gap-3 print:py-2">
                                    <FileText size={14} className="text-risk-high print:hidden"/> Document Metadata
                                </td>
                                <td className="py-4 font-mono print:py-2">{reportData?.distribution?.documents}</td>
                                <td className="py-4 print:py-2 text-[9px] text-cobalt-muted print:text-black italic">Neural Scanning</td>
                            </tr>
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* Footer Signature */}
            <div className="pt-12 border-t border-white/5 flex justify-between items-end print:border-black print:mt-12 print:pt-4">
                <div className="max-w-xs space-y-4">
                    <p className="text-[9px] text-slate-600 print:text-black">
                        Generated by AuditShield Neural Engine. This document is a certified snapshot of current security telemetry.
                    </p>
                </div>
                <div className="text-right">
                    <div className="hidden print:block w-32 h-1 border-b border-black mb-1"></div>
                    <p className="text-[10px] font-black uppercase text-white print:text-black italic">H. Mahapatra</p>
                    <p className="text-[8px] text-slate-500 print:text-black font-bold uppercase">Authorized Auditor</p>
                </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        @media print {
          @page { margin: 15mm; }
          body { background: white !important; font-family: 'Times New Roman', serif !important; }
          .print\\:hidden, aside, nav, button { display: none !important; }
          .print\\:ml-0 { margin-left: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:text-black { color: black !important; }
          .rounded-\\[2rem\\], .rounded-3xl, .rounded-\\[2\\.5rem\\] { border-radius: 0 !important; }
          .shadow-xl, .shadow-2xl, .backdrop-blur-xl { box-shadow: none !important; backdrop-filter: none !important; }
          .bg-slate-900\\/40, .bg-white\\/5 { background: white !important; }
        }
      `}</style>
    </div>
  )
}

export default Reports