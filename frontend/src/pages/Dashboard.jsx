import React from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import ScoreGauge from '../components/dashboard/ScoreGauge'
import RiskTrendChart from '../components/dashboard/RiskTrendChart'
import AlertCard from '../components/alerts/AlertCard'
import RemediationAgent from '../components/alerts/RemediationAgent'

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8 space-y-8">
          {/* Top Row: Stats & Agent */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-cobalt-surface border border-cobalt-border p-6 rounded-2xl flex items-center justify-between">
              <div>
                <h3 className="text-cobalt-muted uppercase text-xs font-bold tracking-widest mb-1">Audit Readiness</h3>
                <h2 className="text-3xl font-heading font-bold text-white">94% SECURE</h2>
                <p className="text-sm text-cobalt-muted mt-2">Your system is currently meeting all SOC2 requirements.</p>
              </div>
              <ScoreGauge score={94} />
            </div>
            <RemediationAgent />
          </div>

          {/* Middle Row: Trend Chart */}
          <div className="bg-cobalt-surface border border-cobalt-border p-6 rounded-2xl">
            <h3 className="font-heading font-bold text-white uppercase text-sm mb-4">Risk Detection Trend (7 Days)</h3>
            <RiskTrendChart />
          </div>

          {/* Bottom Row: Recent Feed */}
          <div className="space-y-4">
            <h3 className="font-heading font-bold text-white uppercase text-sm">Critical Security Feed</h3>
            <AlertCard severity="High" title="Exposed Google Drive File" description="'Financial_Report_2026.pdf' is set to Public access." time="12m ago" />
            <AlertCard severity="Medium" title="New Admin Added" description="User 'temp_dev' was added to GitHub Org admins." time="2h ago" />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard