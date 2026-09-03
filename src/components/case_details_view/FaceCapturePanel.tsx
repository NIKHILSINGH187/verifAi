
import React from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import type { VerificationFaceCaptureData } from '@/data/VerificationFaceCaptureData';
import { Card } from '@/components/ui/card';

interface FaceCapturePanelProps {
  faceCapture: VerificationFaceCaptureData;
  isClient: boolean;
}

export default function FaceCapturePanel({ faceCapture, isClient }: FaceCapturePanelProps) {
  if (!isClient) {
    return (
      <Card className="surface-raised card-padding h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Loading face capture...</p>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-600';
    if (score >= 70) return 'text-amber-500';
    return 'text-destructive';
  };

  return (
    <Card className="surface-raised overflow-hidden">
      <div className="card-padding border-b border-border">
        <h3 className="text-section-title flex items-center gap-2">
          <SafeIcon name="Camera" size={20} className="text-primary" />
          Face Capture
        </h3>
        <p className="text-caption mt-1">Biometric verification selfie</p>
      </div>

      <div className="relative bg-muted/30 aspect-video flex items-center justify-center overflow-hidden">
        <img
          src={faceCapture.imageUrl}
          alt="Face capture"
          className="w-full h-full object-cover"
        />

        {/* Oval Face Guide Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-2/3 h-3/4 border-2 border-accent/30 rounded-full" />
        </div>
      </div>

      <div className="card-padding border-t border-border space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-caption mb-1">Liveness Score</p>
            <p className={`text-item-title font-semibold ${getScoreColor(faceCapture.livenessScore)}`}>
              {faceCapture.livenessScore}%
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-md">
            <p className="text-caption mb-1">Face Match Score</p>
            <p className={`text-item-title font-semibold ${getScoreColor(faceCapture.faceMatchScore)}`}>
              {faceCapture.faceMatchScore}%
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <p className="text-caption mb-2">Capture Quality</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${faceCapture.captureQuality}%` }}
              />
            </div>
            <span className="text-item-title text-xs font-semibold">{faceCapture.captureQuality}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
