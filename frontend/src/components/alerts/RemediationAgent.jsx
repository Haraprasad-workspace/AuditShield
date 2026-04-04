import React, { useState } from 'react'
import { Sparkles, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

const RemediationAgent = ({ riskTitle = "AWS Secret Leak" }) => {
  const [status, setStatus] = useState('idle') // idle, fixing, done

  const handleFix = () => {
    setStatus('fixing')
    // Simulate AI Agent performing remediation
    setTimeout(() => setStatus('done'), 2000)
  }

  return (
    <Card className="border-cobalt-accent/30 bg-gradient-to-br from-cobalt-surface to-cobalt-bg overflow-hidden relative p-5 md:p-6">
      {/* Decorative Glow - Scaled for mobile */}
      <div className="absolute -top-10 -right-10 w-24 md:w-32 h-24 md:h-32 bg-cobalt-accent/10 blur-2xl md:blur-3xl rounded-full pointer-events-none"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cobalt-accent/20 rounded-lg text-cobalt-accent shrink-0">
          <Sparkles size={18} className="md:w-5 md:h-5" />
        </div>
        <h3 className="font-heading font-black text-white uppercase tracking-[0.15em] text-[10px] md:text-xs">
          Neural_Shield_Agent
        </h3>
      </div>

      <div className="space-y-5">
        <p className="text-xs md:text-sm text-cobalt-muted leading-relaxed font-medium">
          Automated analysis of <span className="text-white font-bold italic">{riskTitle}</span> complete. 
          I am authorized to rotate this vector and update linked security nodes to restore perimeter integrity.
        </p>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Button 
                onClick={handleFix} 
                className="w-full py-3.5 md:py-3 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group"
              >
                Execute Remediation 
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          )}

          {status === 'fixing' && (
            <motion.div 
              key="fixing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-3 py-2 text-cobalt-accent"
            >
              <Loader2 className="animate-spin" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                Rotating_Security_Keys...
              </span>
            </motion.div>
          )}

          {status === 'done' && (
            <motion.div 
              key="done"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center gap-3 py-3 px-4 bg-risk-low/10 border border-risk-low/30 rounded-xl text-risk-low"
            >
              <ShieldCheck size={18} />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">
                Compliance_Restored
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

export default RemediationAgent