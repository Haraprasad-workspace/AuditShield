import React, { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import ScoreGauge from '../components/dashboard/ScoreGauge'
import RiskTrendChart from '../components/dashboard/RiskTrendChart'
import AlertCard from '../components/alerts/AlertCard'
import RemediationAgent from '../components/alerts/RemediationAgent'
import { ShieldAlert, Globe, Cpu, Zap, Activity } from 'lucide-react'

const Dashboard = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    scannedFiles: 0,
    activeRepos: 0,
    threatsBlocked: 0
  })

  // 🔄 Fetch Real Alerts from Supabase/Backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Alerts
        const alertRes = await fetch("http://localhost:5000/api/alerts/recent") // Assuming your teammate creates this endpoint
        const alertData = await alertRes.json()
        setAlerts(alertData || [])

        // Fetch Repo Count
        const repoRes = await fetch("http://localhost:5000/repo/list")
        const repoData = await repoRes.json()
        
        setStats({
          scannedFiles: 12402, // Mock or fetch from a count() query
          activeRepos: repoData.repositories?.length || 0,
          threatsBlocked: alertData.length + 15 // Mock logic
        })
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8 space-y-8 animate-in fade-in duration-700">
          
          {/* --- TOP ROW: GLOBAL STATUS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Audit Readiness Score */}
            <div className="lg:col-span-2 bg-cobalt-surface border border-cobalt-border p-6 rounded-2xl flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldAlert size={120} />
              </div>
              <div className="z-10">
                <h3 className="text-cobalt-muted uppercase text-[10px] font-black tracking-[0.2em] mb-1">Audit Readiness</h3>
                <h2 className="text-4xl font-heading font-bold text-white tracking-tighter">94% SECURE</h2>
                <p className="text-xs text-cobalt-muted mt-2 font-medium">Your perimeter is optimized for <span className="text-cobalt-accent underline underline-offset-4">SOC2 Type II</span> compliance.</p>
              </div>
              <ScoreGauge score={94} />
            </div>

            {/* Quick Stats Widgets */}
            <div className="space-y-4">
               <div className="bg-cobalt-surface border border-cobalt-border p-4 rounded-xl flex items-center gap-4">
                  <div className="p-2 bg-cobalt-accent/10 text-cobalt-accent rounded-lg"><Globe size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-cobalt-muted tracking-widest">Active Repos</p>
                    <h4 className="text-xl font-bold text-white">{stats.activeRepos}</h4>
                  </div>
               </div>
               <div className="bg-cobalt-surface border border-cobalt-border p-4 rounded-xl flex items-center gap-4">
                  <div className="p-2 bg-risk-low/10 text-risk-low rounded-lg"><Cpu size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-cobalt-muted tracking-widest">Scanned Assets</p>
                    <h4 className="text-xl font-bold text-white">{stats.scannedFiles.toLocaleString()}</h4>
                  </div>
               </div>
            </div>

            {/* Agentic AI Widget */}
            <RemediationAgent />
          </div>

          {/* --- MIDDLE ROW: ANALYTICS & LIVE MONITORING --- */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Risk Trend Chart */}
            <div className="xl:col-span-2 bg-cobalt-surface border border-cobalt-border p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-heading font-bold text-white uppercase text-xs tracking-[0.15em] flex items-center gap-2">
                  <Activity size={16} className="text-cobalt-accent" /> Risk Detection Trend
                </h3>
                <select className="bg-cobalt-bg border border-cobalt-border text-[10px] font-bold text-cobalt-muted rounded px-2 py-1 outline-none">
                  <option>LAST 7 DAYS</option>
                  <option>LAST 30 DAYS</option>
                </select>
              </div>
              <RiskTrendChart />
            </div>

            {/* Live System Status Ticker */}
            <div className="bg-cobalt-surface border border-cobalt-border p-6 rounded-2xl flex flex-col justify-between">
               <div>
                <h3 className="font-heading font-bold text-white uppercase text-xs tracking-[0.15em] mb-4">Engine Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cobalt-muted">Grok-1 AI Engine</span>
                    <span className="text-risk-low font-bold uppercase tracking-tighter">Operational</span>
                  </div>
                  <div className="w-full bg-cobalt-bg h-1 rounded-full overflow-hidden">
                    <div className="bg-risk-low h-full w-[98%]"></div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cobalt-muted">GitHub Webhook Latency</span>
                    <span className="text-white font-mono">142ms</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cobalt-muted">Database Sync</span>
                    <span className="text-risk-low font-bold">Active</span>
                  </div>
                </div>
               </div>
               
               <div className="mt-8 p-4 bg-cobalt-accent/5 rounded-xl border border-cobalt-accent/20">
                  <div className="flex items-center gap-2 text-cobalt-accent mb-2">
                    <Zap size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Autonomous Mode</span>
                  </div>
                  <p className="text-[10px] text-cobalt-muted leading-relaxed font-medium italic">
                    "AI is currently monitoring the perimeter. No critical remediation required."
                  </p>
               </div>
            </div>
          </div>

          {/* --- BOTTOM ROW: ALERTS FEED --- */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-bold text-white uppercase text-xs tracking-[0.15em]">Critical Security Feed</h3>
              <button className="text-[10px] font-bold text-cobalt-accent hover:underline uppercase tracking-widest">View All Logs</button>
            </div>
            
            {loading ? (
              <div className="py-10 text-center text-cobalt-muted text-sm font-medium animate-pulse">Scanning Perimeter for Updates...</div>
            ) : alerts.length > 0 ? (
              alerts.map((alert, index) => (
                <AlertCard 
                  key={index}
                  severity={alert.risk || "Medium"} 
                  title={alert.message} 
                  description={alert.reason} 
                  time={alert.created_at || "Just now"} 
                />
              ))
            ) : (
              <div className="bg-cobalt-surface/30 border border-cobalt-border border-dashed p-10 rounded-2xl text-center">
                <div className="w-12 h-12 bg-risk-low/10 text-risk-low rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldAlert size={24} />
                </div>
                <h4 className="text-white font-bold text-sm uppercase tracking-tight">Perimeter Clean</h4>
                <p className="text-xs text-cobalt-muted mt-1">No critical threats detected in the last 24 hours.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard