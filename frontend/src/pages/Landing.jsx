import React from 'react'
import { Link } from 'react-router-dom'
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Globe, 
  Cpu, 
  ChevronRight, 
  HardDrive, 
  Terminal,
  Activity,
  Database,
  Infinity,
  Fingerprint,
  Server,
  Layers,
  ArrowRight, // ✅ Fixed: Added missing import
  ShieldAlert
} from 'lucide-react'
import Button from '../components/ui/Button'

const FeatureCard = ({ icon: Icon, title, desc }) => (
  <div className="p-10 bg-cobalt-surface/30 border border-cobalt-border rounded-[2.5rem] hover:border-cobalt-accent transition-all duration-500 group hover:bg-cobalt-surface/50 shadow-sm">
    <div className="w-14 h-14 bg-cobalt-accent/10 rounded-2xl flex items-center justify-center text-cobalt-accent mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-heading font-bold text-white mb-4 uppercase tracking-tight italic">0x_{title}</h3>
    <p className="text-sm text-cobalt-muted leading-relaxed font-medium">{desc}</p>
  </div>
)

const Landing = () => {
  return (
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent selection:text-white overflow-x-hidden">
      
      {/* --- ELITE NAVIGATION --- */}
      <header className="fixed top-0 w-full z-50 border-b border-cobalt-border bg-cobalt-bg/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-cobalt-accent rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              <ShieldCheck size={26} className="text-cobalt-bg" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-black tracking-tighter uppercase leading-none">AuditShield</span>
              <span className="text-[9px] font-black tracking-[0.4em] text-cobalt-accent uppercase">Security Protocol</span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-cobalt-muted">
            <a href="#perimeter" className="hover:text-cobalt-accent transition-colors">Perimeter</a>
            <a href="#engine" className="hover:text-cobalt-accent transition-colors">Neural_Engine</a>
            <a href="#compliance" className="hover:text-cobalt-accent transition-colors">Governance</a>
          </nav>

          <div className="flex items-center gap-6">
            <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-cobalt-muted hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register">
              <Button className="text-[10px] px-8 py-3 uppercase font-black tracking-widest shadow-xl">
                Request Access
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO: THE DIGITAL PERIMETER --- */}
      <section className="relative pt-64 pb-40 text-center">
        {/* Ambient background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cobalt-accent/5 blur-[160px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-cobalt-surface/50 border border-cobalt-border rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-cobalt-accent mb-10 animate-in fade-in slide-in-from-top-8 duration-1000">
            <Activity size={14} className="animate-pulse" /> Global Monitoring Active
          </div>

          <h1 className="text-7xl md:text-9xl font-heading font-black mb-10 tracking-tighter uppercase leading-[0.85] italic">
            Secure the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cobalt-accent to-blue-500">
              Invisible Frontier
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-xl text-cobalt-muted mb-14 leading-relaxed font-medium">
            The next generation of <span className="text-white italic text-lg uppercase tracking-widest">Autonomous Compliance</span>. 
            AuditShield deploys agentic AI to neutralize credential leaks and structural vulnerabilities before they manifest as breaches.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Link to="/register">
              <Button className="px-12 py-6 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 group bg-cobalt-accent text-cobalt-bg hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all">
                Initialize Protocol <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            <div className="flex items-center gap-6 text-[10px] text-cobalt-muted font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 bg-cobalt-surface/50 px-4 py-2 rounded-lg border border-cobalt-border">
                <Terminal size={14} className="text-cobalt-accent" /> Encrypted Shell
              </div>
              <div className="flex items-center gap-2 bg-cobalt-surface/50 px-4 py-2 rounded-lg border border-cobalt-border">
                <Fingerprint size={14} className="text-cobalt-accent" /> Biometric Auth
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION: TECHNICAL CORE --- */}
      <section id="perimeter" className="py-40 bg-cobalt-surface/10 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h4 className="text-cobalt-accent font-black text-[11px] uppercase tracking-[0.4em]">Integrated Defense</h4>
              <h2 className="text-5xl font-heading font-black uppercase tracking-tighter leading-none italic">
                Beyond Static <br /> Code Analysis.
              </h2>
              <p className="text-cobalt-muted leading-relaxed font-medium text-lg">
                While legacy tools look for patterns, AuditShield understands <span className="text-white font-bold">intent</span>. 
                Our neural engine simulates attacker reconnaissance to find secrets in places others don't look: 
                obfuscated binaries, deeply nested metadata, and transient cloud environment variables.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="space-y-3 p-6 bg-cobalt-surface/40 border border-cobalt-border rounded-2xl">
                  <h5 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Infinity size={14} className="text-cobalt-accent" /> 24/7 Sync
                  </h5>
                  <p className="text-[11px] text-cobalt-muted leading-relaxed uppercase tracking-tighter">Constant perimeter heartbeat monitoring across all nodes.</p>
                </div>
                <div className="space-y-3 p-6 bg-cobalt-surface/40 border border-cobalt-border rounded-2xl">
                  <h5 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} className="text-cobalt-accent" /> Multi-Layer
                  </h5>
                  <p className="text-[11px] text-cobalt-muted leading-relaxed uppercase tracking-tighter">From repo level to production environments, we stay linked.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-cobalt-bg border border-cobalt-border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cobalt-accent/10 to-transparent opacity-50"></div>
                <div className="relative z-10 flex flex-col justify-between h-full font-mono text-[10px] text-cobalt-muted uppercase">
                  <div className="space-y-2">
                    <p className="text-cobalt-accent font-bold">&gt; INITIALIZING_NEURAL_SCAN...</p>
                    <p>&gt; MAPPING_ASSETS: 1,402 DETECTED</p>
                    <p>&gt; ENTROPY_CALCULATION: 8.42 (CRITICAL)</p>
                    <p className="text-risk-high animate-pulse">&gt; WARNING: EXPOSED_API_KEY_FOUND_IN_BIN/LOGS</p>
                    <p>&gt; RUNNING_AGENTIC_REMEDIATION...</p>
                  </div>
                  <div className="p-6 bg-cobalt-bg/80 border border-cobalt-border rounded-2xl flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-risk-high/20 flex items-center justify-center text-risk-high">
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold tracking-tight">Threat Neutralized</p>
                        <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60">Status: Secure</p>
                      </div>
                    </div>
                    <Server size={24} className="text-cobalt-accent opacity-20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES: GRID OF TRUST --- */}
      <section id="engine" className="py-40">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={Cpu} 
            title="NEURAL_LOGIC" 
            desc="Heuristic analysis that identifies high-entropy strings and credential patterns with 99.9% precision." 
          />
          <FeatureCard 
            icon={Database} 
            title="VAULT_STORAGE" 
            desc="All security metadata is fragmented and encrypted using post-quantum cryptographic standards." 
          />
          <FeatureCard 
            icon={Zap} 
            title="AUTONOMOUS_FIX" 
            desc="Not just alerts. Our agents can automatically rotate keys and invalidate leaked tokens in real-time." 
          />
        </div>
      </section>

      {/* --- DETAILED ENTERPRISE FOOTER --- */}
      <footer className="bg-cobalt-bg border-t border-cobalt-border pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16 mb-32">
            
            {/* Branding Column */}
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-1.5 bg-cobalt-accent rounded-lg">
                  <ShieldCheck size={22} className="text-cobalt-bg" strokeWidth={3} />
                </div>
                <span className="text-xl font-heading font-black tracking-tighter uppercase italic">AuditShield</span>
              </div>
              <p className="text-sm text-cobalt-muted leading-relaxed max-w-sm font-medium">
                The global standard for automated perimeter defense. Protecting the world's most sensitive engineering assets through neural intelligence.
              </p>
              <div className="flex gap-6 text-cobalt-muted">
                <Globe size={18} className="hover:text-white cursor-pointer transition-colors" />
                <Terminal size={18} className="hover:text-white cursor-pointer transition-colors" />
                <Server size={18} className="hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Links Column 1 */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-cobalt-accent/50">Infrastructure</h4>
              <ul className="space-y-5">
                {['Security Engine', 'Network Perimeter', 'Neural Scanner', 'API Gateway'].map((item) => (
                  <li key={item} className="text-[10px] font-bold uppercase tracking-widest text-cobalt-muted hover:text-cobalt-accent cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            {/* Links Column 2 */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-cobalt-accent/50">Compliance</h4>
              <ul className="space-y-5">
                {['SOC2 Type II', 'ISO 27001', 'Privacy Shield', 'HIPAA Ready'].map((item) => (
                  <li key={item} className="text-[10px] font-bold uppercase tracking-widest text-cobalt-muted hover:text-cobalt-accent cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            {/* Links Column 3 */}
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-cobalt-accent/50">Organization</h4>
              <ul className="space-y-5">
                {['Our Vision', 'Research', 'Terms', 'Security Policy'].map((item) => (
                  <li key={item} className="text-[10px] font-bold uppercase tracking-widest text-cobalt-muted hover:text-cobalt-accent cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-cobalt-border flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-risk-low shadow-[0_0_8px_#10B981]"></div>
                System Status: Verified
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                Build: AS_v2.4.0_STABLE
              </div>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted flex items-center gap-2">
              <Fingerprint size={12} className="text-cobalt-accent" /> © 2026 AUDITSHIELD SYSTEMS BY CODEX LABS
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing