
import React from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import StatusBadge from '@/components/common/StatusBadge';
import RiskScoreGauge from '@/components/common/RiskScoreGauge';
import type { VerificationCaseVO } from '@/data/VerificationCaseData';
import { Button } from '@/components/ui/button';

interface CaseDetailsHeaderProps {
  caseData: VerificationCaseVO;
  onBack: () => void;
}

export default function CaseDetailsHeader({ caseData, onBack }: CaseDetailsHeaderProps) {
  const createdDate = new Date(caseData.createdAt);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(createdDate);

  const statusMap: Record<string, 'CLEAR' | 'REVIEW' | 'HIGH_RISK' | 'PROCESSING'> = {
    'CLEAR': 'CLEAR',
    'REVIEW': 'REVIEW',
    'HIGH RISK': 'HIGH_RISK',
  };

  const badgeStatus = statusMap[caseData.status] || 'PROCESSING';

  return (
    <div className="space-y-4">
      {/* Back Button & Title Row */}
      <div className="flex items-start gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 rounded-lg hover:bg-muted"
        >
          <SafeIcon name="ArrowLeft" size={20} />
        </Button>
        <div className="flex-1">
          <h1 className="text-page-title">Case Details</h1>
          <p className="text-caption mt-1">
            Case ID: <span className="font-mono font-semibold text-foreground">{caseData.caseId}</span>
          </p>
        </div>
      </div>

      {/* Case Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="surface-base card-padding">
          <p className="text-caption mb-1">Applicant Name</p>
          <p className="text-item-title truncate">{caseData.applicantName}</p>
        </div>
        <div className="surface-base card-padding">
          <p className="text-caption mb-1">Document Type</p>
          <p className="text-item-title">{caseData.documentTypeName}</p>
        </div>
        <div className="surface-base card-padding">
          <p className="text-caption mb-1">Processed By</p>
          <p className="text-item-title truncate">{caseData.officerName}</p>
        </div>
        <div className="surface-base card-padding">
          <p className="text-caption mb-1">Processed Date</p>
          <p className="text-item-title text-xs">{formattedDate}</p>
        </div>
      </div>

      {/* Risk Score & Verdict */}
      <div className="surface-raised card-padding flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <RiskScoreGauge score={caseData.riskScore} size="md" showLabel={true} />
          <div>
            <p className="text-caption mb-2">Verdict</p>
            <StatusBadge status={badgeStatus} size="md" />
          </div>
        </div>
        <div className="text-right">
          <p className="text-caption mb-1">Department</p>
          <p className="text-item-title">{caseData.departmentName}</p>
        </div>
      </div>
    </div>
  );
}
