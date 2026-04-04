"use client";

import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { 
  Folder, FileText, ShieldAlert, ChevronRight, Search, RefreshCw, Globe, 
  ExternalLink, Lock, Eye, AlertCircle, Info, Zap, ChevronDown, Trash2, Shield, Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const TreeItem = ({ item, level = 0, onSelect, selectedId }) => {
  const [isOpen, setIsOpen] = useState(level < 1);
  const isFolder = item.type === 'folder';
  const hasWarning = item.risk_level === 'critical' || item.risk_level === 'warning';
  const displayName = item.name.length > 20 ? item.name.substring(0, 17) + ".." : item.name;

  return (
    <div className="select-none overflow-hidden">
      <div 
        className={`flex items-center gap-2 py-2 px-2 rounded-lg cursor-pointer transition-all hover:bg-white/5 group
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
        
        <span className={`text-[10px] font-black uppercase tracking-tight truncate
          ${!isFolder && hasWarning ? 'text-risk-high' : 'text-white/80 group-hover:text-white'}
        `}>
          {displayName}
        </span>
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
    const currentUserId = localStorage.getItem("auditshield_user_id"); 
    if (!googleToken) { setLoading(false); return; }

    try {
      const res = await fetch(`${API_BASE_URL}/api/drive/audit`, {
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
    } catch (err) { 
      console.error("Discovery Failed:", err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleRemediate = async (fileId, type) => {
    const googleToken = localStorage.getItem("google_drive_token");
    const endpoint = type === 'revoke' ? 'revoke' : 'delete';
    
    Swal.fire({
      title: 'EXECUTING...',
      background: "#0B1221",
      color: "#fff",
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/drive/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken, fileId })
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire({ title: "SUCCESS", text: data.message, icon: "success", background: "#0B1221", color: "#fff" });
        fetchDriveData(); 
        setActiveActionId(null);
      }
    } catch (err) {
      Swal.fire({ title: "FAILED", text: err.message, icon: "error", background: "#0B1221", color: "#fff" });
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
        <RefreshCw className="text-cobalt-accent animate-spin" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans overflow-x-hidden">
      <Sidebar />
      <div className="ml-0 md:ml-64 transition-all duration-300">
        <Navbar />

        <main className="p-4 sm:p-8 lg:p-12 space-y-6 md:space-y-10 max-w-[1700px] mx-auto w-full">
          
          {/* STATS HUD - Responsive Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-cobalt-surface/20 border border-white/5 p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[7px] md:text-[8px] font-black text-cobalt-muted uppercase tracking-widest mb-1">Assets</p>
                    <p className="text-lg md:text-2xl font-heading font-black italic">{stats.total}</p>
                </div>
                <Folder className="text-cobalt-muted opacity-20 hidden sm:block" size={24} />
              </div>
              <div className="bg-risk-high/5 border border-risk-high/20 p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[7px] md:text-[8px] font-black text-risk-high uppercase tracking-widest mb-1">Critical</p>
                    <p className="text-lg md:text-2xl font-heading font-black italic text-risk-high">{stats.critical}</p>
                </div>
                <ShieldAlert className="text-risk-high opacity-30 hidden sm:block" size={24} />
              </div>
              <div className="bg-orange-400/5 border border-orange-400/20 p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[7px] md:text-[8px] font-black text-orange-400 uppercase tracking-widest mb-1">Warnings</p>
                    <p className="text-lg md:text-2xl font-heading font-black italic text-orange-400">{stats.warning}</p>
                </div>
                <AlertCircle className="text-orange-400 opacity-30 hidden sm:block" size={24} />
              </div>
              <div className="bg-cobalt-accent/5 border border-cobalt-accent/20 p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center justify-between">
                <div>
                    <p className="text-[7px] md:text-[8px] font-black text-cobalt-accent uppercase tracking-widest mb-1">Health</p>
                    <p className="text-lg md:text-2xl font-heading font-black italic text-cobalt-accent">98.2%</p>
                </div>
                <Zap className="text-cobalt-accent opacity-30 hidden sm:block" size={24} />
              </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase italic text-white leading-none">
                Cloud_<span className="text-cobalt-accent">Explorer</span>
            </h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cobalt-muted" size={14} />
                <input 
                  type="text" placeholder="FILTER..."
                  className="bg-cobalt-surface/30 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-[10px] font-black uppercase tracking-widest focus:border-cobalt-accent outline-none w-full"
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button onClick={fetchDriveData} className="p-3 bg-cobalt-surface/50 border border-white/10 rounded-xl text-cobalt-accent shrink-0"><RefreshCw size={14} /></button>
            </div>
          </div>

          {/* MAIN CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
            {/* Tree Map - Hidden on mobile, shown as a small widget or hidden */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <div className="p-4 md:p-6 bg-cobalt-surface/20 border border-white/5 rounded-[2rem] backdrop-blur-sm h-[300px] lg:h-[600px] overflow-y-auto custom-scrollbar">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-cobalt-accent mb-4 flex items-center gap-2"><Activity size={12} /> Neural_Tree</h3>
                <TreeItem item={fileTree} onSelect={setSelectedFile} selectedId={selectedFile?.file_id} />
              </div>
            </div>

            {/* Table Area */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="bg-cobalt-surface/20 border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="max-h-[500px] lg:max-h-[600px] overflow-x-auto lg:overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="sticky top-0 bg-cobalt-bg/95 backdrop-blur-md z-20">
                        <tr className="border-b border-white/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-cobalt-muted">
                        <th className="p-4 md:p-6">Asset_Identifier</th>
                        <th className="p-4 md:p-6">Risk</th>
                        <th className="p-4 md:p-6 text-right">Scope</th>
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
                            <td className="p-4 md:p-6" onClick={() => setSelectedFile(file)}>
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-lg transition-all ${file.risk_level === 'critical' ? 'bg-risk-high/10 text-risk-high' : 'bg-slate-800 text-cobalt-muted'}`}>
                                      <FileText size={16} />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-black text-white truncate max-w-[80px] md:max-w-[120px] uppercase italic">{file.name}</span>
                                        <span className={`px-1.5 py-0.5 rounded text-[6px] font-black uppercase ${isPublic ? 'bg-risk-high/20 text-risk-high' : 'bg-risk-low/20 text-risk-low'}`}>
                                          {isPublic ? 'Public' : 'Private'}
                                        </span>
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setActiveActionId(activeActionId === file.file_id ? null : file.file_id); }}
                                          className="p-1 hover:bg-white/10 rounded transition-colors text-cobalt-accent"
                                        >
                                          <ChevronDown size={12} className={`transition-transform ${activeActionId === file.file_id ? 'rotate-180' : ''}`} />
                                        </button>
                                      </div>
                                      <span className="text-[7px] font-black uppercase text-cobalt-muted opacity-60">ID: {file.file_id.slice(0, 6)}</span>
                                  </div>
                                </div>
                            </td>
                            <td className="p-4 md:p-6" onClick={() => setSelectedFile(file)}>
                                <span className={`text-[9px] font-black uppercase ${file.risk_level === 'critical' ? 'text-risk-high' : 'text-risk-low'}`}>
                                    {file.risk_level}
                                </span>
                            </td>
                            <td className="p-4 md:p-6 text-right">
                                <ChevronRight size={16} className={`inline transition-all ${selectedFile?.file_id === file.file_id ? 'text-cobalt-accent translate-x-1' : 'text-cobalt-muted opacity-20'}`} />
                            </td>
                            </motion.tr>
                            
                            <AnimatePresence>
                              {activeActionId === file.file_id && (
                                <motion.tr 
                                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                  className="bg-white/[0.02]"
                                >
                                  <td colSpan="3" className="px-4 md:px-10 py-4 border-b border-white/5">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                      <div className="flex gap-2 w-full sm:w-auto">
                                        <button 
                                          disabled={!isPublic}
                                          onClick={() => handleRemediate(file.file_id, 'revoke')} 
                                          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[8px] font-black uppercase transition-all ${isPublic ? 'bg-cobalt-accent/20 border border-cobalt-accent/30 text-cobalt-accent' : 'opacity-20 border border-white/5'}`}
                                        >
                                          <Shield size={10}/> Secure
                                        </button>
                                        <button 
                                          onClick={() => handleRemediate(file.file_id, 'delete')} 
                                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-risk-high/10 border border-risk-high/20 rounded-xl text-[8px] font-black uppercase text-risk-high"
                                        >
                                          <Trash2 size={10}/> Purge
                                        </button>
                                      </div>
                                      <a href={file.metadata?.webViewLink} target="_blank" rel="noreferrer" className="text-[8px] font-black uppercase italic text-cobalt-muted hover:text-white flex items-center gap-1">
                                        <ExternalLink size={10}/> View_Source
                                      </a>
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

            {/* Inspector Sidebar - Hidden on mobile unless selected, or scrolls down */}
            <div className="lg:col-span-3 order-3">
              <AnimatePresence mode="wait">
                {selectedFile ? (
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:sticky lg:top-32 space-y-6">
                    <Card className="p-6 md:p-8 bg-cobalt-surface/40 border border-cobalt-accent/20 rounded-[2rem] shadow-2xl">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-cobalt-accent/10 rounded-2xl text-cobalt-accent"><Info size={20} /></div>
                        <a href={selectedFile.metadata?.webViewLink} target="_blank" rel="noreferrer" className="p-2 bg-white/5 rounded-xl text-cobalt-muted"><ExternalLink size={16} /></a>
                      </div>
                      <h3 className="text-lg md:text-xl font-heading font-black text-white uppercase italic mb-4 leading-tight">{selectedFile.name}</h3>
                      <div className="space-y-6">
                        <div className={`p-4 rounded-2xl border ${selectedFile.risk_level === 'critical' ? 'bg-risk-high/10 border-risk-high/20 text-risk-high' : 'bg-white/5 border-white/5 text-risk-low'}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                              {selectedFile.risk_level === 'critical' ? <Globe size={16}/> : <Lock size={16}/>}
                              {selectedFile.risk_level === 'critical' ? "Public" : "Private"}
                            </span>
                        </div>
                        <Button 
                          onClick={() => handleRemediate(selectedFile.file_id, 'revoke')}
                          className={`w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedFile.risk_level === 'critical' ? 'bg-risk-high text-white' : 'bg-cobalt-accent text-cobalt-bg'}`}>
                          {selectedFile.risk_level === 'critical' ? "REVOKE_ACCESS" : "ANALYSIS_COMPLETE"}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ) : (
                  <div className="hidden lg:flex h-full items-center justify-center border border-dashed border-white/5 rounded-[3rem] p-10 opacity-30 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest italic">Select node to inspect</p>
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