import React from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { 
  Globe, 
  MessageSquare, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Circle 
} from 'lucide-react'

const IntegrationCard = ({ icon: Icon, title, description, status, color }) => (
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
    <Button variant={status === 'Connected' ? 'outline' : 'primary'} className="w-full text-xs py-2">
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
  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8">
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            
            <div className="xl:col-span-1">
              <div className="sticky top-24">
                <h2 className="text-xl font-heading font-bold text-white mb-8">GETTING STARTED</h2>
                
                <Step number="01" title="Connect Sources" desc="Link your code and document repositories for scanning." completed={true} />
                <Step number="02" title="Configure AI" desc="Define Grok's sensitivity and custom compliance rules." active={true} />
                <Step number="03" title="Run First Audit" desc="Initiate a deep-scan to baseline your security score." />
                <Step number="04" title="Automate Fixes" desc="Enable Agentic AI to resolve critical leaks instantly." />

                <div className="mt-12 p-5 bg-cobalt-accent/5 border border-cobalt-accent/20 rounded-2xl">
                  <div className="flex items-center gap-2 text-cobalt-accent mb-2">
                    <Zap size={16} />
                    <span className="text-xs font-bold uppercase tracking-tighter">Pro Tip</span>
                  </div>
                  <p className="text-[11px] text-cobalt-muted leading-normal">
                    AuditShield works best when Slack notifications are enabled.
                  </p>
                </div>
              </div>
            </div>

            <div className="xl:col-span-3">
              <div className="flex flex-col gap-8">
                
                <div className="bg-cobalt-surface border border-cobalt-border rounded-2xl p-8 flex items-center justify-between overflow-hidden relative">
                  <div className="z-10">
                    <h2 className="text-2xl font-heading font-bold text-white">INTEGRATION HUB</h2>
                    <p className="text-cobalt-muted mt-2 max-w-lg">
                      Authorize AuditShield to monitor your digital perimeter.
                    </p>
                  </div>
                  <ShieldCheck size={120} className="absolute right-[-20px] text-cobalt-accent opacity-5" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <IntegrationCard 
                    icon={Globe} 
                    title="GitHub" 
                    description="Monitor repositories for API keys, secrets, and unauthorized admin changes." 
                    status="Connected"
                    color="bg-white/10 text-white"
                  />
                  <IntegrationCard 
                    icon={HardDrive} 
                    title="Google Drive" 
                    description="Scan for public file permissions and sensitive document exposures." 
                    status="Disconnected"
                    color="bg-blue-500 text-blue-500"
                  />
                  <IntegrationCard 
                    icon={MessageSquare} 
                    title="Slack" 
                    description="Receive real-time AI alerts and remediation reports directly in your channels." 
                    status="Disconnected"
                    color="bg-purple-500 text-purple-500"
                  />
                  <IntegrationCard 
                    icon={ArrowRight} 
                    title="Custom API" 
                    description="Connect your own internal tools using our secure Webhook interface." 
                    status="Coming Soon"
                    color="bg-cobalt-accent text-cobalt-accent"
                  />
                </div>

                <Card className="bg-risk-high/5 border-risk-high/20">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="p-4 bg-risk-high/10 rounded-full text-risk-high">
                      <Zap size={32} />
                    </div>
                    <div className="text-center md:text-left flex-1">
                      <h4 className="text-white font-bold">Deep Scan Required</h4>
                      <p className="text-sm text-cobalt-muted mt-1">
                        Connect at least two sources to unlock full analysis.
                      </p>
                    </div>
                    <Button variant="outline" className="border-risk-high/50 text-risk-high hover:bg-risk-high hover:text-white">
                      Scan Documentation
                    </Button>
                  </div>
                </Card>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}

export default Inventory