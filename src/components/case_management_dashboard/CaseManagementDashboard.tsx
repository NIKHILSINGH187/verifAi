
import React from 'react'
import { VerificationCaseService } from '@/data/VerificationCaseService'
import { AnalyticsSummaryService } from '@/data/AnalyticsSummaryService'
import { RiskDistributionService } from '@/data/RiskDistributionService'
import StatsOverview from './StatsOverview'
import CaseTable from './CaseTable'
import RiskDistributionChart from './RiskDistributionChart'
import CaseVolumeChart from './CaseVolumeChart'
import PageHeader from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function CaseManagementDashboard() {
  const [isClient, setIsClient] = useState(true)
  
  const allCases = useState(() => VerificationCaseService.getAll())
  const summaryData = useState(() => AnalyticsSummaryService.getAll())
  const riskDistribution = useState(() => RiskDistributionService.query({}))

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setIsClient(false)
    const raf = requestAnimationFrame(() => {
      const params = new URLSearchParams(window.location.search)
      const pageParam = params.get('page')
      const sortParam = params.get('sortBy')
      const statusParam = params.get('statusFilter')
      const searchParam = params.get('searchTerm')

      if (pageParam) setCurrentPage(Math.max(1, parseInt(pageParam, 10)))
      if (sortParam) setSortBy(sortParam)
      if (statusParam) setStatusFilter(statusParam)
      if (searchParam) setSearchTerm(decodeURIComponent(searchParam))

      setIsClient(true)
    })
    return () => cancelAnimationFrame(raf)
  }, [])

  const filteredCases = useMemo(() => {
    let result = allCases[0]

    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter && statusFilter !== 'all') {
      result = result.filter((c) => c.status === statusFilter)
    }

    if (sortBy === 'createdAt') {
      result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'riskScore') {
      result = [...result].sort((a, b) => b.riskScore - a.riskScore)
    } else if (sortBy === 'applicantName') {
      result = [...result].sort((a, b) => a.applicantName.localeCompare(b.applicantName))
    }

    return result
  }, [allCases[0], searchTerm, statusFilter, sortBy])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
    const params = new URLSearchParams()
    if (term) params.set('searchTerm', term)
    if (statusFilter && statusFilter !== 'all') params.set('statusFilter', statusFilter)
    params.set('sortBy', sortBy)
    params.set('page', '1')
    window.history.replaceState({}, '', `?${params.toString()}`)
  }

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status)
    setCurrentPage(1)
    const params = new URLSearchParams()
    if (searchTerm) params.set('searchTerm', searchTerm)
    if (status && status !== 'all') params.set('statusFilter', status)
    params.set('sortBy', sortBy)
    params.set('page', '1')
    window.history.replaceState({}, '', `?${params.toString()}`)
  }

  const handleSortChange = (field: string) => {
    setSortBy(field)
    const params = new URLSearchParams()
    if (searchTerm) params.set('searchTerm', searchTerm)
    if (statusFilter && statusFilter !== 'all') params.set('statusFilter', statusFilter)
    params.set('sortBy', field)
    params.set('page', String(currentPage))
    window.history.replaceState({}, '', `?${params.toString()}`)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams()
    if (searchTerm) params.set('searchTerm', searchTerm)
    if (statusFilter && statusFilter !== 'all') params.set('statusFilter', statusFilter)
    params.set('sortBy', sortBy)
    params.set('page', String(page))
    window.history.replaceState({}, '', `?${params.toString()}`)
    
    const tableElement = document.querySelector('[data-case-table]')
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleNewVerification = () => {
    window.location.href = './upload-capture-screen.html'
  }

  if (!isClient) {
    return (
      <div className="page-body h-full overflow-y-auto min-h-0">
        <div className="space-y-8">
          <PageHeader
            title="Case Management Dashboard"
            description="Monitor all identity verification cases and system performance metrics"
            icon="LayoutDashboard"
          />
          <StatsOverview data={summaryData[0]} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CaseTable
                cases={filteredCases}
                searchTerm={searchTerm}
                statusFilter={statusFilter}
                sortBy={sortBy}
                currentPage={currentPage}
                onSearch={handleSearch}
                onStatusFilterChange={handleStatusFilterChange}
                onSortChange={handleSortChange}
                onPageChange={handlePageChange}
              />
            </div>
            <div className="space-y-6">
              <RiskDistributionChart data={riskDistribution[0]} />
              <CaseVolumeChart />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-body h-full overflow-y-auto min-h-0">
      <div className="space-y-8">
        <PageHeader
          title="Case Management Dashboard"
          description="Monitor all identity verification cases and system performance metrics"
          icon="LayoutDashboard"
          actions={
            <Button
              onClick={handleNewVerification}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              + New Verification
            </Button>
          }
        />

        <StatsOverview data={summaryData[0]} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CaseTable
              cases={filteredCases}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              sortBy={sortBy}
              currentPage={currentPage}
              onSearch={handleSearch}
              onStatusFilterChange={handleStatusFilterChange}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
            />
          </div>

          <div className="space-y-6">
            <RiskDistributionChart data={riskDistribution[0]} />
            <CaseVolumeChart />
          </div>
        </div>
      </div>
    </div>
  )
}
