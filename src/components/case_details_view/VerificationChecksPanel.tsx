
import React from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import VerificationCheckItem from '@/components/common/VerificationCheckItem';
import type { VerificationCheckData } from '@/data/VerificationCheckData';
import { Card } from '@/components/ui/card';

interface VerificationChecksPanelProps {
  checks: VerificationCheckData[];
}

export default function VerificationChecksPanel({ checks }: VerificationChecksPanelProps) {
  const sortedChecks = [...checks].sort((a, b) => a.order - b.order);

  const mapResultToStatus = (result: string): 'pass' | 'fail' | 'warning' | 'pending' => {
    switch (result) {
      case 'PASS':
        return 'pass';
      case 'FAIL':
        return 'fail';
      case 'WARN':
        return 'warning';
      default:
        return 'pending';
    }
  };

  return (
    <Card className="surface-raised overflow-hidden">
      <div className="card-padding border-b border-border">
        <h3 className="text-section-title flex items-center gap-2">
          <SafeIcon name="CheckSquare" size={20} className="text-primary" />
          Verification Layers
        </h3>
        <p className="text-caption mt-1">Sequential AI analysis results</p>
      </div>

      <div className="card-padding space-y-3">
        {sortedChecks.map((check) => (
          <VerificationCheckItem
            key={check.id}
            label={check.layerName}
            status={mapResultToStatus(check.result)}
            description={check.explanation}
            expandable={false}
          />
        ))}
      </div>

      {sortedChecks.length === 0 && (
        <div className="card-padding text-center py-8">
          <p className="text-muted-foreground">No verification checks available</p>
        </div>
      )}
    </Card>
  );
}
