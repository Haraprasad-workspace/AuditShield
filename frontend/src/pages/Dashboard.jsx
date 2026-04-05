"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ScoreGauge from '../components/dashboard/ScoreGauge';
import RiskTrendChart from '../components/dashboard/RiskTrendChart';
import AlertCard from '../components/alerts/AlertCard';
import { RefreshCw, ArrowUpRight, ShieldCheck, Activity, Search, Clock } from 'lucide-react';
import Swal from 'sweetalert2';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Dashboard = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [alertRes, repoRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/alerts/recent?t=${Date.now()}`),
        fetch(`${API_BASE_URL}/repo/list`)
      ]);
      const alertData = await alertRes.json();
      const repoData = await repoRes.json();
      setAlerts(Array.isArray(alertData) ? alertData : []);
      setRepos(repoData.repos || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 800);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const dataInterval = setInterval(fetchDashboardData, 30000);
    const clockInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    };
  }, []);

  // --- NEW: INVESTIGATION PROTOCOL ---
  const handleInvestigate = (alert) => {
    Swal.fire({
      title: 'NEURAL_DEEP_SCAN',
      html: `
        <div style="text-align: left; font-family: monospace; font-size: 11px; color: #94a3b8;">
          <p>> Initializing trace on Node: ${alert.id.slice(0, 8)}...</p>
          <p>> Analyzing entropy patterns...</p>
          <p>> Source: ${alert.source.toUpperCase()}</p>
          <p>> Risk: <span style="color: #ef4444">${alert.risk.toUpperCase()}</span></p>
          <p style="color: #38bdf8; margin-top: 10px;">[AI] Recommendation: Immediate remediation via neutralisation protocol required.</p>
        </div>
      `,
      background: '#0B1221',
      color: '#fff',
      confirmButtonText: 'OPEN FULL AUDIT',
      confirmButtonColor: '#38BDF8',
      showCancelButton: true,
      cancelButtonText: 'CLOSE',
      icon: 'info'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/logs');
      }
    });
  };

  const securityScore = useMemo(() => {
    const criticalCount = alerts.filter(a => a.risk === 'critical' && !a.resolved).length;
    const score = 100 - (criticalCount * 7.5);
    return Math.max(score, 15).toFixed(1);
  }, [alerts]);

  const containerVars = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans overflow-x-hidden selection:bg-cobalt-accent/30">
      <Sidebar />
      
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        
        <motion.main 
          initial="initial"
          animate="animate"
          variants={containerVars}
          className="p-4 sm:p-8 lg:p-12 space-y-6 md:space-y-10 max-w-[1600px] mx-auto w-full"
        >
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/5 pb-8">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tighter uppercase italic">
                Neural_<span className="text-cobalt-accent">Dashboard</span>
              </h1>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                <span className="flex items-center gap-1.5"><Activity size={12} className="text-risk-low animate-pulse"/> Perimeter Status: Optimal</span>
                <span className="flex items-center gap-1.5"><Clock size={12}/> {currentTime.toLocaleTimeString('en-IN', { hour12: false })} IST</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cobalt-muted" size={14} />
                <input 
                    placeholder="QUERY_NODES..." 
                    className="w-full sm:w-64 bg-white/5 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 focus:outline-none focus:border-cobalt-accent transition-all" 
                />
              </div>
              <button 
                onClick={fetchDashboardData}
                className="p-3.5 bg-cobalt-surface border border-white/5 rounded-xl hover:border-cobalt-accent transition-all group shadow-xl"
              >
                <RefreshCw className={isRefreshing ? "animate-spin text-cobalt-accent" : "text-cobalt-muted group-hover:text-white"} size={18} />
              </button>
            </div>
          </div>

          {/* SCORE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-8 md:p-10 bg-cobalt-surface/30 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center justify-between relative overflow-hidden backdrop-blur-xl group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cobalt-accent/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-cobalt-accent/10 transition-colors duration-700"></div>
              
              <div className="z-10 space-y-6 text-center md:text-left">
                <div>
                  <h3 className="text-cobalt-accent uppercase text-[11px] font-black tracking-[0.4em] mb-2 italic">Global Security Index</h3>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <h2 className="text-6xl md:text-8xl font-heading font-black tracking-tighter italic leading-none">{securityScore}</h2>
                    <span className="text-2xl font-black text-cobalt-muted/30 italic">/100</span>
                  </div>
                </div>
                <p className="max-w-xs text-sm text-cobalt-muted font-medium italic leading-relaxed">
                  Neural scan cycle complete. Your environment is <span className="text-white font-black">{securityScore > 90 ? 'REINFORCED' : 'VULNERABLE'}</span>.
                </p>
                <div className="flex gap-3 justify-center md:justify-start">
                   <span className="px-4 py-1.5 bg-risk-low/10 border border-risk-low/20 rounded-xl text-[9px] font-black text-risk-low uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={12}/> Shield_Active
                  </span>
                </div>
              </div>

              <div className="relative mt-8 md:mt-0 group-hover:scale-110 transition-transform duration-700">
                <ScoreGauge score={parseFloat(securityScore)} />
              </div>
            </div>

            {/* STATS MINI GRID */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              {[
                { label: 'Monitored Assets', value: repos.length, color: 'text-cobalt-accent' },
                { label: 'Scanned Nodes', value: '12.4K', color: 'text-risk-low' },
                { label: 'Alerts Detected', value: alerts.length, color: 'text-risk-high' },
                { label: 'System Health', value: '99.9%', color: 'text-white' }
              ].map((stat, idx) => (
                <div key={idx} className="p-8 bg-cobalt-surface/20 rounded-[2rem] border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all group">
                  <p className="text-[10px] text-cobalt-muted font-black uppercase tracking-[0.2em] mb-4 group-hover:text-white transition-colors">{stat.label}</p>
                  <h3 className={`text-3xl font-heading font-black italic tracking-tighter ${stat.color}`}>{stat.value}</h3>
                </div>
              ))}
            </div>
          </div>

          {/* CHART */}
          <div className="p-8 md:p-10 bg-cobalt-surface/20 rounded-[3rem] border border-white/5 relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
               <Activity size={16} className="text-cobalt-accent" /> Security_Activity_Trend
            </h3>
            <div className="h-[300px] w-full">
                <RiskTrendChart />
            </div>
          </div>

          {/* ALERTS SECTION */}
          <div className="space-y-8">
            <div className="flex justify-between items-end px-4">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-[0.4em] italic">Real_Time_Threat_Stream</h3>
                <p className="text-[9px] text-cobalt-muted uppercase font-bold tracking-widest">Displaying latest 5 critical events</p>
              </div>
              <button 
                onClick={() => navigate('/logs')}
                className="group flex items-center gap-2 text-[10px] font-black text-cobalt-accent hover:text-white transition-all uppercase tracking-[0.2em]"
              >
                Full_Audit_History <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="p-10 flex flex-col items-center justify-center gap-4 bg-white/5 rounded-[2rem] border border-white/5 animate-pulse">
                  <RefreshCw className="animate-spin text-cobalt-accent" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cobalt-muted">Synchronizing Nodes...</p>
                </div>
              ) : (
                <AnimatePresence mode='popLayout'>
                  {alerts.slice(0, 5).map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <AlertCard
                        severity={alert.risk}
                        title={alert.message}
                        description={alert.reason}
                        time={alert.created_at}
                        // ✅ Click Functionality Added
                        onInvestigate={() => handleInvestigate(alert)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              {!loading && alerts.length === 0 && (
                <div className="p-20 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                   <ShieldCheck size={48} className="mx-auto text-risk-low opacity-20 mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cobalt-muted italic">Perimeter_Secure: No_Alerts_Logged</p>
                </div>
              )}
            </div>
          </div>

          {/* TELEMETRY FOOTER */}
          <div className="p-8 bg-cobalt-surface/40 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-cobalt-muted mb-6 italic">Engine_Telemetry</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <span className="flex items-center gap-3 font-mono text-[11px] font-bold"><div className="w-2 h-2 rounded-full bg-risk-low animate-pulse shadow-[0_0_10px_#10B981]"/> CPU_NODE: OPTIMAL</span>
              <span className="flex items-center gap-3 font-mono text-[11px] font-bold"><div className="w-2 h-2 rounded-full bg-risk-low animate-pulse shadow-[0_0_10px_#10B981]"/> LATENCY_SYNC: 142ms</span>
              <span className="flex items-center gap-3 font-mono text-[11px] font-bold"><div className="w-2 h-2 rounded-full bg-cobalt-accent animate-pulse shadow-[0_0_10px_#38BDF8]"/> DB_VECTOR: STABLE</span>
            </div>
          </div>

        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;