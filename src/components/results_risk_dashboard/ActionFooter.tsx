
import React from 'react'
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { toast } from 'sonner'

interface ActionFooterProps {
  caseId: string
  caseIdDisplay: string
}

export default function ActionFooter({ caseId, caseIdDisplay }: ActionFooterProps) {
  const handleDownloadPDF = () => {
    toast.success(`Report for ${caseIdDisplay} downloaded as PDF`)
    const link = document.createElement('a')
    link.href = '#'
    link.download = `VerifAI_Report_${caseIdDisplay}.pdf`
    link.click()
  }

  const handleEscalate = () => {
    window.location.href = `./escalation-form.html?caseId=${caseId}`
  }

  const handleBackToDashboard = () => {
    window.location.href = './case-management-dashboard.html'
  }

  const handleNewVerification = () => {
    window.location.href = './upload-capture-screen.html'
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center pt-6 border-t border-border">
      <Button
        variant="outline"
        onClick={handleBackToDashboard}
        className="w-full sm:w-auto"
      >
        <SafeIcon name="ArrowLeft" size={16} className="mr-2" />
        Back to Dashboard
      </Button>

      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          className="w-full sm:w-auto"
        >
          <SafeIcon name="Download" size={16} className="mr-2" />
          Download PDF Report
        </Button>

        <Button
          variant="outline"
          onClick={handleEscalate}
          className="w-full sm:w-auto border-amber-500/30 text-amber-600 hover:bg-amber-50"
        >
          <SafeIcon name="AlertTriangle" size={16} className="mr-2" />
          Escalate Case
        </Button>

        <Button
          onClick={handleNewVerification}
          className="w-full sm:w-auto"
        >
          <SafeIcon name="Plus" size={16} className="mr-2" />
          New Verification
        </Button>
      </div>
    </div>
  )
}
