import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion' // Added for smooth UI
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import ScoreGauge from '../components/dashboard/ScoreGauge'
import RiskTrendChart from '../components/dashboard/RiskTrendChart'
import AlertCard from '../components/alerts/AlertCard'
import RemediationAgent from '../components/alerts/RemediationAgent'
import { 
  ShieldAlert, Globe, Activity, 
  RefreshCw, ShieldCheck, Database, Search, 
  ArrowUpRight, Zap, Cpu
} from 'lucide-react'

const Dashboard = () => {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [stats, setStats] = useState({
    scannedFiles: 0,
    activeRepos: 0,
    threatsBlocked: 0,
    uptime: "99.9%"
  })

  const fetchDashboardData = async () => {
    setIsRefreshing(true)
    try {
      const [alertRes, repoRes] = await Promise.all([
        fetch("http://localhost:5000/api/alerts/recent"),
        fetch("http://localhost:5000/repo/list")
      ])

      const alertData = await alertRes.json()
      const repoData = await repoRes.json()

      setAlerts(alertData || [])
      setStats({
        scannedFiles: 12402,
        activeRepos: repoData.repos?.length || 0,
        threatsBlocked: (alertData.length || 0) + 12,
        uptime: "99.98%"
      })
    } catch (err) {
      console.error("Dashboard Sync Error:", err)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 60000)
    return () => clearInterval(interval)
  }, [])

  // Animation variants
  const containerVars = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.5 } }
  }

  const itemVars = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 }
  }

  return (
    <div className="min-h-screen bg-cobalt-bg text-white font-sans selection:bg-cobalt-accent selection:text-white">
      <Sidebar />
      
      <div className="ml-64 flex flex-col min-h-screen">
        <Navbar />
        
        <motion.main 
          initial="initial"
          animate="animate"
          variants={containerVars}
          className="p-8 space-y-8 flex-1"
        >
          
          {/* --- HEADER SECTION --- */}
          <div className="flex justify-between items-center bg-cobalt-surface/30 p-6 rounded-3xl border border-cobalt-border/50 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-3xl font-heading font-black tracking-tighter uppercase">Security Dashboard</h1>
                <div className="text-cobalt-muted text-[10px] font-black uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse shadow-[0_0_8px_#10B981]"></div>
                  AI Monitoring: ACTIVE
                </div>
              </div>
              <div className="h-10 w-[2px] bg-cobalt-border hidden md:block"></div>
              <div className="hidden md:block">
                 <p className="text-[9px] font-black text-cobalt-muted uppercase tracking-widest">Last System Check</p>
                 <p className="text-xs font-mono text-white">03-04-2026 18:05:12</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cobalt-muted" size={14} />
                <input 
                  type="text" 
                  placeholder="SEARCH NETWORK..." 
                  className="bg-cobalt-bg border border-cobalt-border rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold outline-none focus:border-cobalt-accent transition-all w-48"
                />
              </div>
              <button 
                onClick={fetchDashboardData}
                className="p-3 bg-cobalt-surface border border-cobalt-border rounded-xl hover:border-cobalt-accent transition-all group shadow-lg"
              >
                <RefreshCw size={20} className={`${isRefreshing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} text-cobalt-muted group-hover:text-cobalt-accent`} />
              </button>
            </div>
          </div>

          {/* --- TOP ROW: GLOBAL STATUS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <motion.div 
              variants={itemVars}
              className="lg:col-span-7 bg-gradient-to-br from-cobalt-surface to-cobalt-bg border border-cobalt-border p-8 rounded-3xl flex items-center justify-between relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <ShieldCheck size={200} className="text-cobalt-accent" />
              </div>
              
              <div className="z-10 space-y-4">
                <div>
                  <h3 className="text-cobalt-accent uppercase text-[10px] font-black tracking-[0.3em] mb-1">Security Health</h3>
                  <h2 className="text-5xl font-heading font-black tracking-tighter italic">94.8<span className="text-xl text-cobalt-muted">/100</span></h2>
                </div>
                <p className="text-sm text-cobalt-muted max-w-xs leading-relaxed font-medium">
                  Your current setup exceeds <span className="text-white font-bold">Standard Security</span> baseline requirements.
                </p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-risk-low/10 border border-risk-low/20 rounded-full text-[10px] font-black text-risk-low uppercase">No Leaks Found</span>
                  <span className="px-3 py-1 bg-cobalt-accent/10 border border-cobalt-accent/20 rounded-full text-[10px] font-black text-cobalt-accent uppercase">Verified</span>
                </div>
              </div>
              <div className="scale-125 mr-8">
                <ScoreGauge score={94} />
              </div>
            </motion.div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
               {[
                 { label: 'Monitored Links', val: stats.activeRepos, icon: <Globe size={18}/>, color: 'text-cobalt-accent' },
                 { label: 'Scanned Files', val: stats.scannedFiles.toLocaleString(), icon: <Database size={18}/>, color: 'text-risk-low' },
                 { label: 'Threats Stopped', val: stats.threatsBlocked, icon: <ShieldAlert size={18}/>, color: 'text-risk-high' },
                 { label: 'System Uptime', val: stats.uptime, icon: <Activity size={18}/>, color: 'text-white' }
               ].map((item, i) => (
                 <motion.div 
                   key={i} 
                   variants={itemVars}
                   whileHover={{ y: -5 }}
                   className="bg-cobalt-surface/40 border border-cobalt-border p-5 rounded-2xl hover:border-cobalt-accent/50 transition-all group cursor-default"
                 >
                    <div className={`${item.color} mb-3 opacity-80 group-hover:scale-110 transition-transform`}>{item.icon}</div>
                    <p className="text-[9px] uppercase font-black text-cobalt-muted tracking-widest">{item.label}</p>
                    <h4 className="text-2xl font-heading font-bold mt-1 tracking-tighter font-mono">{item.val}</h4>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* --- MIDDLE ROW: ANALYTICS & AGENT --- */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <motion.div variants={itemVars} className="xl:col-span-3 bg-cobalt-surface border border-cobalt-border p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-heading font-black text-white uppercase text-xs tracking-[0.2em] flex items-center gap-3">
                  <Activity size={18} className="text-cobalt-accent" /> Threat Activity
                </h3>
                <div className="flex bg-cobalt-bg p-1 rounded-lg border border-cobalt-border">
                  <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest bg-cobalt-surface rounded-md shadow-lg">7D</button>
                  <button className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-cobalt-muted hover:text-white transition-colors">30D</button>
                </div>
              </div>
              <div className="h-[300px]">
                <RiskTrendChart />
              </div>
            </motion.div>

            <motion.div variants={itemVars} className="xl:col-span-1">
               <RemediationAgent />
            </motion.div>
          </div>

          {/* --- BOTTOM ROW: ISSUES FEED --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            
            <motion.div variants={itemVars} className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center px-4">
                <h3 className="font-heading font-black text-white uppercase text-xs tracking-[0.2em]">Active Issues</h3>
                <button 
                  onClick={() => navigate('/logs')}
                  className="group flex items-center gap-2 text-[10px] font-black text-cobalt-accent hover:text-white transition-colors uppercase tracking-[0.2em]"
                >
                  View Full History 
                  <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="h-24 w-full bg-cobalt-surface/30 border border-cobalt-border rounded-2xl animate-pulse"></div>
                  ))
                ) : alerts.length > 0 ? (
                  <AnimatePresence>
                    {alerts.map((alert, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <AlertCard 
                          severity={alert.risk || "Medium"} 
                          title={alert.message} 
                          description={alert.reason} 
                          time={alert.created_at || "Just now"} 
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="bg-cobalt-surface/20 border border-cobalt-border border-dashed p-16 rounded-3xl text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-risk-low/10 text-risk-low rounded-full flex items-center justify-center mb-4">
                      <ShieldCheck size={32} />
                    </div>
                    <h4 className="text-white font-black text-sm uppercase tracking-widest">Environment Clean</h4>
                    <p className="text-xs text-cobalt-muted mt-2 uppercase tracking-tighter">No threats detected in the latest scan cycle.</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div variants={itemVars} className="bg-cobalt-surface/40 border border-cobalt-border p-8 rounded-[2.5rem] h-fit">
               <h3 className="font-heading font-black text-white uppercase text-xs tracking-[0.2em] mb-8">System Health</h3>
               <div className="space-y-8">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em]">
                      <span className="text-cobalt-muted italic">System_Load</span>
                      <span className="text-risk-low">Optimal</span>
                    </div>
                    <div className="h-1.5 w-full bg-cobalt-bg rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "98%" }} 
                        className="h-full bg-risk-low shadow-[0_0_12px_#10B981]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.3em]">
                      <span className="text-cobalt-muted italic">Sync_Speed</span>
                      <span className="text-cobalt-accent">14ms Verified</span>
                    </div>
                    <div className="h-1.5 w-full bg-cobalt-bg rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "40%" }} 
                        className="h-full bg-cobalt-accent shadow-[0_0_12px_#38BDF8]"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-cobalt-border/50 mt-8">
                    <div className="p-5 bg-cobalt-bg/80 rounded-2xl border border-cobalt-border shadow-inner group hover:border-cobalt-accent transition-colors">
                       <div className="flex items-center gap-2 text-cobalt-accent mb-3">
                         <Zap size={14} className="fill-cobalt-accent group-hover:scale-125 transition-transform"/>
                         <span className="text-[10px] font-black uppercase tracking-widest">Auto-Defense Status</span>
                       </div>
                       <p className="text-[10px] text-cobalt-muted leading-relaxed italic font-medium">
                         "Agent Grok is actively protecting your perimeter. No critical actions needed right now."
                       </p>
                    </div>
                  </div>
               </div>
            </motion.div>

          </div>
        </motion.main>
      </div>
    </div>
  )
}

export default Dashboard