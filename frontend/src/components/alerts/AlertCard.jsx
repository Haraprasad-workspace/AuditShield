import React from 'react'
import { AlertTriangle, ExternalLink } from 'lucide-react'
import Card from '../ui/Card'
import Button from '../ui/Button'

const AlertCard = ({ title, description, severity, time }) => {
  const severityColors = {
    High: 'border-l-risk-high',
    Medium: 'border-l-risk-med',
    Low: 'border-l-risk-low'
  }

  return (
    <Card className={`border-l-4 ${severityColors[severity]} hover:translate-x-1 transition-transform`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className={`p-2 rounded-lg bg-opacity-10 ${severity === 'High' ? 'bg-risk-high text-risk-high' : 'bg-risk-med text-risk-med'}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white">{title}</h4>
            <p className="text-sm text-cobalt-muted mt-1">{description}</p>
            <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-2 block">{time}</span>
          </div>
        </div>
        <Button variant="outline" className="py-1 px-3 text-xs">
          Investigate <ExternalLink size={12} className="ml-1" />
        </Button>
      </div>
    </Card>
  )
}

export default AlertCard