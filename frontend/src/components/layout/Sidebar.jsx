import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Shield, 
  LayoutDashboard, 
  AlertCircle, 
  Link2, 
  FileText, 
  Settings,
  LogOut 
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation();

  // Navigation configuration
  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      path: '/dashboard' 
    },
    { 
      icon: <AlertCircle size={20} />, 
      label: 'Risk Feed', 
      path: '/alerts' // You can map this to a specific alerts page or part of dashboard
    },
    { 
      icon: <Link2 size={20} />, 
      label: 'Inventory', 
      path: '/inventory' 
    },
    { 
      icon: <FileText size={20} />, 
      label: 'Audit Reports', 
      path: '/reports' 
    },
  ]

  return (
    <aside className="w-64 h-screen bg-cobalt-bg border-r border-cobalt-border flex flex-col fixed left-0 top-0 z-20">
      {/* Logo Section */}
      <Link to="/dashboard" className="p-8 flex items-center gap-3 group">
        <Shield 
          className="text-cobalt-accent group-hover:scale-110 transition-transform" 
          size={32} 
          strokeWidth={2.5} 
        />
        <span className="font-heading font-bold text-xl tracking-tighter uppercase text-white">
          AuditShield
        </span>
      </Link>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group ${
                isActive 
                  ? 'bg-cobalt-accent/10 text-cobalt-accent shadow-[inset_0_0_10px_rgba(56,189,248,0.05)]' 
                  : 'text-cobalt-muted hover:bg-cobalt-surface hover:text-white'
              }`}
            >
              <span className={`${isActive ? 'text-cobalt-accent' : 'group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cobalt-accent shadow-[0_0_8px_#38BDF8]"></div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-cobalt-border bg-cobalt-bg/50">
        <Link 
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 text-cobalt-muted hover:text-white hover:bg-cobalt-surface rounded-lg transition-colors mb-2"
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        
        <Link 
          to="/auth" 
          className="flex items-center gap-3 px-4 py-3 text-risk-high/70 hover:text-risk-high hover:bg-risk-high/10 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Sign Out</span>
        </Link>
      </div>
    </aside>
  )
}

export default Sidebar