import React from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FileDown, CheckCircle } from 'lucide-react'

const Reports = () => {
  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8">
          <h2 className="text-2xl font-heading font-bold text-white mb-8">COMPLIANCE REPORTS</h2>
          
          <Card className="max-w-2xl bg-gradient-to-r from-cobalt-surface to-cobalt-surface/50">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Q1 Security Audit Report</h3>
                <p className="text-cobalt-muted text-sm mb-4">Generated on April 3, 2026. Includes GitHub leaks, file exposures, and remediation history.</p>
                <div className="flex items-center gap-2 text-risk-low text-sm font-bold uppercase mb-6">
                  <CheckCircle size={16} /> Auditor Verified
                </div>
                <Button className="px-8"><FileDown size={18} className="mr-2" /> Download PDF</Button>
              </div>
              <div className="p-4 bg-cobalt-bg rounded-lg border border-cobalt-border">
                <span className="text-xs text-cobalt-muted block mb-1">Status</span>
                <span className="text-white font-bold">READY</span>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default Reports