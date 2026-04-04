import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'


// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Logs from './pages/logs'
import DocumentAudit from './pages/DocumentAudit' // ✅ Added this import
import DriveCallback from "./pages/DriveCallback";
import DriveAudit from "./pages/DriveAudit";
import HowToUse from './pages/HowToUse';
import Terminal from './pages/Terminal'

// 🔐 Authentication Guard
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('auditshield_token');
  if (!token) return <Navigate to="/auth" replace />;
  return children;
};

// 🚫 Inverse Auth Guard
// If user has a token, don't let them see Login/Register (redirect to dashboard)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('auditshield_token');
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-cobalt-bg text-white selection:bg-cobalt-accent/30">
      {children}
    </div>
  );
}

function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          <Route path="/drive-callback" element={<DriveCallback />} />
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Landing />} />
          
          {/* Prevent logged-in users from seeing Auth pages */}
          <Route path="/auth" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />  
          
          {/* --- PROTECTED ROUTES --- */}
          <Route 
            path="/drive-audit" 
            element={<ProtectedRoute><DriveAudit /></ProtectedRoute>} 
          />
          <Route 
            path="/HowToUse" 
            element={<ProtectedRoute><HowToUse /></ProtectedRoute>} 
          />
          <Route 
            path="/Terminal" 
            element={<ProtectedRoute><Terminal /></ProtectedRoute>} 
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/inventory" 
            element={<ProtectedRoute><Inventory /></ProtectedRoute>} 
          />
          
          {/* ✅ NEW: Document Audit Route added to the perimeter */}
          <Route 
            path="/document-audit" 
            element={<ProtectedRoute><DocumentAudit /></ProtectedRoute>} 
          />

          <Route 
            path="/reports" 
            element={<ProtectedRoute><Reports /></ProtectedRoute>} 
          />
          <Route 
            path="/logs" 
            element={<ProtectedRoute><Logs /></ProtectedRoute>} 
          />
          
          {/* --- 404 SYSTEM ERROR --- */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
              <div className="p-6 bg-risk-high/10 border border-risk-high/20 rounded-3xl mb-8 shadow-[0_0_50px_rgba(255,75,92,0.1)]">
                <h1 className="text-8xl font-heading font-black text-risk-high tracking-tighter">404</h1>
              </div>
              <h2 className="text-xl font-heading font-bold uppercase tracking-widest text-white italic">Sector Not Found</h2>
              <p className="text-cobalt-muted mt-2 max-w-xs uppercase text-[10px] font-black tracking-[0.2em] leading-relaxed">
                The requested resource does not exist or has been relocated outside the current sector.
              </p>
              <button 
                onClick={() => window.history.back()}
                className="mt-10 px-8 py-3 bg-cobalt-surface border border-cobalt-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-cobalt-accent transition-all shadow-lg"
              >
                Return to Safe Zone
              </button>
            </div>
          } />
        </Routes>
      </PageLayout>
    </Router>
  )
}

export default App