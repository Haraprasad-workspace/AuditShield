import React from 'react'
import { motion } from 'framer-motion' 
import { UserCircle } from 'lucide-react'

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 border-b border-cobalt-border bg-cobalt-bg/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-10 sticky top-0 z-40 w-full"
    >
      {/* LEFT EMPTY (search removed) */}
      <div></div>

      {/* RIGHT: USER ACTIONS */}
      <div className="flex items-center gap-3 md:gap-8 text-cobalt-muted ml-auto">
        
        {/* Status Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-risk-low/5 rounded-full border border-risk-low/10">
          <div className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-risk-low">System_Live</span>
        </div>

        <div className="h-6 w-[1px] bg-cobalt-border hidden sm:block"></div>

        {/* Profile Section */}
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 md:gap-3 hover:text-white cursor-pointer group"
        >
          <div className="hidden xs:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-white leading-none">
              Haraprasad
            </span>
            <span className="text-[8px] font-bold uppercase tracking-tighter text-cobalt-muted group-hover:text-cobalt-accent transition-colors">
              Security Lead
            </span>
          </div>
          <div className="p-0.5 rounded-xl border border-transparent group-hover:border-cobalt-accent transition-all">
            <UserCircle size={28} strokeWidth={1.5} className="text-cobalt-accent/80 group-hover:text-cobalt-accent" />
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default Navbar