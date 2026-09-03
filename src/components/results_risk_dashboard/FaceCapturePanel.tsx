
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import type { VerificationFaceCaptureData } from '@/data/VerificationFaceCaptureData'

interface FaceCapturePanelProps {
  faceCapture: VerificationFaceCaptureData
}

export default function FaceCapturePanel({ faceCapture }: FaceCapturePanelProps) {
  const [isClient, setIsClient] = useState(true)

  useEffect(() => {
    setIsClient(false)
    const raf = requestAnimationFrame(() => setIsClient(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!isClient) return null

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600'
    if (score >= 70) return 'text-amber-500'
    return 'text-destructive'
  }

  return (
    <Card className="surface-raised overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Biometric Capture</CardTitle>
            <CardDescription className="mt-1">
              Captured on {new Date(faceCapture.capturedAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1 shrink-0">
            <SafeIcon name="CheckCircle2" size={14} />
            Live
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 pt-0">
        <div className="relative rounded-lg overflow-hidden bg-muted border border-border aspect-square flex items-center justify-center">
          <img
            src={faceCapture.imageUrl}
            alt="Face Capture"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 border-4 border-primary/30 rounded-full pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-md bg-muted/50 border border-border">
            <span className="text-caption font-medium text-muted-foreground">Liveness</span>
            <p className={cn("text-lg font-bold mt-1", getScoreColor(faceCapture.livenessScore))}>
              {faceCapture.livenessScore}%
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 border border-border">
            <span className="text-caption font-medium text-muted-foreground">Face Match</span>
            <p className={cn("text-lg font-bold mt-1", getScoreColor(faceCapture.faceMatchScore))}>
              {faceCapture.faceMatchScore}%
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 border border-border col-span-2">
            <span className="text-caption font-medium text-muted-foreground">Capture Quality</span>
            <p className={cn("text-lg font-bold mt-1", getScoreColor(faceCapture.captureQuality))}>
              {faceCapture.captureQuality}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
