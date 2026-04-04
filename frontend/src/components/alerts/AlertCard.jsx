import React from 'react'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const AlertCard = ({ title, description, severity, time }) => {
  // Mapping severity to your cobalt theme risk colors
  const severityColors = {
    critical: 'border-l-risk-high',
    high: 'border-l-risk-high',
    warning: 'border-l-risk-med',
    medium: 'border-l-risk-med',
    low: 'border-l-risk-low',
    safe: 'border-l-risk-low'
  }

  // Normalize severity for color logic
  const sev = severity?.toLowerCase() || 'low';

  return (
    <Card className={`border-l-4 ${severityColors[sev] || 'border-l-cobalt-accent'} hover:translate-x-1 transition-transform p-4 md:p-5`}>
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex gap-3 md:gap-4">
          {/* Icon - Scaled for mobile */}
          <div className={`p-2 rounded-lg shrink-0 h-fit ${
            sev === 'critical' || sev === 'high' 
              ? 'bg-risk-high/10 text-risk-high' 
              : 'bg-risk-med/10 text-risk-med'
          }`}>
            <AlertTriangle size={18} className="md:w-5 md:h-5" />
          </div>

          <div className="min-w-0">
            <h4 className="font-bold text-white text-sm md:text-base leading-tight uppercase tracking-tight italic">
              {title}
            </h4>
            <p className="text-xs md:text-sm text-cobalt-muted mt-1.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {description}
            </p>
            
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[9px] md:text-[10px] uppercase font-black tracking-[0.2em] text-gray-500">
                {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className={`text-[8px] md:text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                sev === 'critical' || sev === 'high' ? 'border-risk-high/30 text-risk-high' : 'border-risk-med/30 text-risk-med'
              }`}>
                {sev}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button - Full width on mobile, auto on desktop */}
        <Button 
          variant="outline" 
          className="w-full sm:w-auto py-2 md:py-1 px-4 md:px-3 text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 border-white/10 hover:border-cobalt-accent transition-all"
        >
          Investigate <ExternalLink size={12} className="md:w-3 md:h-3" />
        </Button>
      </div>
    </Card>
  )
}

export default AlertCard