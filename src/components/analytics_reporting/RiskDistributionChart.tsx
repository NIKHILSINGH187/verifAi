
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { RiskDistributionData } from '@/data/RiskDistributionData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RiskDistributionChartProps {
  title: string;
  description: string;
  data: RiskDistributionData[];
}

const COLORS = {
  CLEAR: 'hsl(var(--success))',
  REVIEW: 'hsl(var(--warning))',
  'HIGH RISK': 'hsl(var(--destructive))',
};

export default function RiskDistributionChart({
  title,
  description,
  data,
}: RiskDistributionChartProps) {
  const safeData = Array.isArray(data) ? data : (data ? [data as unknown as RiskDistributionData] : []);
  const chartData = safeData.map((item) => ({
    name: item.label,
    value: item.count,
    percentage: item.percentage,
    bucket: item.bucket,
  }));

  return (
    <Card className="surface-raised">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[entry.bucket as keyof typeof COLORS] || 'hsl(var(--muted))'}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value) => `${value} cases`}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
