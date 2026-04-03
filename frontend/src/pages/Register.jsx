import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldPlus, User, Globe, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { register } from '../api/auth' // Ensure this path is correct

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    organization: '',
    industry: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await register(formData)
      setIsSuccess(true)
      
      // Auto-redirect to login after 2 seconds so they can see the success message
      setTimeout(() => {
        navigate('/auth')
      }, 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cobalt-bg flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-xl w-full z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl mb-4">
            <ShieldPlus className="text-cobalt-accent" size={40} />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tighter text-center">Establish Trust</h1>
          <p className="text-cobalt-muted mt-2 text-center">Join 500+ teams using AuditShield for compliance</p>
        </div>

        <div className="bg-cobalt-surface border border-cobalt-border rounded-2xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-risk-high/10 border border-risk-high/20 rounded-xl text-risk-high text-xs font-bold">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-risk-low/20 text-risk-low rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Account Initialized</h3>
              <p className="text-cobalt-muted mt-2">Verification required. Redirecting to terminal...</p>
            </div>
          ) : (
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleRegister}>
              <Input 
                label="Full Name" 
                placeholder="Haraprasad Mahapatra" 
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
                placeholder="CodeX Labs" 
                value={formData.organization}
                onChange={(e) => setFormData({...formData, organization: e.target.value})}
                required
                disabled={isLoading}
              />
              <Input 
                label="Industry" 
                placeholder="FinTech / SaaS" 
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

              <div className="md:col-span-2 flex items-start gap-3 p-4 bg-cobalt-bg rounded-xl border border-cobalt-border">
                <CheckCircle2 className="text-cobalt-accent mt-0.5 shrink-0" size={18} />
                <p className="text-xs text-cobalt-muted leading-relaxed">
                  By creating an account, you agree to our <span className="text-white underline cursor-pointer">Data Privacy Policy</span> and authorize AuditShield to perform security scans on connected integrations.
                </p>
              </div>

              <Button 
                type="submit"
                disabled={isLoading}
                className="md:col-span-2 py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Processing...
                  </>
                ) : (
                  "Create AuditShield Account"
                )}
              </Button>
            </form>
          )}

          {!isSuccess && (
            <p className="text-center mt-8 text-sm text-cobalt-muted">
              Already registered?{' '}
              <Link to="/auth" className="text-cobalt-accent font-bold hover:underline">Access Dashboard</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register