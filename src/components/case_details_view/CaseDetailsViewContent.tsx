
import React from 'react';
import { VerificationCaseService } from '@/data/VerificationCaseService';
import { VerificationDocumentService } from '@/data/VerificationDocumentService';
import { VerificationFaceCaptureService } from '@/data/VerificationFaceCaptureService';
import { VerificationCheckService } from '@/data/VerificationCheckService';
import type { VerificationCaseVO } from '@/data/VerificationCaseData';
import type { VerificationDocumentData } from '@/data/VerificationDocumentData';
import type { VerificationFaceCaptureData } from '@/data/VerificationFaceCaptureData';
import type { VerificationCheckData } from '@/data/VerificationCheckData';
import CaseDetailsHeader from './CaseDetailsHeader';
import DocumentEvidencePanel from './DocumentEvidencePanel';
import FaceCapturePanel from './FaceCapturePanel';
import VerificationChecksPanel from './VerificationChecksPanel';
import { toast } from 'sonner';

export default function CaseDetailsViewContent() {
  const fallbackCase = VerificationCaseService.getAll()[0];
  const fallbackCaseVO = VerificationCaseService.getByIdVO(fallbackCase.id);

  const [caseData, setCaseData] = useState<VerificationCaseVO | null>(() => fallbackCaseVO || null);
  const [documents, setDocuments] = useState<VerificationDocumentData[]>(() => 
    fallbackCase ? VerificationDocumentService.getByCaseId(fallbackCase.id) : []
  );
  const [faceCapture, setFaceCapture] = useState<VerificationFaceCaptureData | null>(() => {
    const captures = fallbackCase ? VerificationFaceCaptureService.getByCaseId(fallbackCase.id) : [];
    return captures.length > 0 ? captures[0] : null;
  });
  const [checks, setChecks] = useState<VerificationCheckData[]>(() =>
    fallbackCase ? VerificationCheckService.getByCaseId(fallbackCase.id) : []
  );
  const [isClient, setIsClient] = useState(true);

  useEffect(() => {
    setIsClient(false);
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('caseId');

    if (caseId) {
      const fetchedCase = VerificationCaseService.getByIdVO(caseId);
      if (fetchedCase) {
        setCaseData(fetchedCase);
        setDocuments(VerificationDocumentService.getByCaseId(caseId));
        const captures = VerificationFaceCaptureService.getByCaseId(caseId);
        setFaceCapture(captures.length > 0 ? captures[0] : null);
        setChecks(VerificationCheckService.getByCaseId(caseId));
      }
    }

    requestAnimationFrame(() => {
      setIsClient(true);
    });
  }, []);

  const handleDownloadPDF = () => {
    toast.success('PDF report downloaded successfully');
  };

  const handleBackToDashboard = () => {
    window.location.href = './case-management-dashboard.html';
  };

  if (!caseData) {
    return (
      <div className="page-body h-full flex items-center justify-center">
        <p className="text-muted-foreground">No case data available</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto min-h-0 flex flex-col">
      <div className="page-body flex-shrink-0">
        <CaseDetailsHeader 
          caseData={caseData}
          onBack={handleBackToDashboard}
        />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="page-body space-y-6 pb-8">
          {/* Document & Face Capture Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {documents.length > 0 && (
              <DocumentEvidencePanel 
                document={documents[0]}
                isClient={isClient}
              />
            )}
            {faceCapture && (
              <FaceCapturePanel 
                faceCapture={faceCapture}
                isClient={isClient}
              />
            )}
          </div>

          {/* Verification Checks */}
          {checks.length > 0 && (
            <VerificationChecksPanel checks={checks} />
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
            <button
              onClick={handleDownloadPDF}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-hover transition-colors"
            >
              Download PDF Report
            </button>
            <button
              onClick={handleBackToDashboard}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-border text-foreground font-medium text-sm hover:bg-muted transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
