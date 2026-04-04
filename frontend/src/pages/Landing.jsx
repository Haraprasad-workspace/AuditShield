import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, Zap, Globe, Cpu, Terminal, Activity,
  Database, Fingerprint, Server, Layers, ArrowRight,
  ShieldAlert, Menu, X 
} from 'lucide-react'
import Button from '../components/ui/Button'

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
    className="p-6 md:p-10 bg-cobalt-surface/30 border border-cobalt-border rounded-[2rem] md:rounded-[2.5rem] hover:border-cobalt-accent transition-all duration-500 group hover:bg-cobalt-surface/50 shadow-sm"
  >
    <div className="w-12 h-12 md:w-14 md:h-14 bg-cobalt-accent/10 rounded-2xl flex items-center justify-center text-cobalt-accent mb-6 md:mb-8 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.2)] transition-all">
      <Icon size={24} />
    </div>
    <h3 className="text-lg md:text-xl font-heading font-bold text-white mb-3 md:mb-4 uppercase tracking-tight italic">{title}</h3>
    <p className="text-xs md:text-sm text-cobalt-muted leading-relaxed font-medium">{desc}</p>
  </motion.div>
)

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent selection:text-white overflow-x-hidden font-sans">
      
      {/* --- NAVIGATION --- */}
      <header className="fixed top-0 w-full z-50 border-b border-cobalt-border bg-cobalt-bg/80 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 md:gap-4"
          >
            <div className="p-2 bg-cobalt-accent rounded-lg md:rounded-xl shadow-[0_0_25px_rgba(56,189,248,0.4)]">
              <ShieldCheck size={20} className="text-cobalt-bg md:w-[26px] md:h-[26px]" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-heading font-black tracking-tighter uppercase leading-none">AuditShield</span>
              <span className="text-[7px] md:text-[9px] font-black tracking-[0.4em] text-cobalt-accent uppercase">Security Protocol</span>
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.25em] text-cobalt-muted">
            <a href="#protection" className="hover:text-cobalt-accent transition-colors">Protection</a>
            <a href="#scanner" className="hover:text-cobalt-accent transition-colors">AI_Scanner</a>
            <a href="#compliance" className="hover:text-cobalt-accent transition-colors">Governance</a>
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/auth" className="hidden sm:block text-[10px] font-black uppercase tracking-widest text-cobalt-muted hover:text-white transition-colors">
              Login
            </Link>
            <Link to="/register" className="hidden xs:block">
              <Button className="text-[9px] md:text-[10px] px-4 md:px-8 py-2 md:py-3 uppercase font-black tracking-widest shadow-xl">
                Request Access
              </Button>
            </Link>
            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 text-cobalt-accent" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-cobalt-bg border-b border-cobalt-border overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 text-[10px] font-black uppercase tracking-widest text-cobalt-muted">
                <a href="#protection" onClick={() => setIsMenuOpen(false)}>Protection</a>
                <a href="#scanner" onClick={() => setIsMenuOpen(false)}>AI Scanner</a>
                <a href="#compliance" onClick={() => setIsMenuOpen(false)}>Governance</a>
                <Link to="/auth" className="text-white">Login</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 md:pt-64 pb-20 md:pb-40 text-center px-4">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[300px] md:h-[500px] bg-cobalt-accent/5 blur-[100px] md:blur-[160px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            {...fadeInUp}
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 bg-cobalt-surface/50 border border-cobalt-border rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-cobalt-accent mb-6 md:mb-10"
          >
            <Activity size={12} className="animate-pulse" /> Live Monitoring Active
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-5xl md:text-7xl font-heading font-black mb-6 md:mb-10 tracking-tighter uppercase leading-[1.1] md:leading-[1] italic px-2"
          >
            Secure the <br className="hidden sm:block" /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cobalt-accent to-blue-400">
              Invisible Frontier
            </span>
          </motion.h1>

          <motion.p 
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-base md:text-xl text-cobalt-muted mb-10 md:mb-14 leading-relaxed font-medium px-4"
          >
            The next generation of <span className="text-white italic text-sm md:text-lg uppercase tracking-widest">Digital Defense</span>. 
            Automated intelligence that stops leaks before they compromise your perimeter.
          </motion.p>

          <motion.div 
            {...fadeInUp}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-6 md:gap-8"
          >
            <Link to="/register" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto px-10 md:px-12 py-5 md:py-6 text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group bg-cobalt-accent text-cobalt-bg transition-all">
                Start Security Scan <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-[8px] md:text-[10px] text-cobalt-muted font-black uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2 bg-cobalt-surface/50 px-3 md:px-4 py-2 rounded-lg border border-cobalt-border">
                <Terminal size={12} className="text-cobalt-accent" /> Secure Console
              </div>
              <div className="flex items-center gap-2 bg-cobalt-surface/50 px-3 md:px-4 py-2 rounded-lg border border-cobalt-border">
                <Fingerprint size={12} className="text-cobalt-accent" /> Verified Access
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- PROTECTION CORE --- */}
      <section id="protection" className="py-20 md:py-40 bg-cobalt-surface/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 md:space-y-8"
            >
              <h4 className="text-cobalt-accent font-black text-[9px] md:text-[11px] uppercase tracking-[0.4em]">Integrated Protection</h4>
              <h2 className="text-3xl md:text-5xl font-heading font-black uppercase tracking-tighter leading-tight md:leading-none italic">
                Smarter than <br /> standard checks.
              </h2>
              <p className="text-sm md:text-lg text-cobalt-muted leading-relaxed font-medium">
                AuditShield understands your <span className="text-white font-bold">system's behavior</span>. 
                Our AI scanner thinks like a defender to find hidden risks in complex code and cloud settings.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 pt-4">
                <div className="p-5 bg-cobalt-surface/40 border border-cobalt-border rounded-2xl">
                  <h5 className="text-white font-black text-[9px] uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Activity size={12} className="text-cobalt-accent" /> Live Sync
                  </h5>
                  <p className="text-[10px] text-cobalt-muted leading-relaxed uppercase tracking-tighter">Non-stop monitoring across your entire network.</p>
                </div>
                <div className="p-5 bg-cobalt-surface/40 border border-cobalt-border rounded-2xl">
                  <h5 className="text-white font-black text-[9px] uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Layers size={12} className="text-cobalt-accent" /> Full Coverage
                  </h5>
                  <p className="text-[10px] text-cobalt-muted leading-relaxed uppercase tracking-tighter">From first line of code to the final live server.</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative order-first lg:order-last"
            >
              <div className="aspect-square bg-cobalt-bg border border-cobalt-border rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col justify-between h-full font-mono text-[9px] md:text-[10px] text-cobalt-muted uppercase">
                  <div className="space-y-2">
                    <p className="text-cobalt-accent font-bold">&gt; STARTING_SCAN...</p>
                    <p>&gt; RISK_LEVEL: HIGH</p>
                    <p className="text-red-400 animate-pulse">&gt; WARNING: EXPOSED_KEY_DETECTED</p>
                    <p>&gt; FIXING_AUTOMATICALLY...</p>
                  </div>
                  <div className="p-4 md:p-6 bg-cobalt-bg/80 border border-cobalt-border rounded-xl md:rounded-2xl flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                        <ShieldAlert size={16} />
                      </div>
                      <div>
                        <p className="text-white font-bold tracking-tight text-[10px] md:text-sm">Issue Resolved</p>
                        <p className="text-[7px] md:text-[8px] uppercase tracking-[0.3em] font-black opacity-60">Status: Safe</p>
                      </div>
                    </div>
                    <Server size={20} className="text-cobalt-accent opacity-20 hidden sm:block" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="scanner" className="py-20 md:py-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
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
      <footer className="bg-cobalt-bg border-t border-cobalt-border pt-20 md:pt-32 pb-10 md:pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 md:gap-16 mb-20 md:mb-32">
            
            <div className="col-span-2 space-y-6 md:space-y-8">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-cobalt-accent rounded-lg">
                  <ShieldCheck size={20} className="text-cobalt-bg" strokeWidth={3} />
                </div>
                <span className="text-lg md:text-xl font-heading font-black tracking-tighter uppercase italic">AuditShield</span>
              </div>
              <p className="text-[11px] md:text-sm text-cobalt-muted leading-relaxed max-w-sm font-medium">
                The global standard for automated digital defense. Protecting your most valuable work through intelligent security.
              </p>
              <div className="flex gap-6 text-cobalt-muted">
                <Globe size={18} className="hover:text-white cursor-pointer" />
                <Terminal size={18} className="hover:text-white cursor-pointer" />
                <Server size={18} className="hover:text-white cursor-pointer" />
              </div>
            </div>

            <div className="space-y-6 md:space-y-8">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white">Product</h4>
              <ul className="space-y-4">
                {['Security Engine', 'AI Scanner', 'API Protection'].map((item) => (
                  <li key={item} className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-cobalt-muted">{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-6 md:space-y-8">
              <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white">Trust</h4>
              <ul className="space-y-4">
                {['Security Audits', 'Compliance', 'Privacy Shield'].map((item) => (
                  <li key={item} className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-cobalt-muted">{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-cobalt-border flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 md:gap-10">
              <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></div>
                Protected
              </div>
              <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted">
                v2.4.0 Stable
              </div>
            </div>
            <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-cobalt-muted flex items-center gap-2">
              <Fingerprint size={12} className="text-cobalt-accent" /> © 2026 AUDITSHIELD
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing