"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { 
  Folder, FileText, ShieldAlert, ShieldCheck, 
  ChevronRight, Search, RefreshCw, Globe, 
  ExternalLink, Lock, Eye, AlertCircle, Info,
  Fingerprint, Activity, Zap, ChevronDown, Trash2, Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

// --- TREE COMPONENT ---
const TreeItem = ({ item, level = 0, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(level < 1);
  const isFolder = item.type === 'folder';
  const hasWarning = item.risk_level === 'critical' || item.risk_level === 'warning';
  const displayName = item.name.length > 20 ? item.name.substring(0, 17) + ".." : item.name;

  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-all hover:bg-white/5 group
          ${selectedId === item.file_id ? 'bg-cobalt-accent/10 text-cobalt-accent' : ''}
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else onSelect(item);
        }}
      >
        {isFolder ? (
          <div className="flex items-center gap-1">
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            <Folder size={16} className={isOpen ? "text-cobalt-accent" : "text-cobalt-muted"} />
          </div>
        ) : (
          <FileText size={14} className={hasWarning ? "text-risk-high animate-pulse" : "text-cobalt-muted"} />
        )}
        
        {!isFolder ? (
          <a 
            href={item.metadata?.webViewLink} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={`text-[10px] font-black uppercase tracking-tight hover:underline transition-colors
              ${hasWarning ? 'text-risk-high shadow-risk-high' : 'text-white/80 group-hover:text-white'}
              italic
            `}
          >
            {displayName}
          </a>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-tight text-cobalt-muted">
            {displayName}
          </span>
        )}
      </div>

      {isFolder && isOpen && item.children && (
        <div className="border-l border-white/5 ml-3">
          {item.children.map(child => (
            <TreeItem key={child.file_id} item={child} level={level + 1} onSelect={onSelect} selectedId={selectedId} />
          ))}
        </div>
      )}
    </div>
  );
};

const DriveAudit = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, critical: 0, warning: 0 });
  const [activeActionId, setActiveActionId] = useState(null);

  const fetchDriveData = async () => {
    setLoading(true);
    const googleToken = localStorage.getItem("google_drive_token");
    const currentUserId = localStorage.getItem("auditshield_user_id") || "550e8400-e29b-41d4-a716-446655440000"; 
    if (!googleToken) { setLoading(false); return; }

    try {
      const res = await fetch("http://localhost:5000/api/drive/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, token: googleToken })
      });
      const data = await res.json();
      if (res.ok) {
        setFiles(data.files || []);
        setStats({ 
          total: data.stats?.total || 0, 
          critical: data.stats?.critical || 0, 
          warning: data.stats?.warning || 0 
        });
      }
    } catch (err) { console.error("Discovery Failed:", err.message); }
    finally { setLoading(false); }
  };

  // --- REACTION LOGIC (FIXED) ---
  const handleRemediate = async (fileId, type) => {
    const googleToken = localStorage.getItem("google_drive_token");
    const endpoint = type === 'revoke' ? 'revoke' : 'delete';
    
    Swal.fire({
      title: 'EXECUTING_PROTOCOL...',
      text: 'Neural interface communicating with cloud nodes',
      background: "#0B1221",
      color: "#fff",
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch(`http://localhost:5000/api/drive/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken, fileId })
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({ 
          title: "PROTOCOL_SUCCESS", text: data.message, 
          icon: "success", background: "#0B1221", color: "#fff", confirmButtonColor: "#38BDF8"
        });
        fetchDriveData(); 
        setActiveActionId(null);
      } else {
        throw new Error(data.error || "Access Denied by Provider");
      }
    } catch (err) {
      Swal.fire({ 
        title: "ACTION_FAILED", text: err.message, 
        icon: "error", background: "#0B1221", color: "#fff" 
      });
    }
  };

  useEffect(() => { fetchDriveData(); }, []);

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const fileTree = useMemo(() => {
    const root = { name: "ROOT_DRIVE", type: "folder", children: [], file_id: "root" };
    files.forEach(file => { root.children.push({ ...file, type: 'file' }); });
    return root;
  }, [files]);

  if (loading) return (
    <div className="min-h-screen bg-cobalt-bg flex items-center justify-center">
        <RefreshCw className="text-cobalt-accent animate-spin" size={60} />
    </div>
  );

  return (
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent/30 font-sans overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 transition-all">
        <Navbar />

        <main className="p-8 lg:p-12 space-y-10 max-w-[1700px] mx-auto">
          
          {/* STATS HUD */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-cobalt-surface/20 border border-white/5 p-6 rounded-3xl flex items-center justify-between shadow-inner">
                <div>
                    <p className="text-[8px] font-black text-cobalt-muted uppercase tracking-widest mb-1">Total Assets</p>
                    <p className="text-2xl font-heading font-black italic">{stats.total}</p>
                </div>
                <Folder className="text-cobalt-muted opacity-20" size={32} />
              </div>
              <div className="bg-risk-high/5 border border-risk-high/20 p-6 rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[8px] font-black text-risk-high uppercase tracking-widest mb-1">Critical Leaks</p>
                    <p className="text-2xl font-heading font-black italic text-risk-high">{stats.critical}</p>
                </div>
                <ShieldAlert className="text-risk-high opacity-30" size={32} />
              </div>
              <div className="bg-orange-400/5 border border-orange-400/20 p-6 rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[8px] font-black text-orange-400 uppercase tracking-widest mb-1">Warnings</p>
                    <p className="text-2xl font-heading font-black italic text-orange-400">{stats.warning}</p>
                </div>
                <AlertCircle className="text-orange-400 opacity-30" size={32} />
              </div>
              <div className="bg-cobalt-accent/5 border border-cobalt-accent/20 p-6 rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[8px] font-black text-cobalt-accent uppercase tracking-widest mb-1">Neural Health</p>
                    <p className="text-2xl font-heading font-black italic text-cobalt-accent">98.2%</p>
                </div>
                <Zap className="text-cobalt-accent opacity-30" size={32} />
              </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
            <h2 className="text-5xl font-heading font-black tracking-tighter uppercase italic text-white leading-none">
                Cloud_<span className="text-cobalt-accent">Explorer</span>
            </h2>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <input 
                type="text" placeholder="FILTER_FILES_BY_NAME..."
                className="bg-cobalt-surface/30 border border-white/5 rounded-xl px-6 py-3.5 text-[10px] font-black uppercase tracking-widest focus:border-cobalt-accent outline-none w-full md:w-80"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button onClick={fetchDriveData} className="p-3.5 bg-cobalt-surface/50 border border-white/10 rounded-xl text-cobalt-accent active:rotate-180 duration-700 transition-all"><RefreshCw size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3 space-y-6">
              <div className="p-6 bg-cobalt-surface/20 border border-white/5 rounded-[2.5rem] backdrop-blur-sm shadow-2xl h-[600px] overflow-y-auto custom-scrollbar text-white">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-cobalt-accent mb-6 flex items-center gap-2"><Activity size={12} /> Neural_Tree_Map</h3>
                <TreeItem item={fileTree} onSelect={setSelectedFile} selectedId={selectedFile?.file_id} />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-cobalt-surface/20 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-cobalt-bg/95 backdrop-blur-md z-20">
                        <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-cobalt-muted">
                        <th className="p-6">Asset_Identifier</th>
                        <th className="p-6">Risk_Level</th>
                        <th className="p-6 text-right">Scope</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                        {filteredFiles.map((file) => {
                           const isPublic = file.metadata?.permissions?.some(p => p.type === 'anyone');
                           return (
                            <React.Fragment key={file.file_id}>
                            <motion.tr 
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                              className={`border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.04] group ${selectedFile?.file_id === file.file_id ? 'bg-cobalt-accent/10 border-l-[3px] border-l-cobalt-accent' : ''}`}
                            >
                            <td className="p-6" onClick={() => setSelectedFile(file)}>
                                <div className="flex items-center gap-4">
                                  <div className={`p-3 rounded-xl transition-all duration-300 ${file.risk_level === 'critical' ? 'bg-risk-high/10 text-risk-high scale-110' : 'bg-slate-800 text-cobalt-muted group-hover:text-white'}`}>
                                      <FileText size={20} />
                                  </div>
                                  <div className="flex flex-col relative">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-white truncate max-w-[120px] uppercase tracking-tight italic">{file.name}</span>
                                        <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter ${isPublic ? 'bg-risk-high/20 text-risk-high' : 'bg-risk-low/20 text-risk-low'}`}>
                                          {isPublic ? 'Public' : 'Private'}
                                        </span>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setActiveActionId(activeActionId === file.file_id ? null : file.file_id); }}
                                          className="p-1 hover:bg-white/10 rounded transition-colors text-cobalt-accent"
                                        >
                                          <ChevronDown size={14} className={`transition-transform ${activeActionId === file.file_id ? 'rotate-180' : ''}`} />
                                        </button>
                                      </div>
                                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-cobalt-muted mt-1 opacity-60">ID: {file.file_id.slice(0, 8)}</span>
                                  </div>
                                </div>
                            </td>
                            <td className="p-6" onClick={() => setSelectedFile(file)}>
                                <span className={`text-[10px] font-black uppercase tracking-[0.15em] ${file.risk_level === 'critical' ? 'text-risk-high' : file.risk_level === 'warning' ? 'text-orange-400' : 'text-risk-low'}`}>
                                    {file.risk_level}
                                </span>
                            </td>
                            <td className="p-6 text-right" onClick={() => setSelectedFile(file)}>
                                <ChevronRight size={18} className={`inline transition-all duration-300 ${selectedFile?.file_id === file.file_id ? 'text-cobalt-accent translate-x-2' : 'text-cobalt-muted opacity-20'}`} />
                            </td>
                            </motion.tr>
                            
                            {/* --- ACTION MINI TAB --- */}
                            <AnimatePresence>
                              {activeActionId === file.file_id && (
                                <motion.tr 
                                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="bg-white/[0.02]"
                                >
                                  <td colSpan="3" className="px-10 py-5 border-b border-white/5">
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-6">
                                        <div className="space-y-2">
                                           <p className="text-[8px] font-black text-cobalt-muted uppercase tracking-[0.2em]">Node_Remediation_Protocol</p>
                                           <div className="flex gap-3">
                                              <button 
                                                disabled={!isPublic}
                                                onClick={() => handleRemediate(file.file_id, 'revoke')} 
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${isPublic ? 'bg-cobalt-accent/20 border border-cobalt-accent/30 hover:bg-cobalt-accent hover:text-cobalt-bg' : 'opacity-20 cursor-not-allowed border border-white/5'}`}
                                              >
                                                <Shield size={12}/> Secure_Node
                                              </button>
                                              <button 
                                                onClick={() => handleRemediate(file.file_id, 'delete')} 
                                                className="flex items-center gap-2 px-4 py-2 bg-risk-high/10 border border-risk-high/20 rounded-xl text-[9px] font-black uppercase text-risk-high hover:bg-risk-high hover:text-white transition-all shadow-lg shadow-risk-high/10"
                                              >
                                                <Trash2 size={12}/> Purge_Node
                                              </button>
                                           </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                         <p className="text-[8px] font-black text-cobalt-muted uppercase">Access_Vector</p>
                                         <a href={file.metadata?.webViewLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white hover:border-cobalt-accent transition-all">
                                           <ExternalLink size={12}/> <span className="text-[9px] font-black uppercase italic">View_Source</span>
                                         </a>
                                      </div>
                                    </div>
                                  </td>
                                </motion.tr>
                              )}
                            </AnimatePresence>
                            </React.Fragment>
                        )})}
                        </AnimatePresence>
                    </tbody>
                    </table>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 30, opacity: 0 }} className="sticky top-32 space-y-6">
                    <Card className="p-10 bg-cobalt-surface/40 border border-cobalt-accent/20 rounded-[3rem] shadow-2xl">
                      <div className="flex justify-between items-start mb-10">
                        <div className="p-5 bg-cobalt-accent/10 rounded-3xl text-cobalt-accent shadow-inner"><Info size={28} /></div>
                        <a href={selectedFile.metadata?.webViewLink} target="_blank" rel="noreferrer" className="p-3 bg-white/5 rounded-2xl text-cobalt-muted hover:text-white transition-all shadow-xl"><ExternalLink size={20} /></a>
                      </div>
                      <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tighter italic mb-4 leading-none">{selectedFile.name}</h3>
                      <div className="space-y-8 mt-10">
                        <div className={`p-5 rounded-3xl border ${selectedFile.risk_level === 'critical' ? 'bg-risk-high/10 border-risk-high/20 text-risk-high shadow-lg' : 'bg-white/5 border-white/5 text-risk-low'}`}>
                            <span className="text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
                              {selectedFile.risk_level === 'critical' ? <Globe size={22}/> : <Lock size={22}/>}
                              {selectedFile.risk_level === 'critical' ? "Public_Exposure" : "Authorized_Only"}
                            </span>
                        </div>
                        <Button 
                          onClick={() => handleRemediate(selectedFile.file_id, 'revoke')}
                          className={`w-full py-5 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all ${selectedFile.risk_level === 'critical' ? 'bg-risk-high text-white shadow-risk-high/20' : 'bg-cobalt-accent text-cobalt-bg shadow-cobalt-accent/20'}`}>
                          {selectedFile.risk_level === 'critical' ? "REVOKE_PUBLIC_LINK" : "RUN_DEEP_ANALYSIS"}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center border border-dashed border-white/5 rounded-[4rem] p-16 opacity-40">
                    <div className="text-center space-y-4">
                        <Eye size={40} className="mx-auto text-cobalt-muted" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cobalt-muted italic">Select node to inspect</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default DriveAudit;