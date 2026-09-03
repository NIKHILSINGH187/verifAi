
import React from 'react'
import SafeIcon from '@/components/common/SafeIcon'
import { cn } from '@/lib/utils'
import type { ProcessingStepData } from '@/data/ProcessingStepData'

interface ProcessingStepsListProps {
  steps: ProcessingStepData[]
}

/**
 * ProcessingStepsList
 * Displays a sequential checklist of verification steps with status indicators.
 * Each step shows: icon, label, description, and status badge.
 */
export default function ProcessingStepsList({ steps }: ProcessingStepsListProps) {
  const getStepIcon = (status: ProcessingStepData['status']) => {
    switch (status) {
      case 'complete':
        return 'CheckCircle2'
      case 'active':
        return 'RefreshCw'
      case 'warning':
        return 'AlertCircle'
      default:
        return 'Circle'
    }
  }

  const getStepColor = (status: ProcessingStepData['status']) => {
    switch (status) {
      case 'complete':
        return 'text-emerald-600'
      case 'active':
        return 'text-primary animate-spin'
      case 'warning':
        return 'text-amber-500'
      default:
        return 'text-muted-foreground/40'
    }
  }

  const getStepBadge = (status: ProcessingStepData['status']) => {
    switch (status) {
      case 'complete':
        return 'badge-clear'
      case 'active':
        return 'badge-processing'
      case 'warning':
        return 'badge-review'
      default:
        return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground'
    }
  }

  const getStepBadgeText = (status: ProcessingStepData['status']) => {
    switch (status) {
      case 'complete':
        return 'COMPLETE'
      case 'active':
        return 'PROCESSING'
      case 'warning':
        return 'WARNING'
      default:
        return 'PENDING'
    }
  }

  return (
    <div className="space-y-3">
      {steps.map((step, idx) => (
        <div
          key={step.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-md border transition-all duration-300',
            step.status === 'complete' && 'border-emerald-200 bg-emerald-50/50',
            step.status === 'active' && 'border-primary bg-primary/5',
            step.status === 'warning' && 'border-amber-200 bg-amber-50/50',
            step.status === 'pending' && 'border-border bg-muted/20'
          )}
        >
          {/* Step Icon */}
          <div className={cn('mt-0.5 shrink-0', getStepColor(step.status))}>
            <SafeIcon
              name={getStepIcon(step.status)}
              size={20}
              strokeWidth={2.5}
            />
          </div>

          {/* Step Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-item-title font-medium text-foreground">
                {step.order}. {step.label}
              </span>
              <span className={getStepBadge(step.status)}>
                {getStepBadgeText(step.status)}
              </span>
            </div>
            <p className="text-caption text-muted-foreground leading-snug">
              {step.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
