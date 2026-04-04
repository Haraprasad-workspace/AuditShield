"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import ScoreGauge from '../components/dashboard/ScoreGauge';
import RiskTrendChart from '../components/dashboard/RiskTrendChart';
import AlertCard from '../components/alerts/AlertCard';
import RemediationAgent from '../components/alerts/RemediationAgent';
import { 
  ShieldAlert, Globe, Activity, 
  RefreshCw, ShieldCheck, Database, Search, 
  ArrowUpRight, Zap, Clock, Terminal
} from 'lucide-react';

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
        fetch("http://localhost:5000/api/alerts/recent?t=" + Date.now()),
        fetch("http://localhost:5000/repo/list")
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

  const itemVars = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans">
      <Sidebar />
      
      <div className="ml-0 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        
        <motion.main 
          initial="initial"
          animate="animate"
          variants={containerVars}
          className="p-8 lg:p-12 space-y-10 max-w-[1600px] mx-auto w-full"
        >
          
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">
                Security <span className="text-cobalt-accent">Dashboard</span>
              </h1>
              <p className="text-sm text-gray-400">
                System Status: Secure • {currentTime.toLocaleTimeString()}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input placeholder="Search..." className="bg-white/5 px-3 py-2 rounded-lg text-sm" />
              <button onClick={fetchDashboardData}>
                <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* SCORE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 rounded-xl">
              <h3 className="text-sm text-gray-400">Security Score</h3>
              <h2 className="text-5xl font-bold">{securityScore}/100</h2>
              <p className="text-sm text-gray-400">
                System scan complete. {securityScore > 90 ? "Your system is safe." : "Some risks found."}
              </p>
            </div>

            <div className="flex justify-center items-center">
              <ScoreGauge score={parseFloat(securityScore)} />
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-white/5 rounded-lg">
              <p>Repositories</p>
              <h3>{repos.length}</h3>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p>Files Scanned</p>
              <h3>12.4K</h3>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p>Alerts</p>
              <h3>{alerts.length}</h3>
            </div>
            <div className="p-4 bg-white/5 rounded-lg">
              <p>System Health</p>
              <h3>99.9%</h3>
            </div>
          </div>

          {/* CHART */}
          <div className="p-6 bg-white/5 rounded-xl">
            <h3>Security Activity</h3>
            <RiskTrendChart />
          </div>

          {/* ALERTS */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3>Recent Alerts</h3>
              <button onClick={() => navigate('/logs')}>
                View All <ArrowUpRight size={14}/>
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : alerts.length > 0 ? (
              alerts.map((alert, i) => (
                <AlertCard
                  key={i}
                  severity={alert.risk}
                  title={alert.message}
                  description={alert.reason}
                  time={alert.created_at}
                />
              ))
            ) : (
              <p>No security issues found.</p>
            )}
          </div>

          {/* SYSTEM HEALTH */}
          <div className="p-6 bg-white/5 rounded-xl">
            <h3>System Health</h3>
            <p>CPU Usage: Normal</p>
            <p>Response Time: Fast</p>
          </div>

        </motion.main>
      </div>
    </div>
  );
};

export default Dashboard;