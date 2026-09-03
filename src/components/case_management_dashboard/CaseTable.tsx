
import React from 'react'
import type { VerificationCaseData } from '@/data/VerificationCaseData'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import StatusBadge from '@/components/common/StatusBadge'
import SafeIcon from '@/components/common/SafeIcon'
import { cn } from '@/lib/utils'

interface CaseTableProps {
  cases: VerificationCaseData[]
  searchTerm: string
  statusFilter: string
  sortBy: string
  currentPage: number
  onSearch: (term: string) => void
  onStatusFilterChange: (status: string) => void
  onSortChange: (field: string) => void
  onPageChange: (page: number) => void
}

const ITEMS_PER_PAGE = 10

export default function CaseTable({
  cases,
  searchTerm,
  statusFilter,
  sortBy,
  currentPage,
  onSearch,
  onStatusFilterChange,
  onSortChange,
  onPageChange,
}: CaseTableProps) {
  const totalPages = Math.ceil(cases.length / ITEMS_PER_PAGE)
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCases = cases.slice(startIdx, startIdx + ITEMS_PER_PAGE)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  const handleCaseClick = (caseId: string) => {
    window.location.href = `./case-details-view.html?caseId=${encodeURIComponent(caseId)}`
  }

  const handleActionClick = (caseId: string) => {
    window.location.href = `./case-details-view.html?caseId=${encodeURIComponent(caseId)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="surface-raised flex flex-col h-full" data-case-table>
      {/* Filter Bar */}
      <div className="card-padding border-b border-border flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-64">
          <Input
            placeholder="Search by Case ID or Applicant Name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="h-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="CLEAR">Clear</SelectItem>
            <SelectItem value="REVIEW">Review</SelectItem>
            <SelectItem value="HIGH RISK">High Risk</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Newest First</SelectItem>
            <SelectItem value="riskScore">Risk Score (High)</SelectItem>
            <SelectItem value="applicantName">Applicant Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      {paginatedCases.length > 0 ? (
        <>
          <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50 z-10">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="w-32 whitespace-nowrap">Case ID</TableHead>
                  <TableHead className="w-40 whitespace-nowrap">Applicant Name</TableHead>
                  <TableHead className="w-28 whitespace-nowrap">Document Type</TableHead>
                  <TableHead className="w-24 whitespace-nowrap text-right">Risk Score</TableHead>
                  <TableHead className="w-28 whitespace-nowrap">Status</TableHead>
                  <TableHead className="w-40 whitespace-nowrap">Date</TableHead>
                  <TableHead className="w-20 whitespace-nowrap text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCases.map((caseItem) => (
                  <TableRow
                    key={caseItem.id}
                    className="table-row-hover border-b border-border/50"
                  >
                    <TableCell className="font-mono text-sm text-primary cursor-pointer hover:underline" onClick={() => handleCaseClick(caseItem.caseId)}>
                      {caseItem.caseId}
                    </TableCell>
                    <TableCell className="text-item-title">{caseItem.applicantName}</TableCell>
                    <TableCell className="text-caption">{caseItem.documentTypeId.replace('doc-', '').replace('-', ' ')}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'font-bold text-sm',
                          caseItem.riskScore < 40 && 'risk-low',
                          caseItem.riskScore >= 40 && caseItem.riskScore < 70 && 'risk-medium',
                          caseItem.riskScore >= 70 && 'risk-high'
                        )}
                      >
                        {caseItem.riskScore}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={
                          caseItem.status === 'CLEAR'
                            ? 'CLEAR'
                            : caseItem.status === 'REVIEW'
                              ? 'REVIEW'
                              : 'HIGH_RISK'
                        }
                        size="sm"
                      />
                    </TableCell>
                    <TableCell className="text-caption">{formatDate(caseItem.createdAt)}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleActionClick(caseItem.caseId)}
                        title="View case details"
                      >
                        <SafeIcon name="ChevronRight" size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="card-padding border-t border-border flex flex-wrap gap-3 items-center justify-between">
            <span className="text-caption whitespace-nowrap shrink-0">
              Showing {startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, cases.length)} of {cases.length} cases
            </span>

            <div className="flex-1 min-w-0 flex justify-end">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                      className={cn(
                        currentPage === 1 && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => onPageChange(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {totalPages > 5 && (
                    <PaginationItem>
                      <span className="px-1.5 py-2 text-muted-foreground">...</span>
                    </PaginationItem>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                      className={cn(
                        currentPage === totalPages && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <SafeIcon name="SearchX" size={48} className="mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No cases found</h3>
            <p className="text-caption max-w-sm mx-auto">
              Try adjusting your search filters or check back later for new verification cases.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
