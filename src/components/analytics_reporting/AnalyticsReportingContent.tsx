
import React, { useMemo } from 'react';
import { useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import StatsCard from '@/components/common/StatsCard';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnalyticsSummaryService } from '@/data/AnalyticsSummaryService';
import { AnalyticsTrendService } from '@/data/AnalyticsTrendService';
import { RiskDistributionService } from '@/data/RiskDistributionService';
import { DepartmentService } from '@/data/DepartmentService';
import SafeIcon from '@/components/common/SafeIcon';
import { toast } from 'sonner';
import ChartSection from './ChartSection';
import RiskDistributionChart from './RiskDistributionChart';
import { cn } from '@/lib/utils';

export default function AnalyticsReportingContent() {
  const [isClient, setIsClient] = useState(true);
  const [dateRange, setDateRange] = useState('last_30_days');
  const [departmentId, setDepartmentId] = useState('dept-home-affairs-central');

  const summaryData = useState(() => AnalyticsSummaryService.query({}));
  const trendData = useState(() => AnalyticsTrendService.query({}));
  const riskDistributionData = useState(() => RiskDistributionService.query({}));
  const departments = useState(() => DepartmentService.getAll());

  useEffect(() => {
    setIsClient(false);
    const raf = requestAnimationFrame(() => {
      setIsClient(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const filteredSummary = useMemo(() => {
    return AnalyticsSummaryService.query({
      filter: {
        departmentId: [departmentId],
        dateRangeKey: [dateRange],
      },
    });
  }, [dateRange, departmentId]);

  const filteredTrends = useMemo(() => {
    return AnalyticsTrendService.query({
      filter: {
        departmentId: [departmentId],
        periodKey: [dateRange],
      },
    });
  }, [dateRange, departmentId]);

  const filteredRiskDistribution = useMemo(() => {
    return RiskDistributionService.query({
      filter: {
        departmentId: [departmentId],
      },
    });
  }, [departmentId]);

  const currentDepartment = departments[0]?.find((d) => d.id === departmentId);

  const handleExportPDF = () => {
    toast.success('PDF report exported successfully');
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartmentId(value);
  };

  const summary = filteredSummary[0] || filteredSummary[0];

  return (
    <div className="scroll-region flex flex-col">
      <div className="page-body flex-shrink-0">
        <PageHeader
          title="Analytics & System Reporting"
          description="Comprehensive data visualization suite for departmental trends and case analytics"
          icon="BarChart3"
          breadcrumbs={[
            { label: 'Dashboard', href: './case-management-dashboard.html' },
            { label: 'Analytics' },
          ]}
          actions={
            <Button
              onClick={handleExportPDF}
              className="gap-2"
            >
              <SafeIcon name="Download" size={16} />
              Export PDF
            </Button>
          }
        />

        {/* Filter Bar */}
        <div className="filter-bar mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex flex-wrap items-center gap-4 w-full">
            <div className="flex items-center gap-2 min-w-fit">
              <label className="text-label">Date Range:</label>
              <Select value={dateRange} onValueChange={handleDateRangeChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 min-w-fit">
              <label className="text-label">Department:</label>
              <Select value={departmentId} onValueChange={handleDepartmentChange}>
                <SelectTrigger className="w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments[0]?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Summary Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            label="Total Cases Screened"
            value={summary?.totalCasesScreened || 0}
            icon="FileCheck"
            trend={{ value: 12, direction: 'up' }}
          />
          <StatsCard
            label="High Risk Flagged"
            value={summary?.highRiskFlagged || 0}
            icon="AlertTriangle"
            trend={{ value: 8, direction: 'up' }}
          />
          <StatsCard
            label="Avg Processing Time"
            value={`${Math.round((summary?.avgProcessingTimeSeconds || 0) / 60)}m`}
            icon="Clock"
            trend={{ value: 5, direction: 'down' }}
          />
          <StatsCard
            label="Cases Under Review"
            value={summary?.casesUnderReview || 0}
            icon="Hourglass"
            trend={{ value: 3, direction: 'up' }}
          />
        </div>
      </div>

      {/* Charts Section - Scrollable */}
      <div className={cn(
        "flex-1 overflow-y-auto min-h-0 px-8 pb-8 space-y-8",
        !isClient && "invisible"
      )}>
        {/* Line Chart - Case Volume Over Time */}
        <ChartSection
          title="Case Volume & Risk Trend"
          description="Daily case submissions and average risk scores over the selected period"
          data={filteredTrends[0] || []}
        />

        {/* Pie Chart - Risk Distribution */}
        <RiskDistributionChart
          title="Risk Distribution"
          description="Breakdown of cases by risk classification"
          data={filteredRiskDistribution[0] || []}
        />
      </div>
    </div>
  );
}
