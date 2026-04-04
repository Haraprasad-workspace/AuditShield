import React from 'react'

const ScoreGauge = ({ score = 85 }) => {
  // Normalize score to number
  const numericScore = parseFloat(score);
  
  return (
    <div className="flex flex-col items-center justify-center p-2 w-full">
      {/* - Changed fixed w-32 to responsive w-32 md:w-40
          - Added aspect-square to maintain circle shape 
      */}
      <div className="relative w-32 md:w-40 aspect-square flex items-center justify-center">
        
        {/* SVG ViewBox ensures scaling doesn't break coordinates */}
        <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
          {/* Background Circle */}
          <circle 
            cx="64" 
            cy="64" 
            r="58" 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="8" 
            className="text-white/5" 
          />
          {/* Animated Progress Circle */}
          <circle 
            cx="64" 
            cy="64" 
            r="58" 
            fill="transparent" 
            stroke="currentColor" 
            strokeWidth="10" 
            strokeDasharray="364.4" 
            strokeDashoffset={364.4 - (364.4 * numericScore) / 100}
            strokeLinecap="round"
            // Color shifts based on risk level
            className={`transition-all duration-1000 ${
              numericScore > 80 ? 'text-risk-low' : 
              numericScore > 50 ? 'text-cobalt-accent' : 
              'text-risk-high'
            }`} 
          />
        </svg>

        {/* HUD Text - Responsive font sizes */}
        <div className="absolute flex flex-col items-center">
          <span className="text-3xl md:text-5xl font-heading font-black text-white italic tracking-tighter">
            {numericScore}
          </span>
          <span className="text-[8px] md:text-[10px] uppercase text-cobalt-muted font-black tracking-widest mt-[-4px]">
            Security_Idx
          </span>
        </div>
      </div>
      
      {/* Footer Status for Mobile Context */}
      <div className="mt-4 md:hidden">
         <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Perimeter_Scan_Complete</span>
      </div>
    </div>
  )
}

export default ScoreGauge