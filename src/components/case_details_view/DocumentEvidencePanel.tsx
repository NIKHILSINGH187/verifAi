
import React from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import type { VerificationDocumentData } from '@/data/VerificationDocumentData';
import { Card } from '@/components/ui/card';

interface DocumentEvidencePanelProps {
  document: VerificationDocumentData;
  isClient: boolean;
}

export default function DocumentEvidencePanel({ document, isClient }: DocumentEvidencePanelProps) {
  if (!isClient) {
    return (
      <Card className="surface-raised card-padding h-96 flex items-center justify-center">
        <p className="text-muted-foreground">Loading document...</p>
      </Card>
    );
  }

  return (
    <Card className="surface-raised overflow-hidden">
      <div className="card-padding border-b border-border">
        <h3 className="text-section-title flex items-center gap-2">
          <SafeIcon name="FileImage" size={20} className="text-primary" />
          Document Evidence
        </h3>
        <p className="text-caption mt-1">
          {document.docSide === 'front' ? 'Front Side' : 'Back Side'} • 
          <span className="ml-2 font-semibold text-foreground">
            {document.suspiciousRegions} suspicious region{document.suspiciousRegions !== 1 ? 's' : ''}
          </span>
        </p>
      </div>

      <div className="relative bg-muted/30 aspect-video flex items-center justify-center overflow-hidden">
        <img
          src={document.imageUrl}
          alt="Document evidence"
          className="w-full h-full object-cover"
        />

        {/* Suspicious Regions Overlay */}
        {document.suspiciousRegions > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(Math.min(document.suspiciousRegions, 3))].map((_, i) => {
              const positions = [
                { top: '20%', left: '15%', w: '25%', h: '20%' },
                { top: '50%', left: '60%', w: '30%', h: '25%' },
                { top: '70%', left: '10%', w: '20%', h: '15%' },
              ];
              const pos = positions[i % positions.length];
              return (
                <div
                  key={`region-${i}`}
                  className="absolute border-2 border-destructive/60 rounded-sm bg-destructive/5"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    width: pos.w,
                    height: pos.h,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="card-padding border-t border-border space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-caption">Extracted Name</span>
          <span className="text-item-title">{document.extractedName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-caption">Document ID</span>
          <span className="text-item-title font-mono text-xs">{document.extractedIdNumber}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-border/50">
          <span className="text-caption">OCR Confidence</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${document.ocrConfidence}%` }}
              />
            </div>
            <span className="text-item-title text-xs font-semibold">{document.ocrConfidence}%</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
