import React from 'react'
import { Search, Bell, UserCircle } from 'lucide-react'

const Navbar = () => {
  return (
    <div className="h-16 border-b border-cobalt-border bg-cobalt-bg/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 ml-64">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cobalt-muted" size={18} />
        <input 
          type="text" 
          placeholder="Search audits..." 
          className="w-full bg-cobalt-surface border border-cobalt-border rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:border-cobalt-accent"
        />
      </div>

      <div className="flex items-center gap-5 text-cobalt-muted">
        <Bell size={20} className="hover:text-white cursor-pointer" />
        <div className="h-8 w-[1px] bg-cobalt-border"></div>
        <div className="flex items-center gap-2 hover:text-white cursor-pointer">
          <UserCircle size={24} />
          <span className="text-sm font-medium text-white">Haraprasad</span>
        </div>
      </div>
    </div>
  )
}

export default Navbar