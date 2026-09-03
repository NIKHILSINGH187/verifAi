
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function CaseVolumeChart() {
  const chartData = [
    { date: 'Sep 1', cases: 42 },
    { date: 'Sep 2', cases: 58 },
    { date: 'Sep 3', cases: 51 },
    { date: 'Sep 4', cases: 67 },
    { date: 'Sep 5', cases: 72 },
    { date: 'Sep 6', cases: 61 },
    { date: 'Sep 7', cases: 85 },
  ]

  return (
    <div className="surface-raised card-padding flex flex-col">
      <h3 className="text-section-title mb-4">Cases Over Time (7 Days)</h3>

      <div className="flex-1 flex items-center justify-center">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <YAxis stroke="hsl(var(--muted-foreground))" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value) => [`${value} cases`, 'Volume']}
            />
            <Line
              type="monotone"
              dataKey="cases"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
