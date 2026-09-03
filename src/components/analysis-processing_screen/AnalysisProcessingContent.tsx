
import React, { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import ScanningIndicator from './ScanningIndicator'
import ProcessingStepsList from './ProcessingStepsList'
import { VerificationSessionService } from '@/data/VerificationSessionService'
import { ProcessingStepService } from '@/data/ProcessingStepService'
import type { VerificationSessionData } from '@/data/VerificationSessionData'
import type { ProcessingStepData } from '@/data/ProcessingStepData'

export default function AnalysisProcessingContent() {
  const [isClient, setIsClient] = useState(true)
  const [session, setSession] = useState<VerificationSessionData | null>(() => {
    const defaultSession = VerificationSessionService.getAll()[0]
    return defaultSession || null
  })
  const [steps, setSteps] = useState<ProcessingStepData[]>(() => ProcessingStepService.getAll())
  const [progress, setProgress] = useState(session?.progress || 0)

  useEffect(() => {
    setIsClient(false)
    const raf = requestAnimationFrame(() => {
      setIsClient(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const params = new URLSearchParams(window.location.search)
    const sessionId = params.get('sessionId')

    if (sessionId) {
      const foundSession = VerificationSessionService.getAll().find(s => s.sessionId === sessionId)
      if (foundSession) {
        setSession(foundSession)
        setProgress(foundSession.progress)
      }
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient || !session) return

    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 15, 100)
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            window.location.href = `./results-risk-dashboard.html?caseId=${session.caseId}`
          }, 1500)
        }

        setSteps(currentSteps =>
          currentSteps.map((step, idx) => {
            const stepProgress = (newProgress / 100) * currentSteps.length
            if (idx < Math.floor(stepProgress)) {
              return { ...step, status: 'complete' as const }
            } else if (idx === Math.floor(stepProgress)) {
              return { ...step, status: 'active' as const }
            }
            return { ...step, status: 'pending' as const }
          })
        )

        return newProgress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isClient, session])

  const handleCancel = () => {
    toast.info('Cancelling verification...')
    setTimeout(() => {
      window.location.href = './case-management-dashboard.html'
    }, 600)
  }

  if (!isClient) {
    return (
      <div className="page-body flex flex-col items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="mb-6">
            <SafeIcon name="RefreshCw" size={48} className="mx-auto text-muted-foreground animate-spin" />
          </div>
          <h2 className="text-section-title mb-2">Processing Verification</h2>
          <p className="text-caption text-muted-foreground">Analyzing document and biometric data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-body flex flex-col items-center justify-center min-h-[calc(100vh-var(--header-height))]">
      {/* Main Processing Container */}
      <div className="w-full max-w-2xl">
        {/* Animated Scanning Indicator */}
        <div className="flex justify-center mb-12">
          {isClient && <ScanningIndicator progress={progress} />}
        </div>

        {/* Progress Bar */}
        {isClient && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-label text-foreground">Overall Progress</span>
              <span className="text-label font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Processing Steps Checklist */}
        <div className="surface-raised card-padding">
          <h3 className="text-item-title mb-4 flex items-center gap-2">
            <SafeIcon name="CheckSquare2" size={18} className="text-primary" />
            Verification Steps
          </h3>
          {isClient && <ProcessingStepsList steps={steps} />}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mt-8">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex items-center gap-2"
          >
            <SafeIcon name="X" size={16} />
            Cancel Verification
          </Button>
        </div>

        {/* Status Message */}
        <p className="text-center text-caption text-muted-foreground mt-6">
          {progress < 100
            ? 'Please wait while we analyze your submission...'
            : 'Analysis complete. Redirecting to results...'}
        </p>
      </div>
    </div>
  )
}
