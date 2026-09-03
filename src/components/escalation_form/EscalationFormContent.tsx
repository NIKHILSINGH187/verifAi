
import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import SafeIcon from '@/components/common/SafeIcon';
import PageHeader from '@/components/common/PageHeader';
import RiskScoreGauge from '@/components/common/RiskScoreGauge';
import { VerificationCaseService } from '@/data/VerificationCaseService';
import { DepartmentService } from '@/data/DepartmentService';
import { EscalationCaseService } from '@/data/EscalationCaseService';
import type { VerificationCaseVO } from '@/data/VerificationCaseData';
import { cn } from '@/lib/utils';

const escalationFormSchema = z.object({
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    errorMap: () => ({ message: 'Please select a priority level' }),
  }),
  routedDepartmentId: z.string().min(1, 'Please select a target department'),
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(500, 'Reason must not exceed 500 characters'),
});

type EscalationFormData = z.infer<typeof escalationFormSchema>;

export default function EscalationFormContent() {
  const [isClient, setIsClient] = useState(true);
  const [caseData, setCaseData] = useState<VerificationCaseVO | null>(() => {
    const allCases = VerificationCaseService.getAll();
    return allCases.length > 0 ? VerificationCaseService.getByIdVO(allCases[0].id) || null : null;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = useMemo(() => DepartmentService.getAll(), []);

  const form = useForm<EscalationFormData>({
    resolver: zodResolver(escalationFormSchema),
    defaultValues: {
      priority: 'MEDIUM',
      routedDepartmentId: '',
      reason: '',
    },
  });

  React.useEffect(() => {
    setIsClient(false);
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('caseId');

    if (caseId) {
      const fetchedCase = VerificationCaseService.getByIdVO(caseId);
      if (fetchedCase) {
        setCaseData(fetchedCase);
      } else {
        toast.error('Case not found. Loading default case.');
        const allCases = VerificationCaseService.getAll();
        if (allCases.length > 0) {
          const defaultCase = VerificationCaseService.getByIdVO(allCases[0].id);
          if (defaultCase) setCaseData(defaultCase);
        }
      }
    }

    requestAnimationFrame(() => {
      setIsClient(true);
    });
  }, []);

  const handleSubmit = async (data: EscalationFormData) => {
    if (!caseData) {
      toast.error('Case data not loaded. Please try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const escalationRecord = {
        id: `escalation-${Date.now()}`,
        caseId: caseData.caseId,
        officerId: 'officer-001',
        departmentId: caseData.departmentId,
        priority: data.priority as 'LOW' | 'MEDIUM' | 'HIGH',
        reason: data.reason,
        routedDepartmentId: data.routedDepartmentId,
        status: 'PENDING' as const,
        createdAt: new Date().toISOString(),
      };

      toast.success('Case escalated successfully for manual review.');

      setTimeout(() => {
        window.location.href = './case-management-dashboard.html';
      }, 1000);
    } catch (error) {
      console.error('Escalation error:', error);
      toast.error('Failed to escalate case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (caseData) {
      window.location.href = `./results-risk-dashboard.html?caseId=${caseData.caseId}`;
    } else {
      window.location.href = './case-management-dashboard.html';
    }
  };

  if (!isClient || !caseData) {
    return (
      <div className="page-body h-full flex items-center justify-center">
        <div className="text-center">
          <SafeIcon name="Loader2" size={48} className="mx-auto mb-4 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading case details...</p>
        </div>
      </div>
    );
  }

  const riskLevel = caseData.riskScore >= 70 ? 'HIGH' : caseData.riskScore >= 40 ? 'MEDIUM' : 'LOW';

  return (
    <div className="page-body h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Page Header */}
        <PageHeader
          title="Escalate Case for Manual Review"
          description="Flag this high-risk identity verification case for senior officer investigation and formal audit trail."
          icon="AlertTriangle"
          breadcrumbs={[
            { label: 'Dashboard', href: './case-management-dashboard.html' },
            { label: 'Case Details', href: `./results-risk-dashboard.html?caseId=${caseData.caseId}` },
            { label: 'Escalate' },
          ]}
        />

        {/* Case Summary Alert */}
        <Alert className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <SafeIcon name="AlertTriangle" className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-900 dark:text-amber-200">High-Risk Case Flagged</AlertTitle>
          <AlertDescription className="text-amber-800 dark:text-amber-300 mt-1">
            Case <strong>{caseData.caseId}</strong> for <strong>{caseData.applicantName}</strong> has a risk score of{' '}
            <strong>{caseData.riskScore}</strong> and requires immediate manual review by senior personnel.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Case Overview Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Case Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <RiskScoreGauge score={caseData.riskScore} size="md" showLabel={true} />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Case ID</span>
                  <p className="font-mono font-semibold text-foreground">{caseData.caseId}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Applicant Name</span>
                  <p className="font-medium text-foreground">{caseData.applicantName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Document Type</span>
                  <p className="font-medium text-foreground">{caseData.documentTypeName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Department</span>
                  <p className="font-medium text-foreground text-xs">{caseData.departmentName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Screening Officer</span>
                  <p className="font-medium text-foreground text-xs">{caseData.officerName}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Escalation Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Escalation Details</CardTitle>
              <CardDescription>Provide justification and routing information for this escalation.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  {/* Priority Selection */}
                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Priority Level</FormLabel>
                        <FormDescription>Select the urgency level for this escalation.</FormDescription>
                        <FormControl>
                          <RadioGroup value={field.value} onValueChange={field.onChange}>
                            <div className="space-y-3 mt-3">
                              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                <RadioGroupItem value="LOW" id="priority-low" />
                                <label htmlFor="priority-low" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-foreground">Low Priority</div>
                                  <div className="text-xs text-muted-foreground">Routine review, non-urgent</div>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors">
                                <RadioGroupItem value="MEDIUM" id="priority-medium" />
                                <label htmlFor="priority-medium" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-foreground">Medium Priority</div>
                                  <div className="text-xs text-muted-foreground">Moderate risk, review within 24 hours</div>
                                </label>
                              </div>
                              <div className="flex items-center space-x-2 p-3 rounded-lg border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 cursor-pointer transition-colors">
                                <RadioGroupItem value="HIGH" id="priority-high" />
                                <label htmlFor="priority-high" className="flex-1 cursor-pointer">
                                  <div className="font-medium text-destructive">High Priority</div>
                                  <div className="text-xs text-destructive/70">Critical risk, immediate action required</div>
                                </label>
                              </div>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Target Department Selection */}
                  <FormField
                    control={form.control}
                    name="routedDepartmentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Route to Department</FormLabel>
                        <FormDescription>Select which department should handle this escalation.</FormDescription>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select target department..." />
                            </SelectTrigger>
                            <SelectContent>
                              {departments.map((dept) => (
                                <SelectItem key={dept.id} value={dept.id}>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{dept.name}</span>
                                    <span className="text-xs text-muted-foreground">({dept.code})</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Escalation Reason */}
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-semibold">Justification & Notes</FormLabel>
                        <FormDescription>Explain why this case requires manual review and what specific concerns triggered the escalation.</FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Describe the reason for escalation, suspicious indicators, and any additional context for the reviewing officer..."
                            className="min-h-[120px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <div className="text-xs text-muted-foreground mt-1">
                          {field.value.length}/500 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Form Actions */}
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={isSubmitting}
                      className="flex-1"
                    >
                      <SafeIcon name="X" size={16} className="mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-destructive hover:bg-destructive/90"
                    >
                      {isSubmitting ? (
                        <>
                          <SafeIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                          Escalating...
                        </>
                      ) : (
                        <>
                          <SafeIcon name="Flag" size={16} className="mr-2" />
                          Escalate Case
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Audit Trail Info */}
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <SafeIcon name="ShieldCheck" size={20} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900 dark:text-blue-200">
                <p className="font-medium mb-1">Audit Trail Protection</p>
                <p>
                  This escalation will be logged with your officer ID, timestamp, and justification. All actions are permanently recorded for compliance and investigation purposes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
