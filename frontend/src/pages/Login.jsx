import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, ArrowRight, Lock } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Login = () => {
  return (
    <div className="min-h-screen bg-cobalt-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cobalt-accent/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-risk-high/5 blur-[100px] rounded-full"></div>

      <div className="max-w-md w-full z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-2xl mb-4 shadow-[0_0_20px_rgba(56,189,248,0.1)]">
            <Shield className="text-cobalt-accent" size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tighter">
            Welcome Back
          </h1>
          <p className="text-cobalt-muted mt-2 text-center">
            Secure access to your compliance dashboard
          </p>
        </div>

        <div className="bg-cobalt-surface border border-cobalt-border rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Enterprise Email"
              type="email"
              placeholder="name@company.com"
              required
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs uppercase tracking-widest text-cobalt-muted font-bold">
                  Password
                </label>
                <Link
                  to="#"
                  className="text-[10px] uppercase font-bold text-cobalt-accent hover:underline"
                >
                  Forgot?
                </Link>
              </div>

              <Input type="password" placeholder="••••••••" required />
            </div>

            <Button className="w-full py-4 font-bold uppercase tracking-widest text-sm mt-2">
              Authorize Session <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-cobalt-border"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]">
              <span className="bg-cobalt-surface px-4 text-cobalt-muted">
                External SSO
              </span>
            </div>
          </div>

          {/* 🚫 GitHub button removed */}

          <p className="text-center mt-8 text-sm text-cobalt-muted">
            New to the platform?{' '}
            <Link
              to="/register"
              className="text-cobalt-accent font-bold hover:underline"
            >
              Request Access
            </Link>
          </p>
        </div>

        <div className="mt-8 flex justify-center items-center gap-2 text-[10px] text-cobalt-muted uppercase font-bold tracking-widest">
          <Lock size={12} /> AES-256 Encrypted Connection
        </div>
      </div>
    </div>
  )
}

export default Login