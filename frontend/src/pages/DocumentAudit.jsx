"use client";

import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Swal from 'sweetalert2'
import { 
  Upload, FileText, ShieldAlert, CheckCircle2, 
  Trash2, Search, AlertTriangle, 
  ShieldCheck, ArrowRight, BarChart3, Fingerprint,
  CheckCircle, Filter, Terminal, Zap, Cpu 
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DocumentAudit = () => {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const [filter, setFilter] = useState('All')

  const fetchDocLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts?source=document`)
      const data = await res.json()
      setAuditLogs(data || [])
    } catch (err) { 
      console.error("Audit Trace Failure:", err) 
    }
  }

  useEffect(() => { fetchDocLogs() }, [])

  const stats = useMemo(() => {
    const uniqueFiles = new Set(auditLogs.map(log => log.filename)).size;
    return {
      totalScans: uniqueFiles,
      totalFindings: auditLogs.length,
      critical: auditLogs.filter(l => l.risk === 'critical').length,
      resolved: auditLogs.filter(l => l.resolved).length
    }
  }, [auditLogs])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setScanResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true)
    setScanResult(null)

    const formData = new FormData()
    formData.append('document', file)

    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()

      if (res.ok) {
        setScanResult(data)
        await fetchDocLogs()
        
        Swal.fire({
          icon: data.findings > 0 ? 'warning' : 'success',
          title: data.findings > 0 ? 'NEURAL ENGINE ALERT' : 'PERIMETER SECURE',
          text: `${data.findings} issues identified in ${file.name}`,
          background: '#0B1221', color: '#fff',
          confirmButtonColor: '#38BDF8',
          customClass: { popup: 'w-[90%] md:w-auto rounded-2xl' }
        })
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'SCAN TIMEOUT', background: '#0B1221', color: '#fff' })
    } finally {
      setIsUploading(false)
    }
  }

  const handleResolve = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/alerts/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) fetchDocLogs()
    } catch (err) { console.error(err) }
  }

  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'Critical') return log.risk === 'critical';
    if (filter === 'Resolved') return log.resolved;
    return true;
  })

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans selection:bg-cobalt-accent/30 overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        <main className="p-4 sm:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto w-full">
          
          {/* --- HEADER --- */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-black tracking-tighter uppercase italic flex items-center gap-3">
                <FileText className="text-cobalt-accent" size={28}/> Doc Intelligence
              </h2>
              <p className="text-cobalt-muted text-[8px] md:text-[10px] uppercase font-black tracking-[0.3em] mt-1">
                Static Object Storage & Metadata Analysis
              </p>
            </div>
          </div>

          {/* --- STATS BAR --- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {[
              { label: 'Scans', val: stats.totalScans, icon: <Fingerprint size={14}/>, color: 'text-white' },
              { label: 'Findings', val: stats.totalFindings, icon: <BarChart3 size={14}/>, color: 'text-cobalt-accent' },
              { label: 'Critical', val: stats.critical, icon: <ShieldAlert size={14}/>, color: 'text-risk-high' },
              { label: 'Resolved', val: stats.resolved, icon: <ShieldCheck size={14}/>, color: 'text-risk-low' },
            ].map((s, i) => (
              <Card key={i} className="p-3 md:p-4 flex items-center gap-3 md:gap-4 bg-cobalt-surface/40 border-cobalt-border/50">
                <div className={`p-1.5 md:p-2 bg-cobalt-bg rounded-lg ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-cobalt-muted">{s.label}</p>
                  <h4 className={`text-sm md:text-xl font-mono font-bold ${s.color}`}>{s.val}</h4>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* --- UPLOAD (LEFT) --- */}
            <div className="lg:col-span-5 space-y-6">
              <Card className={`p-6 md:p-8 border-2 transition-all flex flex-col items-center justify-center text-center bg-cobalt-surface/20 ${isUploading ? 'border-cobalt-accent animate-pulse' : 'border-dashed border-cobalt-border hover:border-cobalt-accent'}`}>
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 md:mb-6 ${file ? 'bg-cobalt-accent/20 text-cobalt-accent' : 'bg-cobalt-surface text-cobalt-muted'}`}>
                  {isUploading ? <RefreshCw className="animate-spin" size={24} /> : <Upload size={24} />}
                </div>
                
                <h3 className="text-white font-black uppercase text-[10px] tracking-widest mb-2">Neural Scan</h3>
                
                {file && (
                  <div className="mb-4 p-2 bg-cobalt-bg rounded-xl border border-cobalt-border w-full flex items-center gap-2 overflow-hidden">
                    <FileText size={14} className="text-cobalt-accent shrink-0" />
                    <div className="text-left overflow-hidden">
                      <p className="text-[9px] font-bold text-white truncate uppercase">{file.name}</p>
                      <p className="text-[8px] text-cobalt-muted">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )}

                {scanResult && !isUploading && (
                  <div className={`mb-4 w-full p-2 rounded-lg border font-black text-[8px] uppercase tracking-widest flex items-center justify-center gap-2 
                    ${scanResult.findings > 0 ? 'bg-risk-high/10 border-risk-high/30 text-risk-high' : 'bg-risk-low/10 border-risk-low/30 text-risk-low'}`}>
                    {scanResult.findings > 0 ? `${scanResult.findings} Issues Detected` : `Assets Verified`}
                  </div>
                )}
                
                <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="fileUpload" className="cursor-pointer w-full py-2.5 border border-cobalt-border rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors mb-3 block">
                  {file ? "Change Object" : "Select Source"}
                </label>

                <Button className="w-full py-3.5 uppercase font-black tracking-[0.2em] text-[9px]" disabled={!file || isUploading} onClick={handleUpload}>
                  {isUploading ? "Scanning..." : "Initiate Audit"}
                </Button>
              </Card>

              {scanResult?.details && (
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-cobalt-muted ml-2">Neural Detail</h4>
                  {scanResult.details.map((detail, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-cobalt-border/50 bg-cobalt-surface/40 space-y-2">
                      <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                        <span className="text-cobalt-accent">{detail.type}</span>
                        <span className={detail.severity === 'critical' ? 'text-risk-high' : 'text-risk-low'}>{detail.severity}</span>
                      </div>
                      <p className="text-[11px] font-bold text-white leading-tight">{detail.detail}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- SCAN HISTORY (RIGHT) --- */}
            <div className="lg:col-span-7 space-y-6">
               <div className="bg-cobalt-surface border border-cobalt-border rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <Terminal size={14} className="text-cobalt-accent"/> Audit Trail
                    </h4>
                    <div className="flex bg-cobalt-bg p-1 rounded-lg border border-cobalt-border w-full sm:w-auto overflow-x-auto">
                      {['All', 'Critical', 'Resolved'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`flex-1 sm:flex-none px-3 py-1 text-[8px] font-black uppercase tracking-widest transition-all rounded-md whitespace-nowrap
                          ${filter === f ? 'bg-cobalt-accent text-cobalt-bg' : 'text-cobalt-muted'}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                      <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 border border-cobalt-border rounded-xl bg-cobalt-bg/60 gap-3">
                        <div className="flex items-center gap-3 w-full">
                           <div className={`p-1.5 rounded-lg shrink-0 ${log.risk === 'critical' ? 'bg-risk-high/10 text-risk-high' : 'bg-risk-low/10 text-risk-low'}`}>
                              {log.risk === 'critical' ? <ShieldAlert size={16}/> : <CheckCircle size={16}/>}
                           </div>
                           <div className="overflow-hidden">
                              <p className={`text-[10px] font-bold text-white truncate ${log.resolved ? 'line-through opacity-50' : ''}`}>{log.message}</p>
                              <p className="text-[8px] text-cobalt-muted font-mono">{log.filename}</p>
                           </div>
                        </div>
                        <div className="flex items-center justify-between w-full sm:w-auto gap-3 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                          <span className="text-[8px] text-cobalt-muted font-mono">{new Date(log.created_at).toLocaleDateString()}</span>
                          {!log.resolved && (
                            <button onClick={() => handleResolve(log.id)} className="px-3 py-1 bg-risk-low/10 border border-risk-low/20 rounded text-[8px] font-black uppercase text-risk-low">Resolve</button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-10 text-cobalt-muted text-[8px] font-black uppercase tracking-[0.4em] opacity-30">-- Empty --</div>
                    )}
                  </div>
               </div>

               <Card className="p-4 bg-gradient-to-r from-cobalt-accent/10 to-transparent border-cobalt-accent/20 rounded-2xl flex items-center gap-4">
                  <Zap size={24} className="text-cobalt-accent shrink-0"/>
                  <div>
                    <h5 className="text-white font-black uppercase text-[9px] tracking-[0.1em]">Neural Engine v4.0 Active</h5>
                    <p className="text-[8px] text-cobalt-muted leading-tight mt-1 italic">Groq LPU accelerated metadata scanning for high-entropy credential detection.</p>
                  </div>
               </Card>
            </div>
          </div>
        </main>
      </div>
      
      <style>{`
        .animate-progress-indefinite { width: 30%; animation: progress-slide 1.5s infinite linear; }
        @keyframes progress-slide { 0% { margin-left: -30%; } 100% { margin-left: 100%; } }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
      `}</style>
    </div>
  )
}

const RefreshCw = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
)

export default DocumentAudit;