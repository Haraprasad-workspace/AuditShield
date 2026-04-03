import React from 'react'

const ScoreGauge = ({ score = 85 }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Simple SVG circle for the gauge */}
        <svg className="w-full h-full -rotate-90">
          <circle cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-cobalt-border" />
          <circle 
            cx="64" cy="64" r="58" fill="transparent" stroke="currentColor" strokeWidth="8" 
            strokeDasharray="364.4" 
            strokeDashoffset={364.4 - (364.4 * score) / 100}
            strokeLinecap="round"
            className="text-cobalt-accent transition-all duration-1000" 
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-heading font-bold text-white">{score}</span>
          <span className="text-[10px] uppercase text-cobalt-muted font-bold">Ready</span>
        </div>
      </div>
    </div>
  )
}

export default ScoreGauge