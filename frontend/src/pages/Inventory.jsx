import React, { useState, useEffect } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { 
  Globe, 
  MessageSquare, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  X,
  Loader2,
  Trash2
} from 'lucide-react'

const IntegrationCard = ({ icon: Icon, title, description, status, color, onConnect }) => (
  <Card className="hover:border-cobalt-accent transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-20`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className={`text-[10px] font-bold px-2 py-1 rounded border ${status === 'Connected' ? 'border-risk-low text-risk-low' : 'border-cobalt-border text-cobalt-muted'}`}>
        {status.toUpperCase()}
      </div>
    </div>
    <h4 className="font-bold text-white mb-1 group-hover:text-cobalt-accent transition-colors">{title}</h4>
    <p className="text-xs text-cobalt-muted mb-6 leading-relaxed">{description}</p>
    <Button 
      onClick={onConnect}
      variant={status === 'Connected' ? 'outline' : 'primary'} 
      className="w-full text-xs py-2"
    >
      {status === 'Connected' ? 'Manage Settings' : `Connect ${title}`}
    </Button>
  </Card>
)

const Step = ({ number, title, desc, active, completed }) => (
  <div className="flex gap-4 pb-8 relative last:pb-0">
    <div className="absolute left-[15px] top-8 w-[2px] h-full bg-cobalt-border last:hidden"></div>
    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
      completed ? 'bg-cobalt-accent border-cobalt-accent' : 
      active ? 'border-cobalt-accent text-cobalt-accent' : 'border-cobalt-border text-cobalt-muted'
    }`}>
      {completed ? <CheckCircle2 size={16} className="text-cobalt-bg" /> : <span className="text-xs font-bold">{number}</span>}
    </div>
    <div>
      <h4 className={`text-sm font-bold uppercase tracking-wider ${active || completed ? 'text-white' : 'text-cobalt-muted'}`}>{title}</h4>
      <p className="text-xs text-cobalt-muted mt-1 max-w-[200px]">{desc}</p>
    </div>
  </div>
)

const Inventory = () => {
  // --- GitHub Logic ---
  const [showGhModal, setShowGhModal] = useState(false)
  const [repoName, setRepoName] = useState('')
  const [ghToken, setGhToken] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [monitoredRepos, setMonitoredRepos] = useState([])

  const fetchRepos = async () => {
    try {
      const res = await fetch("http://localhost:5000/repo/list")
      const data = await res.json()
      setMonitoredRepos(data.repositories || [])
    } catch (err) { console.error("List fetch failed", err) }
  }

  useEffect(() => { fetchRepos() }, [])

  const handleConnectRepo = async (e) => {
    e.preventDefault()
    setIsConnecting(true)
    try {
      const res = await fetch("http://localhost:5000/repo/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: repoName, token: ghToken })
      })
      if (res.ok) {
        setShowGhModal(false)
        setRepoName(''); setGhToken('')
        fetchRepos()
      }
    } catch (err) { alert("Connection failed") }
    finally { setIsConnecting(false) }
  }

  const handleDisconnect = async (name) => {
    if (!window.confirm(`Stop monitoring ${name}?`)) return
    try {
      await fetch("http://localhost:5000/repo/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo: name })
      })
      fetchRepos()
    } catch (err) { console.error(err) }
  }

  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8">
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-xl font-heading font-bold text-white mb-8 uppercase tracking-widest text-sm">Onboarding Progress</h2>
                <Step number="01" title="Connect Sources" desc="Link your GitHub or Cloud storage." completed={monitoredRepos.length > 0} />
                <Step number="02" title="Scan Perimeter" desc="Grok analyzes code for entropy & patterns." active={monitoredRepos.length > 0} />
                <Step number="03" title="Verify Logs" desc="Review detected risks in the system log." />
                <Step number="04" title="Final Report" desc="Generate your compliance audit." />

                <div className="mt-12 p-5 bg-cobalt-accent/5 border border-cobalt-accent/20 rounded-2xl">
                  <div className="flex items-center gap-2 text-cobalt-accent mb-2">
                    <Zap size={16} />
                    <span className="text-xs font-bold uppercase tracking-tighter">Pro Tip</span>
                  </div>
                  <p className="text-[11px] text-cobalt-muted leading-normal font-medium">
                    AuditShield works best when Slack notifications are enabled.
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3 space-y-8">
              <div className="bg-cobalt-surface border border-cobalt-border rounded-2xl p-8 flex items-center justify-between overflow-hidden relative">
                <div className="z-10">
                  <h2 className="text-2xl font-heading font-bold text-white uppercase tracking-tight">Integration Hub</h2>
                  <p className="text-cobalt-muted mt-2 max-w-lg text-sm font-medium">
                    Authorize AuditShield to monitor your digital perimeter in real-time.
                  </p>
                </div>
                <ShieldCheck size={120} className="absolute right-[-20px] text-cobalt-accent opacity-5" />
              </div>

              {/* Integrations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <IntegrationCard 
                  icon={Globe} title="GitHub" 
                  description="Real-time scanning for hardcoded secrets and leaked keys." 
                  status={monitoredRepos.length > 0 ? "Connected" : "Disconnected"}
                  color="bg-white/10 text-white"
                  onConnect={() => setShowGhModal(true)}
                />
                <IntegrationCard icon={HardDrive} title="Google Drive" description="Scan public file permissions and metadata." status="Disconnected" color="bg-blue-500 text-blue-500" />
                <IntegrationCard icon={MessageSquare} title="Slack" description="Instant remediation alerts in your channels." status="Disconnected" color="bg-purple-500 text-purple-500" />
              </div>

              {/* Monitored Assets List */}
              {monitoredRepos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-risk-low animate-pulse"></div>
                    Currently Monitored Assets
                  </h3>
                  <div className="grid grid-cols-1 gap-3">
                    {monitoredRepos.map((repo, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-cobalt-surface/50 border border-cobalt-border rounded-xl">
                        <div className="flex items-center gap-3">
                          <Globe size={18} className="text-cobalt-accent" />
                          <span className="font-mono text-sm text-white">{repo}</span>
                        </div>
                        <button onClick={() => handleDisconnect(repo)} className="text-cobalt-muted hover:text-risk-high transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Card className="bg-risk-high/5 border-risk-high/20">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 bg-risk-high/10 rounded-full text-risk-high"><Zap size={32} /></div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold uppercase text-sm tracking-tight">Deep Scan Required</h4>
                    <p className="text-xs text-cobalt-muted mt-1">Connect multiple sources to unlock full perimeter analysis.</p>
                  </div>
                  <Button variant="outline" className="border-risk-high/50 text-risk-high hover:bg-risk-high hover:text-white">Scan Documentation</Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* GitHub Connection Modal */}
      {showGhModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-cobalt-bg/80 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="max-w-md w-full border-cobalt-accent shadow-2xl relative">
            <button onClick={() => setShowGhModal(false)} className="absolute top-4 right-4 text-cobalt-muted hover:text-white">
              <X size={20} />
            </button>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white uppercase tracking-tighter">Authorize Repository</h3>
              <p className="text-xs text-cobalt-muted mt-1">Provide repo name and a classic Personal Access Token.</p>
            </div>
            <form onSubmit={handleConnectRepo} className="space-y-4">
              <Input label="Repository Name" placeholder="username/repo-name" value={repoName} onChange={e => setRepoName(e.target.value)} required />
              <Input label="GitHub Access Token" type="password" placeholder="ghp_xxxxxxxxxxxx" value={ghToken} onChange={e => setGhToken(e.target.value)} required />
              <div className="p-3 bg-cobalt-bg rounded-lg border border-cobalt-border text-[10px] text-cobalt-muted leading-relaxed uppercase font-bold tracking-tight">
                AuditShield requires 'repo' read scope to monitor commits.
              </div>
              <Button type="submit" className="w-full py-3" disabled={isConnecting}>
                {isConnecting ? <Loader2 className="animate-spin mx-auto" /> : "Initiate Perimeter Guard"}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Inventory