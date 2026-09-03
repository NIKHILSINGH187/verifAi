
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import VerificationCheckItem from '@/components/common/VerificationCheckItem'
import type { VerificationCheckData } from '@/data/VerificationCheckData'

interface VerificationChecklistPanelProps {
  checks: VerificationCheckData[]
}

export default function VerificationChecklistPanel({ checks }: VerificationChecklistPanelProps) {
  const sortedChecks = [...checks].sort((a, b) => a.order - b.order)

  const getCheckStatus = (result: string): 'pass' | 'fail' | 'warning' | 'pending' => {
    switch (result) {
      case 'PASS':
        return 'pass'
      case 'FAIL':
        return 'fail'
      case 'WARN':
        return 'warning'
      default:
        return 'pending'
    }
  }

  return (
    <Card className="surface-raised overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Verification Layers</CardTitle>
        <CardDescription className="mt-1">
          Detailed breakdown of AI security checks performed during analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {sortedChecks.map((check) => (
            <VerificationCheckItem
              key={check.id}
              label={check.layerName}
              status={getCheckStatus(check.result)}
              description={check.explanation}
              expandable={true}
            >
              <div className="space-y-2 text-sm">
                <p className="text-foreground">
                  {check.explanation}
                </p>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Layer: {check.layerKey}
                  </p>
                </div>
              </div>
            </VerificationCheckItem>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
