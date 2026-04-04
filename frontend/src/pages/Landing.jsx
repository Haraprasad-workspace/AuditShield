import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion' // Added for smooth animations
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  Cpu, 
  Terminal,
  Activity,
  Database,
  Fingerprint,
  Server,
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react'
import Button from '../components/ui/Button'

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="p-10 bg-cobalt-surface/30 border border-cobalt-border rounded-[2.5rem] hover:border-cobalt-accent transition-all duration-500 group hover:bg-cobalt-surface/50 shadow-sm"
  >
    <div className="w-14 h-14 bg-cobalt-accent/10 rounded-2xl flex items-center justify-center text-cobalt-accent mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all">
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-heading font-bold text-white mb-4 uppercase tracking-tight italic">{title}</h3>
    <p className="text-sm text-cobalt-muted leading-relaxed font-medium">{desc}</p>
  </motion.div>
)

const Landing = () => {
  return (
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent selection:text-white overflow-x-hidden font-sans">
      
      {/* --- NAVIGATION --- */}
      <header className="fixed top-0 w-full z-50 border-b border-cobalt-border bg-cobalt-bg/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="p-2.5 bg-cobalt-accent rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              <ShieldCheck size={26} className="text-cobalt-bg" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-heading font-black tracking-tighter uppercase leading-none">AuditShield</span>
              <span className="text-[9px] font-black tracking-[0.4em] text-cobalt-accent uppercase">Security Protocol</span>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-cobalt-muted">
            <a href="#protection" className="hover:text-cobalt-accent transition-colors">Protection</a>
            <a href="#scanner" className="hover:text-cobalt-accent transition-colors">AI_Scanner</a>
            <a href="#compliance" className="hover:text-cobalt-accent transition-colors">Governance</a>
          </nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-6"
          >
            <Link to="/auth" className="text-[10px] font-black uppercase tracking-widest text-cobalt-muted hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register">
              <Button className="text-[10px] px-8 py-3 uppercase font-black tracking-widest shadow-xl">
                Request Access
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-64 pb-40 text-center">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cobalt-accent/5 blur-[160px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <motion.div 
            {...fadeInUp}
            className="inline-flex items-center gap-3 px-5 py-2 bg-cobalt-surface/50 border border-cobalt-border rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-cobalt-accent mb-10"
          >
            <Activity size={14} className="animate-pulse" /> Live Monitoring Active
          </motion.div>

          {/* Fixed leading and refined gradient */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-heading font-black mb-10 tracking-tighter uppercase leading-[1] italic"
          >
            Secure the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cobalt-accent to-blue-400">
              Invisible Frontier
            </span>
          </motion.h1>

          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-cobalt-muted mb-14 leading-relaxed font-medium"
          >
            The next generation of <span className="text-white italic text-lg uppercase tracking-widest">Digital Defense</span>. 
            AuditShield uses smart AI to stop security leaks and system flaws before they become problems.
          </motion.p>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/register">
              <Button className="px-12 py-6 text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 group bg-cobalt-accent text-cobalt-bg hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-all">
                Start Security Scan <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            <div className="flex items-center gap-6 text-[10px] text-cobalt-muted font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 bg-cobalt-surface/50 px-4 py-2 rounded-lg border border-cobalt-border">
                <Terminal size={14} className="text-cobalt-accent" /> Secure Console
              </div>
              <div className="flex items-center gap-2 bg-cobalt-surface/50 px-4 py-2 rounded-lg border border-cobalt-border">
                <Fingerprint size={14} className="text-cobalt-accent" /> Verified Access
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PROTECTION CORE --- */}
      <section id="protection" className="py-40 bg-cobalt-surface/10 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h4 className="text-cobalt-accent font-black text-[11px] uppercase tracking-[0.4em]">Integrated Protection</h4>
              <h2 className="text-5xl font-heading font-black uppercase tracking-tighter leading-none italic">
                Smarter than <br /> standard checks.
              </h2>
              <p className="text-cobalt-muted leading-relaxed font-medium text-lg">
                While old tools only look for basic patterns, AuditShield understands your <span className="text-white font-bold">system's behavior</span>. 
                Our AI scanner thinks like a defender to find hidden risks in places others miss: 
                complex code, deep system files, and cloud settings.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="space-y-3 p-6 bg-cobalt-surface/40 border border-cobalt-border rounded-2xl">
                  <h5 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Activity size={14} className="text-cobalt-accent" /> Live Sync
                  </h5>
                  <p className="text-[11px] text-cobalt-muted leading-relaxed uppercase tracking-tighter">Non-stop monitoring across your entire network.</p>
                </div>
                <div className="space-y-3 p-6 bg-cobalt-surface/40 border border-cobalt-border rounded-2xl">
                  <h5 className="text-white font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <Layers size={14} className="text-cobalt-accent" /> Full Coverage
                  </h5>
                  <p className="text-[11px] text-cobalt-muted leading-relaxed uppercase tracking-tighter">From your first line of code to the final live server.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-cobalt-bg border border-cobalt-border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-cobalt-accent/10 to-transparent opacity-50"></div>
                <div className="relative z-10 flex flex-col justify-between h-full font-mono text-[10px] text-cobalt-muted uppercase">
                  <div className="space-y-2">
                    <p className="text-cobalt-accent font-bold">&gt; STARTING_SCAN...</p>
                    <p>&gt; CHECKING_SYSTEM: 1,402 FILES</p>
                    <p>&gt; RISK_LEVEL: HIGH</p>
                    <p className="text-red-400 animate-pulse">&gt; WARNING: EXPOSED_KEY_FOUND_IN_LOGS</p>
                    <p>&gt; FIXING_AUTOMATICALLY...</p>
                  </div>
                  <div className="p-6 bg-cobalt-bg/80 border border-cobalt-border rounded-2xl flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                        <ShieldAlert size={20} />
                      </div>
                      <div>
                        <p className="text-white font-bold tracking-tight">Issue Resolved</p>
                        <p className="text-[8px] uppercase tracking-[0.3em] font-black opacity-60">Status: Safe</p>
                      </div>
                    </div>
                    <Server size={24} className="text-cobalt-accent opacity-20" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="scanner" className="py-40">
        <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-3 gap-10">
          <FeatureCard 
            icon={Cpu} 
            title="Smart Detection" 
            desc="Intelligent analysis that finds leaked passwords and security gaps with 99.9% accuracy." 
            delay={0.1}
          />
          <FeatureCard 
            icon={Database} 
            title="Secure Vault" 
            desc="Your security data is broken apart and locked away using the world's strongest encryption." 
            delay={0.2}
          />
          <FeatureCard 
            icon={Zap} 
            title="Auto-Heal" 
            desc="We don't just find problems; our system can automatically fix leaks and reset keys instantly." 
            delay={0.3}
          />
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-cobalt-bg border-t border-cobalt-border pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-16 mb-32">
            
            <div className="col-span-2 space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-1.5 bg-cobalt-accent rounded-lg">
                  <ShieldCheck size={22} className="text-cobalt-bg" strokeWidth={3} />
                </div>
                <span className="text-xl font-heading font-black tracking-tighter uppercase italic">AuditShield</span>
              </div>
              <p className="text-sm text-cobalt-muted leading-relaxed max-w-sm font-medium">
                The global standard for automated digital defense. Protecting your most valuable work through intelligent security.
              </p>
              <div className="flex gap-6 text-cobalt-muted">
                <Globe size={18} className="hover:text-white cursor-pointer transition-colors" />
                <Terminal size={18} className="hover:text-white cursor-pointer transition-colors" />
                <Server size={18} className="hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-cobalt-accent/50">Product</h4>
              <ul className="space-y-5">
                {['Security Engine', 'Network Shield', 'AI Scanner', 'API Protection'].map((item) => (
                  <li key={item} className="text-[10px] font-bold uppercase tracking-widest text-cobalt-muted hover:text-cobalt-accent cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-cobalt-accent/50">Trust</h4>
              <ul className="space-y-5">
                {['Security Audits', 'Compliance', 'Privacy Shield', 'Certifications'].map((item) => (
                  <li key={item} className="text-[10px] font-bold uppercase tracking-widest text-cobalt-muted hover:text-cobalt-accent cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white underline underline-offset-8 decoration-cobalt-accent/50">Company</h4>
              <ul className="space-y-5">
                {['Our Vision', 'Research', 'Terms', 'Security Policy'].map((item) => (
                  <li key={item} className="text-[10px] font-bold uppercase tracking-widest text-cobalt-muted hover:text-cobalt-accent cursor-pointer transition-colors">{item}</li>
                ))}
              </ul>
            </div>

          </div>

          <div className="pt-12 border-t border-cobalt-border flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></div>
                Systems Protected
              </div>
              <div className="text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                v2.4.0 Stable
              </div>
            </div>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted flex items-center gap-2">
              <Fingerprint size={12} className="text-cobalt-accent" /> © 2026 AUDITSHIELD SYSTEMS
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing