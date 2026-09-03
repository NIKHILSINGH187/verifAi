
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import SafeIcon from '@/components/common/SafeIcon'
import PageHeader from '@/components/common/PageHeader'
import RiskScoreSection from './RiskScoreSection'
import DocumentHeatmapPanel from './DocumentHeatmapPanel'
import FaceCapturePanel from './FaceCapturePanel'
import VerificationChecklistPanel from './VerificationChecklistPanel'
import ActionFooter from './ActionFooter'
import { VerificationCaseService } from '@/data/VerificationCaseService'
import { VerificationDocumentService } from '@/data/VerificationDocumentService'
import { VerificationFaceCaptureService } from '@/data/VerificationFaceCaptureService'
import { VerificationCheckService } from '@/data/VerificationCheckService'
import type { VerificationCaseVO } from '@/data/VerificationCaseData'
import type { VerificationDocumentData } from '@/data/VerificationDocumentData'
import type { VerificationFaceCaptureData } from '@/data/VerificationFaceCaptureData'
import type { VerificationCheckData } from '@/data/VerificationCheckData'

export default function ResultsRiskDashboard() {
  const defaultCase = VerificationCaseService.getAll()[0]
  const defaultCaseId = defaultCase?.id || 'case-data-0001'

  const [caseId, setCaseId] = useState(defaultCaseId)
  const [isClient, setIsClient] = useState(true)

  const caseData = useState(() => VerificationCaseService.getByIdVO(caseId))[0]
  const documents = useState(() => VerificationDocumentService.getByCaseId(caseId))[0]
  const faceCaptures = useState(() => VerificationFaceCaptureService.getByCaseId(caseId))[0]
  const checks = useState(() => VerificationCheckService.getByCaseId(caseId))[0]

  useEffect(() => {
    setIsClient(false)
    const raf = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search)
      const paramCaseId = params.get('caseId')
      if (paramCaseId && paramCaseId !== caseId) {
        setCaseId(paramCaseId)
      }
      setIsClient(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [caseId])

  if (!isClient) return null
  if (!caseData) return <div className="page-body text-center text-muted-foreground">Case not found</div>

  const primaryDocument = documents?.[0]
  const primaryFaceCapture = faceCaptures?.[0]

  return (
    <div className="page-body space-y-8">
      <PageHeader
        title="Verification Results"
        description={`Case ID: ${caseData.caseId} | Applicant: ${caseData.applicantName}`}
        icon="CheckCircle2"
        breadcrumbs={[
          { label: 'Dashboard', href: './case-management-dashboard.html' },
          { label: 'Results' },
        ]}
      />

      <RiskScoreSection caseData={caseData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {primaryDocument && (
          <DocumentHeatmapPanel document={primaryDocument} />
        )}
        {primaryFaceCapture && (
          <FaceCapturePanel faceCapture={primaryFaceCapture} />
        )}
      </div>

      {checks && checks.length > 0 && (
        <VerificationChecklistPanel checks={checks} />
      )}

      <ActionFooter caseId={caseData.id} caseIdDisplay={caseData.caseId} />
    </div>
  )
}
