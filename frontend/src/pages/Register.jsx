import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldPlus, User, Globe, CheckCircle2 } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

const Register = () => {
  return (
    <div className="min-h-screen bg-cobalt-bg flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Grid effect */}
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
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
            <Input label="Full Name" placeholder="Haraprasad Mahapatra" icon={<User />} />
            <Input label="Work Email" placeholder="name@company.com" />
            <Input label="Organization" placeholder="CodeX Labs" icon={<Globe />} />
            <Input label="Industry" placeholder="FinTech / SaaS" />
            <div className="md:col-span-2">
              <Input label="Create Secure Password" type="password" placeholder="••••••••" />
            </div>

            <div className="md:col-span-2 flex items-start gap-3 p-4 bg-cobalt-bg rounded-xl border border-cobalt-border">
              <CheckCircle2 className="text-cobalt-accent mt-0.5" size={18} />
              <p className="text-xs text-cobalt-muted leading-relaxed">
                By creating an account, you agree to our <span className="text-white underline cursor-pointer">Data Privacy Policy</span> and authorize AuditShield to perform security scans on connected integrations.
              </p>
            </div>

            <Button className="md:col-span-2 py-4 font-bold uppercase tracking-widest text-sm">
              Create AuditShield Account
            </Button>
          </form>

          <p className="text-center mt-8 text-sm text-cobalt-muted">
            Already registered?{' '}
            <Link to="/auth" className="text-cobalt-accent font-bold hover:underline">Access Dashboard</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register