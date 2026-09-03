
import React from 'react'
import type { AnalyticsSummaryData } from '@/data/AnalyticsSummaryData'
import StatsCard from '@/components/common/StatsCard'

interface StatsOverviewProps {
  data: AnalyticsSummaryData[]
}

export default function StatsOverview({ data }: StatsOverviewProps) {
  const summary = data && data.length > 0 ? data[0] : null

  if (!summary) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Cases Screened" value="—" icon="FileCheck" />
        <StatsCard label="High Risk Flagged" value="—" icon="AlertTriangle" />
        <StatsCard label="Avg Processing Time" value="—" icon="Clock" />
        <StatsCard label="Cases Under Review" value="—" icon="ClipboardList" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        label="Total Cases Screened"
        value={summary.totalCasesScreened}
        icon="FileCheck"
        trend={{ value: 12, direction: 'up' }}
      />
      <StatsCard
        label="High Risk Flagged"
        value={summary.highRiskFlagged}
        icon="AlertTriangle"
        trend={{ value: 8, direction: 'up' }}
      />
      <StatsCard
        label="Avg Processing Time"
        value={`${summary.avgProcessingTimeSeconds}s`}
        icon="Clock"
        trend={{ value: 5, direction: 'down' }}
      />
      <StatsCard
        label="Cases Under Review"
        value={summary.casesUnderReview}
        icon="ClipboardList"
        trend={{ value: 3, direction: 'up' }}
      />
    </div>
  )
}
