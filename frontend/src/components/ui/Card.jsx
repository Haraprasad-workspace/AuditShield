import React from 'react'
import { cn } from "../../lib/utils.js"; // Adjust path as needed or keep your template logic

const Card = ({ children, className = '' }) => {
  return (
    <div className={cn(
      // --- BASE STYLING ---
      "bg-cobalt-surface/80 border border-cobalt-border shadow-2xl backdrop-blur-md transition-all duration-300",
      
      // --- RESPONSIVE ROUNDING & PADDING ---
      // Rounded-2xl on mobile, rounded-[2rem] on desktop for a premium feel
      "rounded-2xl md:rounded-[2.5rem]",
      
      // p-4 on small screens (saves space), p-8 on desktop (looks professional)
      "p-5 md:p-8",
      
      className
    )}>
      {children}
    </div>
  )
}

export default Card