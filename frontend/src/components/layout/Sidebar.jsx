import React, { useState } from 'react';
import { Menu, X, Shield, LayoutDashboard, FileText, Database, Terminal, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Terminate Session Tokens
    localStorage.removeItem('auditshield_token');
    localStorage.removeItem('auditshield_user');
    localStorage.removeItem('auditshield_user_id');
    localStorage.removeItem('google_drive_token');
    
    // 2. Redirect to Terminal Entry
    navigate('/auth');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Inventory', path: '/inventory', icon: Database },
    { name: 'Audit Logs', path: '/logs', icon: FileText },
    { name: 'Terminal', path: '/terminal', icon: Terminal },
    { name: "Reports", path: "/reports", icon: FileText}
  ];

  return (
    <>
      {/* 📱 MOBILE HAMBURGER BUTTON (Hidden on Desktop) */}
      <div className="md:hidden fixed top-4 left-4 z-[100]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-cobalt-accent text-cobalt-bg rounded-lg shadow-lg"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 🌑 MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🧭 SIDEBAR CORE */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-black/40 backdrop-blur-2xl border-r border-white/5 z-[90]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <Shield className="text-cobalt-accent" size={28} />
            <h1 className="text-xl font-heading font-black tracking-tighter italic uppercase text-white">
              Audit<span className="text-cobalt-accent">Shield</span>
            </h1>
          </div>

          <nav className="space-y-2">
            {/* 🚪 LOGOUT ACTION (Top of List) */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group text-risk-high hover:bg-risk-high/10 border border-transparent hover:border-risk-high/20 mb-6"
            >
              <LogOut size={18} />
              <span className="text-xs font-black uppercase tracking-widest">Logout_Session</span>
            </button>

            <div className="h-px bg-white/5 my-4 mx-2"></div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-xl transition-all group
                    ${isActive 
                      ? 'bg-cobalt-accent/10 text-cobalt-accent border border-cobalt-accent/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <Icon size={18} className={isActive ? 'text-cobalt-accent' : 'group-hover:text-white'} />
                  <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;