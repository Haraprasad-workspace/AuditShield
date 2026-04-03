import React from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Mock data for development
const data = [
  { day: 'Mon', risks: 12 },
  { day: 'Tue', risks: 18 },
  { day: 'Wed', risks: 15 },
  { day: 'Thu', risks: 8 },
  { day: 'Fri', risks: 5 },
  { day: 'Sat', risks: 2 },
  { day: 'Sun', risks: 3 },
]

const RiskTrendChart = () => {
  return (
    <div className="h-[300px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRisks" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#30363D" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            hide 
            domain={[0, 'auto']} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px' }}
            itemStyle={{ color: '#38BDF8' }}
          />
          <Area 
            type="monotone" 
            dataKey="risks" 
            stroke="#38BDF8" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRisks)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RiskTrendChart