"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ScoreGauge from '../components/dashboard/ScoreGauge';
import RiskTrendChart from '../components/dashboard/RiskTrendChart';
import AlertCard from '../components/alerts/AlertCard';
import { RefreshCw, ArrowUpRight } from 'lucide-react';

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
    <div className="min-h-screen bg-cobalt-bg text-white font-sans overflow-x-hidden">
      <Sidebar />
      
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        <Navbar />
        
        <motion.main 
          initial="initial"
          animate="animate"
          variants={containerVars}
          // Responsive padding: p-4 for mobile, p-8 to p-12 for desktop
          className="p-4 sm:p-8 lg:p-12 space-y-6 md:space-y-10 max-w-[1600px] mx-auto w-full"
        >
          
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">
                Security <span className="text-cobalt-accent">Dashboard</span>
              </h1>
              <p className="text-[10px] md:text-sm text-gray-400">
                System Status: Secure • {currentTime.toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input 
                placeholder="Search..." 
                className="flex-1 sm:flex-none bg-white/5 px-4 py-2 rounded-lg text-sm border border-white/10 focus:outline-none focus:border-cobalt-accent transition-colors" 
              />
              <button 
                onClick={fetchDashboardData}
                className="p-2 hover:bg-white/10 rounded-full transition-colors shrink-0"
              >
                <RefreshCw className={isRefreshing ? "animate-spin text-cobalt-accent" : ""} size={20} />
              </button>
            </div>
          </div>

          {/* SCORE SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <div className="p-6 md:p-8 bg-white/5 rounded-xl border border-white/10 flex flex-col justify-center">
              <h3 className="text-[10px] md:text-sm text-gray-400 uppercase tracking-wider mb-2">Security Score</h3>
              <div className="flex items-baseline gap-2">
                <h2 className="text-4xl md:text-6xl font-extrabold">{securityScore}</h2>
                <span className="text-xl md:text-2xl text-gray-500">/ 100</span>
              </div>
              <p className="mt-4 text-xs md:text-sm text-gray-400 italic">
                {securityScore > 90 
                  ? "✓ All protocols within safe parameters." 
                  : "⚠ Action required on critical vulnerabilities."}
              </p>
            </div>

            <div className="flex justify-center items-center bg-white/5 rounded-xl border border-white/10 p-4 md:p-6 overflow-hidden">
              <div className="scale-75 sm:scale-100">
                 <ScoreGauge score={parseFloat(securityScore)} />
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Repositories', value: repos.length },
              { label: 'Files Scanned', value: '12.4K' },
              { label: 'Total Alerts', value: alerts.length },
              { label: 'Health', value: '99.9%' }
            ].map((stat, idx) => (
              <div key={idx} className="p-4 md:p-6 bg-white/5 rounded-xl border border-white/10">
                <p className="text-[9px] md:text-xs text-gray-400 uppercase mb-1">{stat.label}</p>
                <h3 className="text-lg md:text-2xl font-bold">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* CHART */}
          <div className="p-4 md:p-6 bg-white/5 rounded-xl border border-white/10 overflow-x-hidden">
            <h3 className="text-base md:text-lg font-semibold mb-6">Security Activity Trend</h3>
            <div className="h-[250px] md:h-auto">
                <RiskTrendChart />
            </div>
          </div>

          {/* ALERTS SECTION */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base md:text-lg font-semibold">Recent Security Alerts</h3>
              <button 
                onClick={() => navigate('/logs')}
                className="flex items-center gap-1 text-[10px] md:text-sm text-cobalt-accent hover:underline font-black uppercase tracking-widest"
              >
                Audit Logs <ArrowUpRight size={14}/>
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <RefreshCw className="animate-spin" size={14} /> Scanning system...
                </div>
              ) : alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert, i) => (
                  <AlertCard
                    key={i}
                    severity={alert.risk}
                    title={alert.message}
                    description={alert.reason}
                    time={alert.created_at}
                  />
                ))
              ) : (
                <div className="p-10 text-center bg-white/5 rounded-xl border border-dashed border-white/20 text-gray-500 text-xs uppercase font-bold tracking-widest">
                  No active security threats detected.
                </div>
              )}
            </div>
          </div>

          {/* SYSTEM HEALTH FOOTER */}
          <div className="p-4 md:p-6 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Engine Telemetry</h3>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-[10px] md:text-sm">
              <span className="flex items-center gap-2 font-mono"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> CPU_LOAD: NORMAL</span>
              <span className="flex items-center gap-2 font-mono"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> LATENCY: 24ms</span>
              <span className="flex items-center gap-2 font-mono"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"/> DB_LINK: ACTIVE</span>
            </div>
          </div>

        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;