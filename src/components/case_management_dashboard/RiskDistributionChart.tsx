
import React from 'react'
import type { RiskDistributionData } from '@/data/RiskDistributionData'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import SafeIcon from '@/components/common/SafeIcon'

interface RiskDistributionChartProps {
  data: RiskDistributionData[]
}

export default function RiskDistributionChart({ data }: RiskDistributionChartProps) {
  const chartData = data.map((item) => ({
    name: item.label,
    value: item.count,
    percentage: item.percentage,
  }))

  const colors = {
    Clear: 'hsl(var(--success))',
    Review: 'hsl(var(--warning))',
    'High Risk': 'hsl(var(--destructive))',
  }

  const handleAnalyticsClick = () => {
    window.location.href = './analytics-reporting.html'
  }

  return (
    <div className="surface-raised card-padding flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-section-title">Risk Distribution</h3>
        <button
          onClick={handleAnalyticsClick}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title="View detailed analytics"
        >
          <SafeIcon name="TrendingUp" size={18} />
        </button>
      </div>

      {chartData.length > 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[entry.name as keyof typeof colors]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} cases`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-60 flex items-center justify-center text-muted-foreground">
          <span className="text-sm">No data available</span>
        </div>
      )}

      <div className="mt-4 space-y-2 border-t border-border pt-4">
        {chartData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: colors[item.name as keyof typeof colors] }}
              />
              <span className="text-caption">{item.name}</span>
            </div>
            <span className="font-semibold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
