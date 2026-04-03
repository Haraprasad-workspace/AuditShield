import React from 'react'
import { Shield, Github, Mail } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Auth = () => {
  return (
    <div className="min-h-screen bg-cobalt-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="flex flex-col items-center mb-8">
          <Shield className="text-cobalt-accent mb-4" size={48} />
          <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-tighter">AuditShield</h1>
          <p className="text-cobalt-muted mt-2">Continuous Compliance & Risk Monitoring</p>
        </div>

        <div className="bg-cobalt-surface border border-cobalt-border rounded-2xl p-8 shadow-2xl">
          <div className="space-y-4">
            <Input label="Email Address" placeholder="name@company.com" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Button className="w-full py-3 mt-2">Login to Dashboard</Button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cobalt-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-cobalt-surface px-2 text-cobalt-muted">Or continue with</span></div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Button variant="outline" className="w-full">
              <Github size={18} className="mr-2" /> GitHub SSO
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth