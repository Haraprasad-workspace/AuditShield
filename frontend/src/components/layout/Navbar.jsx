import React from 'react'
import { motion } from 'framer-motion' 
import { Search, Bell, UserCircle } from 'lucide-react'

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      // Adjusted px-4 for mobile and px-10 for desktop
      className="h-20 border-b border-cobalt-border bg-cobalt-bg/60 backdrop-blur-xl flex items-center justify-between px-4 md:px-10 sticky top-0 z-40 w-full"
    >
      {/* --- LEFT: SEARCH AREA (Hidden on Mobile) --- */}
      <div className="relative w-72 lg:w-96 hidden md:block group">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-cobalt-muted group-focus-within:text-cobalt-accent transition-colors" 
          size={16} 
        />
        <input 
          type="text" 
          placeholder="Quick Find..." 
          className="w-full bg-cobalt-surface/40 border border-cobalt-border rounded-2xl py-2.5 pl-12 pr-4 text-xs font-bold tracking-wide focus:outline-none focus:border-cobalt-accent/50 focus:bg-cobalt-surface transition-all placeholder:text-cobalt-muted/50 uppercase"
        />
      </div>

      {/* --- MOBILE SEARCH ICON (Visible only on mobile) --- */}
      <div className="md:hidden ml-12"> {/* ml-12 provides space for the hamburger menu */}
        <Search size={20} className="text-cobalt-muted" />
      </div>

      {/* --- RIGHT: USER ACTIONS --- */}
      <div className="flex items-center gap-3 md:gap-8 text-cobalt-muted ml-auto">
        
        {/* Status Indicator (Hidden on small mobile) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-risk-low/5 rounded-full border border-risk-low/10">
          <div className="w-1.5 h-1.5 rounded-full bg-risk-low animate-pulse"></div>
          <span className="text-[9px] font-black uppercase tracking-widest text-risk-low">System_Live</span>
        </div>

        {/* Notifications */}
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 cursor-pointer hover:text-white transition-colors"
        >
          <Bell size={20} strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cobalt-accent rounded-full border-2 border-cobalt-bg shadow-[0_0_10px_#38BDF8]"></span>
        </motion.div>

        <div className="h-6 w-[1px] bg-cobalt-border hidden sm:block"></div>

        {/* Profile Section */}
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-2 md:gap-3 hover:text-white cursor-pointer group"
        >
          {/* Labels hidden on small screens to save space */}
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