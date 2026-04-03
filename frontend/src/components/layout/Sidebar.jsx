import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Terminal, 
  Link2, 
  FileSearch, // Replaced FileText for a more "audit" feel
  FileBarChart,
  Settings,
  LogOut,
  Fingerprint
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation();

  // Navigation configuration - Updated with Document Audit and Correct Paths
  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: <Terminal size={20} />, 
      label: 'Audit Logs', 
      path: '/logs' 
    },
    { 
      icon: <FileSearch size={20} />, 
      label: 'Document Audit', 
      path: '/document-audit' 
    },
    { 
      icon: <Link2 size={20} />, 
      label: 'Inventory', 
      path: '/inventory' 
    },
    { 
      icon: <FileBarChart size={20} />, 
      label: 'Reports', 
      path: '/reports' 
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem('auditshield_token');
    // window.location.href = '/auth'; // Standard redirect
  }

  return (
    <aside className="w-64 h-screen bg-cobalt-bg border-r border-cobalt-border flex flex-col fixed left-0 top-0 z-20 shadow-2xl">
      {/* Logo Section */}
      <Link to="/dashboard" className="p-8 flex items-center gap-3 group">
        <div className="p-2 bg-cobalt-accent rounded-lg shadow-[0_0_15px_rgba(56,189,248,0.3)] group-hover:shadow-[0_0_20px_rgba(56,189,248,0.5)] transition-all">
          <ShieldCheck 
            className="text-cobalt-bg" 
            size={24} 
            strokeWidth={3} 
          />
        </div>
        <div className="flex flex-col">
          <span className="font-heading font-black text-xl tracking-tighter uppercase text-white leading-none">
            AuditShield
          </span>
          <span className="text-[8px] font-black tracking-[0.3em] text-cobalt-accent uppercase mt-1">
            v2.4 Stable
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 flex flex-col gap-1.5">
        <p className="text-[9px] font-black text-cobalt-muted uppercase tracking-[0.2em] px-4 mb-2 opacity-50">
          Core Perimeter
        </p>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                isActive 
                  ? 'bg-cobalt-accent/10 text-white border border-cobalt-accent/20' 
                  : 'text-cobalt-muted hover:bg-cobalt-surface/50 hover:text-white border border-transparent'
              }`}
            >
              <span className={`${isActive ? 'text-cobalt-accent' : 'group-hover:text-cobalt-accent'} transition-colors`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              
              {isActive && (
                <>
                  <div className="ml-auto w-1 h-4 rounded-full bg-cobalt-accent shadow-[0_0_10px_#38BDF8]"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cobalt-accent/5 to-transparent pointer-events-none"></div>
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-cobalt-border bg-cobalt-surface/10">
        <div className="px-4 py-3 mb-4 rounded-2xl bg-cobalt-bg border border-cobalt-border flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-cobalt-accent/20 flex items-center justify-center text-cobalt-accent">
              <Fingerprint size={16} />
           </div>
           <div className="flex flex-col">
              <span className="text-[9px] font-black text-white uppercase tracking-tighter">H. Mahapatra</span>
              <span className="text-[8px] text-risk-low font-bold uppercase tracking-widest">Level 4 Auth</span>
           </div>
        </div>

        <Link 
          to="/settings"
          className="flex items-center gap-3 px-4 py-2.5 text-cobalt-muted hover:text-white hover:bg-cobalt-surface rounded-xl transition-all text-[10px] font-black uppercase tracking-widest mb-1"
        >
          <Settings size={18} />
          <span>System Settings</span>
        </Link>
        
        <Link 
          to="/auth" 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-risk-high/60 hover:text-risk-high hover:bg-risk-high/10 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
        >
          <LogOut size={18} />
          <span>Terminate Session</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar