"use client";

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Shield, ArrowRight, Lock, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { login } from '../api/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#0B1221', 
    color: '#FFFFFF',
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await login({ email, password })
      
      localStorage.setItem('auditshield_token', data.session.access_token)
      localStorage.setItem('auditshield_user', JSON.stringify(data.user))
      
      if (data.user?.id) {
        localStorage.setItem('auditshield_user_id', data.user.id)
      }
      
      await Toast.fire({
        icon: 'success',
        title: 'Authorization Granted',
        text: 'Syncing with perimeter guard...',
        background: '#0B1221',
        iconColor: '#10B981'
      })

      navigate('/dashboard')
    } catch (err) {
      Swal.fire({
        title: 'Access Denied',
        text: err.message || "Invalid credentials or server timeout.",
        icon: 'error',
        background: '#0B1221',
        color: '#FFFFFF',
        confirmButtonColor: '#38BDF8',
        iconColor: '#FF4B5C',
        customClass: {
          popup: 'border border-cobalt-border rounded-2xl shadow-2xl w-[90%] md:w-auto',
          title: 'text-lg md:text-xl font-heading font-bold uppercase tracking-tight',
          confirmButton: 'px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold uppercase tracking-widest text-[10px] md:text-xs'
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cobalt-bg flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Decorative Background Elements - Hidden or simplified on mobile */}
      <div className="absolute top-[-5%] left-[-5%] w-[60%] md:w-[40%] h-[40%] bg-cobalt-accent/5 blur-[80px] md:blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[50%] md:w-[30%] h-[30%] bg-risk-high/5 blur-[70px] md:blur-[100px] rounded-full"></div>

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-6 md:mb-10">
          <div className="p-3 md:p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl mb-4 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <Shield className="text-cobalt-accent w-8 h-8 md:w-10 md:h-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white uppercase tracking-tighter text-center">
            Welcome Back
          </h1>
          <p className="text-cobalt-muted mt-2 text-center text-xs md:text-sm px-4">
            Secure access to your compliance dashboard
          </p>
        </div>

        <div className="bg-cobalt-surface/80 border border-cobalt-border rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          <form className="space-y-4 md:space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1">
              <Input
                label="Enterprise Email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[9px] md:text-[10px] uppercase tracking-widest text-cobalt-muted font-bold">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-[9px] md:text-[10px] uppercase font-bold text-cobalt-accent hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 md:py-4 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-4 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Authenticating...
                </>
              ) : (
                <>
                  Authorize Session <ArrowRight size={16} />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6 md:my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cobalt-border/50"></div>
            </div>
            <div className="relative flex justify-center text-[8px] md:text-[9px] uppercase font-bold tracking-[0.2em]">
              <span className="bg-cobalt-surface px-4 text-cobalt-muted">
                AuditShield Secure
              </span>
            </div>
          </div>

          <p className="text-center mt-2 text-[11px] md:text-xs text-cobalt-muted">
            New to the platform?{' '}
            <Link
              to="/register"
              className="text-cobalt-accent font-bold hover:underline"
            >
              Request Access
            </Link>
          </p>
        </div>

        <div className="mt-6 md:mt-8 flex justify-center items-center gap-2 text-[8px] md:text-[9px] text-cobalt-muted uppercase font-bold tracking-widest">
          <Lock size={10} /> AES-256 Encrypted Connection
        </div>
      </div>
    </div>
  )
}

export default Login;