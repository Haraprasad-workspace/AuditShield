import React, { useState } from 'react'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Terminal, Search, Filter, Cpu, Database, Globe, HardDrive, ShieldCheck } from 'lucide-react'

const LogEntry = ({ timestamp, source, event, status, type }) => {
  const sourceIcons = {
    github: <Globe size={14} />,   // ✅ replaced
    drive: <HardDrive size={14} />,
    system: <Cpu size={14} />,
    agent: <ShieldCheck size={14} />
  }

  return (
    <div className="grid grid-cols-12 gap-4 py-3 px-4 border-b border-cobalt-border/50 hover:bg-cobalt-accent/5 transition-colors group items-center font-mono text-[11px]">
      <div className="col-span-2 text-cobalt-muted tabular-nums">{timestamp}</div>
      <div className="col-span-2 flex items-center gap-2">
        <span className="p-1 bg-cobalt-surface rounded border border-cobalt-border text-cobalt-accent uppercase text-[9px] font-bold flex items-center gap-1">
          {sourceIcons[source]} {source}
        </span>
      </div>
      <div className="col-span-6 text-white group-hover:text-cobalt-accent transition-colors truncate">
        {event}
      </div>
      <div className="col-span-2 flex justify-end">
        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-tighter ${
          status === 'Success' ? 'border-risk-low text-risk-low bg-risk-low/5' : 
          status === 'Flagged' ? 'border-risk-high text-risk-high bg-risk-high/5' : 
          'border-cobalt-muted text-cobalt-muted'
        }`}>
          {status}
        </span>
      </div>
    </div>
  )
}

const Logs = () => {
  const [filter, setFilter] = useState('All');

  const logs = [
    { timestamp: '2026-04-03 14:02:11', source: 'github', event: 'Analyzed commit 7f8a2c: No secrets detected in /src/api/', status: 'Success' },
    { timestamp: '2026-04-03 13:58:45', source: 'agent', event: 'Grok-1 Classification: High confidence risk identified in Google Drive metadata.', status: 'Flagged' },
    { timestamp: '2026-04-03 13:45:02', source: 'system', event: 'Periodic background scan initiated for connected Drive workspace.', status: 'Pending' },
    { timestamp: '2026-04-03 13:12:30', source: 'drive', event: 'Verified 412 files for public access permissions.', status: 'Success' },
    { timestamp: '2026-04-03 12:55:18', source: 'github', event: 'Webhook received: push event from user @haraprasad-m.', status: 'Success' },
    { timestamp: '2026-04-03 12:40:01', source: 'agent', event: 'Remediation successful: AWS key rotation complete.', status: 'Success' },
  ]

  return (
    <div className="min-h-screen bg-cobalt-bg">
      <Sidebar />
      <div className="ml-64">
        <Navbar />
        <main className="p-8">
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
                <Terminal className="text-cobalt-accent" /> SYSTEM LOGS
              </h2>
              <p className="text-cobalt-muted text-sm mt-1 uppercase tracking-widest font-bold text-[10px]">Real-time Audit Execution Trail</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cobalt-muted" size={14} />
                <input 
                  type="text" 
                  placeholder="Filter logs..." 
                  className="bg-cobalt-surface border border-cobalt-border rounded-lg py-2 pl-9 pr-4 text-xs focus:border-cobalt-accent outline-none"
                />
              </div>
              <Button variant="outline" className="text-xs">
                <Filter size={14} className="mr-2" /> Export CSV
              </Button>
            </div>
          </div>

          <Card className="p-0 border-cobalt-border overflow-hidden">
            <div className="grid grid-cols-12 gap-4 py-4 px-6 bg-cobalt-surface/50 border-b border-cobalt-border text-[10px] uppercase font-bold tracking-[0.15em] text-cobalt-muted">
              <div className="col-span-2">Timestamp</div>
              <div className="col-span-2">Source</div>
              <div className="col-span-6">Operation Details</div>
              <div className="col-span-2 text-right">Status</div>
            </div>

            <div className="max-h-[600px] overflow-y-auto">
              {logs.map((log, index) => (
                <LogEntry key={index} {...log} />
              ))}
            </div>

            <div className="p-4 bg-cobalt-bg/50 border-t border-cobalt-border flex items-center justify-between">
              <div className="flex items-center gap-4 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-risk-low animate-pulse"></span>
                  <span className="text-cobalt-muted uppercase font-bold tracking-tighter">Engine Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database size={12} className="text-cobalt-accent" />
                  <span className="text-cobalt-muted uppercase font-bold tracking-tighter">DB Sync Active</span>
                </div>
              </div>
              <div className="text-[10px] text-cobalt-muted font-mono">
                Showing 1-50 of 12,402 entries
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-6 mt-6">
            <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-xl">
              <p className="text-[10px] uppercase text-cobalt-muted font-bold mb-1">Avg Scan Time</p>
              <h4 className="text-xl font-bold text-white font-mono">412ms</h4>
            </div>
            <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-xl">
              <p className="text-[10px] uppercase text-cobalt-muted font-bold mb-1">Detections Today</p>
              <h4 className="text-xl font-bold text-risk-high font-mono">2</h4>
            </div>
            <div className="p-4 bg-cobalt-surface border border-cobalt-border rounded-xl">
              <p className="text-[10px] uppercase text-cobalt-muted font-bold mb-1">System Health</p>
              <h4 className="text-xl font-bold text-risk-low font-mono">99.9%</h4>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Logs