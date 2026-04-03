import React, { useState } from 'react'
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const RemediationAgent = ({ riskTitle = "AWS Secret Leak" }) => {
  const [status, setStatus] = useState('idle') // idle, fixing, done

  const handleFix = () => {
    setStatus('fixing')
    // Simulate AI Agent performing remediation
    setTimeout(() => setStatus('done'), 2000)
  }

  return (
    <Card className="border-cobalt-accent/30 bg-gradient-to-br from-cobalt-surface to-cobalt-bg overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cobalt-accent/10 blur-3xl rounded-full"></div>
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cobalt-accent/20 rounded-lg text-cobalt-accent">
          <Sparkles size={20} />
        </div>
        <h3 className="font-heading font-bold text-white uppercase tracking-wider text-sm">
          AuditShield Agent
        </h3>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-cobalt-muted leading-relaxed">
          I've analyzed the <span className="text-white font-medium">{riskTitle}</span>. 
          I can automatically rotate this key in AWS and update your GitHub secrets to restore compliance.
        </p>

        {status === 'idle' && (
          <Button onClick={handleFix} className="w-full py-3">
            Execute Remediation <ArrowRight size={16} className="ml-2" />
          </Button>
        )}

        {status === 'fixing' && (
          <div className="flex items-center justify-center gap-3 py-3 text-cobalt-accent">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-cobalt-accent border-t-transparent"></div>
            <span className="text-sm font-medium animate-pulse">Agent is rotating keys...</span>
          </div>
        )}

        {status === 'done' && (
          <div className="flex items-center gap-3 py-3 px-4 bg-risk-low/10 border border-risk-low/30 rounded-lg text-risk-low">
            <ShieldCheck size={20} />
            <span className="text-sm font-bold uppercase tracking-tight">Security Restored</span>
          </div>
        )}
      </div>
    </Card>
  )
}

export default RemediationAgent