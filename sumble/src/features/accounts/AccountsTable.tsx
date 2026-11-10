import { useTable } from '@tanstack/react-table'
import { DownloadIcon, ListPlusIcon, SearchIcon, XIcon } from 'lucide-react'

import { DataTable } from '@/components/data-table/DataTable'
import { FacetedFilter } from '@/components/data-table/FacetedFilter'
import { dataTableFeatures } from '@/components/data-table/features'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { accounts, industries, technologies, type Account } from '@/data/accounts'
import { accountColumns } from './columns'

const getRowId = (row: Account) => row.id

export function AccountsTable() {
  const table = useTable({
    features: dataTableFeatures,
    columns: accountColumns,
    data: accounts,
    getRowId,
    globalFilterFn: 'includesString',
    initialState: {
      sorting: [{ id: 'signalScore', desc: true }],
      pagination: { pageIndex: 0, pageSize: 15 },
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
          className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-slate-400"
        />
        <Input
          type="search"
          aria-label="Search accounts"
          placeholder="Search accounts…"
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="h-8 pl-8 text-[13px]"
        />
      </div>
      <FacetedFilter column={table.getColumn('industry')!} title="Industry" options={industries} />
      <FacetedFilter
        column={table.getColumn('techStack')!}
        title="Tech stack"
        options={technologies}
      />
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
            <span className="text-[13px] font-medium text-slate-600">
              {selectedCount} selected
            </span>
            <Button variant="outline" size="sm">
              <ListPlusIcon />
              Add to list
            </Button>
            <Button size="sm" onClick={() => table.resetRowSelection()} variant="ghost">
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

  return <DataTable table={table} toolbar={toolbar} />
}
