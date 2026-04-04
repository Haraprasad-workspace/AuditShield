"use client";

import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldPlus, CheckCircle2, Loader2 } from 'lucide-react'
import Swal from 'sweetalert2'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { register } from '../api/auth'

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    industry: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    background: '#0B1221',
    color: '#FFFFFF',
    iconColor: '#10B981',
  })

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await register(formData)
      setIsSuccess(true)

      Toast.fire({
        icon: 'success',
        title: 'Perimeter Profile Created',
        text: 'Verification email dispatched.'
      })
      
      setTimeout(() => {
        navigate('/auth')
      }, 3000)

    } catch (err) {
      Swal.fire({
        title: 'Initialization Failed',
        text: err.message || "Could not establish connection to security node.",
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
      {/* Decorative BG - Hidden on smaller mobile to reduce clutter */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
      <div className="absolute top-[-5%] right-[-5%] w-[60%] md:w-[40%] h-[40%] bg-cobalt-accent/5 blur-[80px] md:blur-[120px] rounded-full"></div>

      <div className="w-full max-w-xl z-10">
        <div className="flex flex-col items-center mb-6 md:mb-8">
          <div className="p-3 md:p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl mb-4 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <ShieldPlus className="text-cobalt-accent w-8 h-8 md:w-10 md:h-10" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white uppercase tracking-tighter text-center italic">
            Establish Trust
          </h1>
          <p className="text-cobalt-muted mt-2 text-center text-xs md:text-sm px-4">
            Join 500+ teams using AuditShield for compliance
          </p>
        </div>

        <div className="bg-cobalt-surface/80 border border-cobalt-border rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-6 md:py-10 text-center animate-in zoom-in-95 duration-500">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-risk-low/20 text-risk-low rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={28} className="md:w-8 md:h-8" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white uppercase tracking-tight">Account Initialized</h3>
              <p className="text-cobalt-muted mt-2 text-xs md:text-sm">Authorization required. Check your inbox to continue.</p>
              <div className="mt-6 flex items-center gap-2 text-[8px] md:text-[10px] text-cobalt-accent uppercase font-black tracking-widest animate-pulse">
                Redirecting to terminal...
              </div>
            </div>
          ) : (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" onSubmit={handleRegister}>
              <Input 
                label="Full Name" 
                placeholder="Audit Specialist" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                required
                disabled={isLoading}
              />
              <Input 
                label="Work Email" 
                type="email"
                placeholder="name@company.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={isLoading}
              />
              <Input 
                label="Organization" 
                placeholder="Enterprise Corp" 
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                required
                disabled={isLoading}
              />
              <Input 
                label="Industry" 
                placeholder="Cybersecurity / Finance" 
                value={formData.industry}
                onChange={(e) => setFormData({...formData, industry: e.target.value})}
                disabled={isLoading}
              />
              
              <div className="md:col-span-2">
                <Input 
                  label="Create Secure Password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="md:col-span-2 flex items-start gap-3 p-3 md:p-4 bg-cobalt-bg/50 rounded-xl border border-white/5">
                <CheckCircle2 className="text-cobalt-accent mt-0.5 shrink-0" size={16} />
                <p className="text-[10px] md:text-[11px] text-cobalt-muted leading-relaxed font-medium italic">
                  By creating an account, you agree to our <span className="text-white underline cursor-pointer hover:text-cobalt-accent transition-colors">Privacy Policy</span>.
                </p>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="md:col-span-2 py-3 md:py-4 font-bold uppercase tracking-widest text-[10px] md:text-xs mt-2 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Processing...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          {!isSuccess && (
            <p className="text-center mt-6 md:mt-8 text-[11px] md:text-xs text-cobalt-muted font-medium">
              Already registered?{' '}
              <Link to="/auth" className="text-cobalt-accent font-bold hover:underline transition-all uppercase tracking-widest">Login</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register;