import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'

// Layout Components
import Sidebar from './components/layout/Sidebar'
import Navbar from './components/layout/Navbar'

// Pages
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Logs from './pages/Logs'

// A wrapper to handle the layout for protected pages
const PageLayout = ({ children }) => {
  const location = useLocation()
  
  // Hide Sidebar/Navbar if we are on the Auth pages (Login or Register)
  const isAuthPage = location.pathname === '/auth' || location.pathname === '/register'

  if (isAuthPage) {
    return <div className="min-h-screen bg-cobalt-bg">{children}</div>
  }

  return (
    <div className="min-h-screen bg-cobalt-bg text-white flex">
      {/* Fixed Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        <Navbar />
        <main className="p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <PageLayout>
        <Routes>
          {/* Default Route redirects to Dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Auth Routes */}
          <Route path="/auth" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/logs" element={<Logs />} />
          
          {/* 404 Catch-all */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center h-[80vh] text-center">
              <h1 className="text-6xl font-heading font-bold text-cobalt-accent mb-4">404</h1>
              <p className="text-cobalt-muted uppercase tracking-widest font-bold">Perimeter Breach: Page Not Found</p>
            </div>
          } />
        </Routes>
      </PageLayout>
    </Router>
  )
}

export default App