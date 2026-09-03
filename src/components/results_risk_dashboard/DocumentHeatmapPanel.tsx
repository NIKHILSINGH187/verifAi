
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import SafeIcon from '@/components/common/SafeIcon'
import type { VerificationDocumentData } from '@/data/VerificationDocumentData'

interface DocumentHeatmapPanelProps {
  document: VerificationDocumentData
}

export default function DocumentHeatmapPanel({ document }: DocumentHeatmapPanelProps) {
  const [isClient, setIsClient] = useState(true)

  useEffect(() => {
    setIsClient(false)
    const raf = requestAnimationFrame(() => setIsClient(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  if (!isClient) return null

  const suspiciousCount = document.suspiciousRegions || 0

  return (
    <Card className="surface-raised overflow-hidden flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Document Analysis</CardTitle>
            <CardDescription className="mt-1">
              {document.docSide === 'front' ? 'Front Side' : 'Back Side'} • OCR Confidence: {document.ocrConfidence}%
            </CardDescription>
          </div>
          {suspiciousCount > 0 && (
            <div className="px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-1 shrink-0">
              <SafeIcon name="AlertTriangle" size={14} />
              {suspiciousCount} Issues
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 pt-0">
        <div className="relative rounded-lg overflow-hidden bg-muted border border-border aspect-[4/3] flex items-center justify-center group">
          <img
            src={document.imageUrl}
            alt={`Document ${document.docSide}`}
            className="w-full h-full object-cover"
          />

          {suspiciousCount > 0 && (
            <div className="absolute inset-0 bg-black/5 pointer-events-none">
              {Array.from({ length: Math.min(suspiciousCount, 3) }).map((_, i) => {
                const positions = [
                  { top: '20%', left: '15%', size: '25%' },
                  { top: '50%', left: '60%', size: '20%' },
                  { top: '70%', left: '30%', size: '22%' },
                ]
                const pos = positions[i] || positions[0]
                return (
                  <div
                    key={i}
                    className="absolute border-2 border-destructive/60 rounded-lg animate-pulse"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      width: pos.size,
                      aspectRatio: '1',
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-md bg-muted/50 border border-border">
            <span className="text-caption font-medium text-muted-foreground">Extracted Name</span>
            <p className="font-semibold text-foreground mt-1 truncate">
              {document.extractedName}
            </p>
          </div>
          <div className="p-3 rounded-md bg-muted/50 border border-border">
            <span className="text-caption font-medium text-muted-foreground">ID Number</span>
            <p className="font-semibold text-foreground mt-1 truncate">
              {document.extractedIdNumber}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
