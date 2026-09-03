
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import RiskScoreGauge from '@/components/common/RiskScoreGauge'
import SafeIcon from '@/components/common/SafeIcon'
import type { VerificationCaseVO } from '@/data/VerificationCaseData'

interface RiskScoreSectionProps {
  caseData: VerificationCaseVO
}

export default function RiskScoreSection({ caseData }: RiskScoreSectionProps) {
  const getRiskColor = (score: number) => {
    if (score < 40) return 'text-emerald-600'
    if (score < 70) return 'text-amber-500'
    return 'text-destructive'
  }

  const getVerdictBadgeClass = (verdict: string) => {
    switch (verdict) {
      case 'CLEAR':
        return 'badge-clear'
      case 'REVIEW':
        return 'badge-review'
      case 'HIGH RISK':
        return 'badge-risk'
      default:
        return 'badge-processing'
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'CLEAR':
        return 'CheckCircle2'
      case 'REVIEW':
        return 'AlertCircle'
      case 'HIGH RISK':
        return 'AlertTriangle'
      default:
        return 'Clock'
    }
  }

  return (
    <Card className="surface-raised overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Risk Assessment Summary</CardTitle>
            <CardDescription className="mt-1">
              AI-powered analysis completed on {new Date(caseData.updatedAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className={cn("p-3 rounded-lg", getVerdictBadgeClass(caseData.verdict))}>
            <SafeIcon name={getVerdictIcon(caseData.verdict)} size={28} strokeWidth={2} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
          <div className="flex flex-col items-center">
            <RiskScoreGauge score={caseData.riskScore} size="lg" showLabel={true} />
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <span className="text-caption font-medium text-muted-foreground">VERDICT</span>
                <p className={cn("text-xl font-bold mt-2", getRiskColor(caseData.riskScore))}>
                  {caseData.verdict}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <span className="text-caption font-medium text-muted-foreground">DOCUMENT TYPE</span>
                <p className="text-lg font-semibold text-foreground mt-2">
                  {caseData.documentTypeName}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <span className="text-caption font-medium text-muted-foreground">OFFICER</span>
                <p className="text-sm font-medium text-foreground mt-2">
                  {caseData.officerName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {caseData.officerRole}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <span className="text-caption font-medium text-muted-foreground">DEPARTMENT</span>
                <p className="text-sm font-medium text-foreground mt-2">
                  {caseData.departmentName}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex gap-2 items-start">
                <SafeIcon name="Info" size={18} className="text-primary mt-0.5 shrink-0" />
                <div className="text-sm text-foreground">
                  <p className="font-medium mb-1">Recommendation</p>
                  <p className="text-muted-foreground">
                    {caseData.riskScore < 40
                      ? 'Identity verification passed all security checks. Applicant is cleared for processing.'
                      : caseData.riskScore < 70
                        ? 'Minor inconsistencies detected. Manual review recommended before final approval.'
                        : 'High-risk indicators present. Escalate to senior officer for investigation.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
