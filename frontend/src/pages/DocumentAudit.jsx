import React, { useState, useEffect, useMemo } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Swal from 'sweetalert2'
import { 
  Upload, FileText, ShieldAlert, CheckCircle2, 
  Loader2, Trash2, Search, AlertTriangle, 
  ShieldCheck, ArrowRight, BarChart3, Fingerprint,
  CheckCircle, Filter, Terminal, Zap, Cpu 
} from 'lucide-react'

// Accessing the environment variable for deployment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DocumentAudit = () => {
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [scanResult, setScanResult] = useState(null)
  const [auditLogs, setAuditLogs] = useState([])
  const [filter, setFilter] = useState('All')

  // 🔄 Fetch Document-specific history using API_BASE_URL
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
          confirmButtonColor: '#38BDF8'
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
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent/30">
      <Sidebar />
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-8 space-y-8 animate-in fade-in duration-700 max-w-[1600px] mx-auto w-full">
          
          {/* --- HEADER --- */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-heading font-black tracking-tighter uppercase italic flex items-center gap-3">
                <FileText className="text-cobalt-accent" size={32}/> Document Intelligence
              </h2>
              <p className="text-cobalt-muted text-[10px] uppercase font-black tracking-[0.3em] mt-2">
                Static Object Storage & Metadata Neural Analysis
              </p>
            </div>
          </div>

          {/* --- STATS BAR --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Scans', val: stats.totalScans, icon: <Fingerprint size={16}/>, color: 'text-white' },
              { label: 'Total Findings', val: stats.totalFindings, icon: <BarChart3 size={16}/>, color: 'text-cobalt-accent' },
              { label: 'Critical Risks', val: stats.critical, icon: <ShieldAlert size={16}/>, color: 'text-risk-high' },
              { label: 'Resolved', val: stats.resolved, icon: <ShieldCheck size={16}/>, color: 'text-risk-low' },
            ].map((s, i) => (
              <Card key={i} className="p-4 flex items-center gap-4 bg-cobalt-surface/40 border-cobalt-border/50">
                <div className={`p-2 bg-cobalt-bg rounded-lg ${s.color}`}>{s.icon}</div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-cobalt-muted">{s.label}</p>
                  <h4 className={`text-xl font-mono font-bold ${s.color}`}>{s.val}</h4>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- UPLOAD & NEW RESULTS (LEFT) --- */}
            <div className="lg:col-span-5 space-y-6">
              <Card className={`p-8 border-2 transition-all flex flex-col items-center justify-center text-center bg-cobalt-surface/20 ${isUploading ? 'border-cobalt-accent animate-pulse' : 'border-dashed border-cobalt-border hover:border-cobalt-accent'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${file ? 'bg-cobalt-accent/20 text-cobalt-accent' : 'bg-cobalt-surface text-cobalt-muted'}`}>
                  {isUploading ? <RefreshCw className="animate-spin" size={32} /> : <Upload size={32} />}
                </div>
                
                <h3 className="text-white font-black uppercase text-xs tracking-widest mb-2">Initialize Neural Scan</h3>
                
                {file && (
                  <div className="mb-4 p-3 bg-cobalt-bg rounded-xl border border-cobalt-border w-full flex items-center gap-3 animate-in zoom-in-95">
                    <FileText size={16} className="text-cobalt-accent" />
                    <div className="text-left overflow-hidden">
                      <p className="text-[10px] font-bold text-white truncate uppercase tracking-tighter">{file.name}</p>
                      <p className="text-[9px] text-cobalt-muted">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                )}

                {isUploading && (
                  <div className="w-full h-1 bg-cobalt-bg rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-cobalt-accent animate-progress-indefinite"></div>
                  </div>
                )}

                {scanResult && !isUploading && (
                  <div className={`mb-6 w-full p-3 rounded-xl border font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 animate-in slide-in-from-top-2
                    ${scanResult.findings > 0 ? 'bg-risk-high/10 border-risk-high/30 text-risk-high' : 'bg-risk-low/10 border-risk-low/30 text-risk-low'}`}>
                    {scanResult.findings > 0 ? (
                      <><ShieldAlert size={14}/> {scanResult.findings} Issues — {scanResult.critical} Critical</>
                    ) : (
                      <><ShieldCheck size={14}/> Clean ✓ Assets Verified</>
                    )}
                  </div>
                )}
                
                <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.xlsx,.txt" />
                <label htmlFor="fileUpload" className="cursor-pointer w-full py-3 border border-cobalt-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/5 transition-colors mb-4 block">
                  {file ? "Change Object" : "Select Source File"}
                </label>

                <Button className="w-full py-4 uppercase font-black tracking-[0.3em] text-[10px]" disabled={!file || isUploading} onClick={handleUpload}>
                  {isUploading ? "Scanning Core..." : "Initiate Audit"}
                </Button>
              </Card>

              {scanResult?.details && (
                <div className="space-y-3 animate-in slide-in-from-bottom-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cobalt-muted ml-2">Neural Findings Detail</h4>
                  {scanResult.details.map((detail, idx) => (
                    <div key={idx} className={`p-5 rounded-2xl border bg-cobalt-surface/40 flex flex-col gap-3 transition-all
                      ${detail.severity === 'critical' ? 'border-risk-high/30' : 'border-risk-low/30'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest 
                          ${detail.severity === 'critical' ? 'bg-risk-high text-white' : 'bg-cobalt-bg text-risk-low border border-risk-low'}`}>
                          {detail.type}
                        </span>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${detail.severity === 'critical' ? 'text-risk-high' : 'text-risk-low'}`}>
                          {detail.severity}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white leading-relaxed tracking-tight">{detail.detail}</p>
                      <div className="pt-3 border-t border-cobalt-border/50 flex items-start gap-2">
                        <Zap size={12} className="text-cobalt-accent shrink-0 mt-0.5" />
                        <p className="text-[10px] text-cobalt-muted italic">{detail.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- SCAN HISTORY (RIGHT) --- */}
            <div className="lg:col-span-7 space-y-6">
               <div className="bg-cobalt-surface border border-cobalt-border rounded-3xl p-6 shadow-xl">
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
                      <Terminal size={14} className="text-cobalt-accent"/> Audit Execution Trail
                    </h4>
                    
                    <div className="flex bg-cobalt-bg p-1 rounded-lg border border-cobalt-border">
                      {['All', 'Critical', 'Resolved'].map((f) => (
                        <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all rounded-md
                          ${filter === f ? 'bg-cobalt-accent text-cobalt-bg shadow-lg' : 'text-cobalt-muted hover:text-white'}`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                      <div key={log.id} className={`flex items-center justify-between p-4 border rounded-2xl transition-all relative overflow-hidden group
                        ${log.resolved ? 'bg-cobalt-bg/30 border-cobalt-border/30 opacity-60' : 'bg-cobalt-bg/60 border-cobalt-border hover:border-cobalt-accent/50'}`}>
                        
                        <div className="flex items-center gap-4 z-10">
                           <div className={`p-2 rounded-lg ${log.risk === 'critical' ? 'bg-risk-high/10 text-risk-high' : 'bg-risk-low/10 text-risk-low'}`}>
                              {log.risk === 'critical' ? <ShieldAlert size={18}/> : <CheckCircle size={18}/>}
                           </div>
                           <div className={log.resolved ? 'line-through' : ''}>
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-bold text-white uppercase tracking-tight">{log.message}</p>
                                <span className="text-[8px] text-cobalt-muted font-mono">{log.filename}</span>
                              </div>
                              <p className="text-[9px] text-cobalt-muted mt-0.5 font-medium">{log.suggestion}</p>
                           </div>
                        </div>

                        <div className="flex items-center gap-3 z-10">
                          <span className="text-[8px] text-cobalt-muted font-mono uppercase italic">{new Date(log.created_at).toLocaleDateString()}</span>
                          {!log.resolved && (
                            <button 
                              onClick={() => handleResolve(log.id)}
                              className="px-3 py-1 bg-risk-low/10 border border-risk-low/20 rounded text-[8px] font-black uppercase tracking-widest text-risk-low hover:bg-risk-low hover:text-white transition-all"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-20 text-cobalt-muted text-[10px] font-black uppercase tracking-[0.4em] opacity-30">
                        -- Perimeter Trace Empty --
                      </div>
                    )}
                  </div>
               </div>

               <Card className="p-6 bg-gradient-to-r from-cobalt-accent/10 to-transparent border-cobalt-accent/20 rounded-3xl flex items-center gap-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Cpu size={100} /></div>
                  <div className="p-4 bg-cobalt-accent/20 rounded-2xl text-cobalt-accent shadow-[0_0_15px_rgba(56,189,248,0.2)]"><Zap size={28}/></div>
                  <div>
                    <h5 className="text-white font-black uppercase text-[11px] tracking-[0.2em]">Agentic Intelligence: ACTIVE</h5>
                    <p className="text-[10px] text-cobalt-muted leading-relaxed mt-1 italic max-w-md">
                      Neural scanners are using Groq LPU acceleration to process multi-format object metadata for hidden credential entropy.
                    </p>
                  </div>
               </Card>
            </div>
          </div>
        </main>
      </div>
      
      <style>{`
        .animate-progress-indefinite {
          width: 30%;
          animation: progress-slide 1.5s infinite linear;
        }
        @keyframes progress-slide {
          0% { margin-left: -30%; }
          100% { margin-left: 100%; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }
      `}</style>
    </div>
  )
}

const RefreshCw = ({ className, size }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
)

export default DocumentAudit;