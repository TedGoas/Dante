import { useTable } from '@tanstack/react-table'
import { DownloadIcon, SearchIcon, UserRoundIcon, XIcon } from 'lucide-react'

import { DataTable } from '@/components/data-table/DataTable'
import { FacetedFilter } from '@/components/data-table/FacetedFilter'
import { dataTableFeatures } from '@/components/data-table/features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loans, programs, stages, type Loan } from '@/data/loans'
import { loanColumns } from './columns'

const getRowId = (row: Loan) => row.id

export function PipelineTable({ onOpenLoan }: { onOpenLoan?: (loanId: string) => void } = {}) {
  const table = useTable({
    features: dataTableFeatures,
    columns: loanColumns,
    data: loans,
    getRowId,
    globalFilterFn: 'includesString',
    initialState: {
      sorting: [{ id: 'updated', desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
    },
  })

  const globalFilter = (table.state.globalFilter as string | undefined) ?? ''
  const isFiltered = table.state.columnFilters.length > 0 || globalFilter.length > 0
  const selectedCount = table.getSelectedRowIds().length

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-3">
      <div className="relative w-64">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-gray-400"
        />
        <Input
          type="search"
          aria-label="Search loans"
          placeholder="Search borrower or loan #"
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 rounded-lg pl-8 text-[13px]"
        />
      </div>
      <FacetedFilter column={table.getColumn('stage')!} title="Stage" options={[...stages]} />
      <FacetedFilter column={table.getColumn('program')!} title="Program" options={[...programs]} />
      {isFiltered && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter('')
          }}
        >
          Reset
          <XIcon />
        </Button>
      )}
      <div className="ml-auto flex items-center gap-2">
        {selectedCount > 0 ? (
          <>
            <span className="text-[13px] font-medium text-gray-600">{selectedCount} selected</span>
            <Button variant="secondary" size="sm">
              <UserRoundIcon />
              Reassign
            </Button>
            <Button variant="ghost" size="sm" onClick={() => table.resetRowSelection()}>
              Clear
            </Button>
          </>
        ) : (
          <Button variant="outline" size="sm">
            <DownloadIcon />
            Export
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <DataTable
      table={table}
      toolbar={toolbar}
      onRowClick={onOpenLoan ? (row) => onOpenLoan(row.id) : undefined}
    />
  )
}
