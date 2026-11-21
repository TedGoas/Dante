import type { ReactTable, RowData } from '@tanstack/react-table'
import { ChevronLeftIcon, ChevronRightIcon, SearchXIcon } from 'lucide-react'
import type * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import type { DataTableFeatures } from './features'

export type DataTableColumnMeta = {
  align?: 'left' | 'right'
  /** Tailwind width class for the column, e.g. `w-12`. */
  width?: string
}

/**
 * Renders any table built with `dataTableFeatures`. Toolbar and filters are
 * passed in so each page can compose its own.
 */
export function DataTable<TData extends RowData>({
  table,
  toolbar,
  emptyMessage = 'No results match these filters.',
}: {
  table: ReactTable<DataTableFeatures, TData>
  toolbar?: React.ReactNode
  emptyMessage?: string
}) {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  return (
    <div
      data-slot="data-table"
      className="overflow-hidden rounded-xl border border-border bg-white shadow-card"
    >
      {toolbar}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id} className="hover:bg-transparent">
              {group.headers.map((header) => {
                const meta = header.column.columnDef.meta as DataTableColumnMeta | undefined
                const sorted = header.column.getIsSorted()
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={
                      sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined
                    }
                    className={cn(meta?.width, meta?.align === 'right' && 'text-right')}
                  >
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() ? 'selected' : undefined}
              >
                {row.getAllCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as DataTableColumnMeta | undefined
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(meta?.align === 'right' && 'text-right')}
                    >
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columnCount} className="py-16 text-center">
                <div className="flex flex-col items-center gap-2 text-slate-500">
                  <SearchXIcon className="size-5 text-slate-400" aria-hidden />
                  {emptyMessage}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table} />
    </div>
  )
}

function DataTablePagination<TData extends RowData>({
  table,
}: {
  table: ReactTable<DataTableFeatures, TData>
}) {
  const { pageIndex, pageSize } = table.state.pagination
  const total = table.getFilteredRowModel().rows.length
  const first = total === 0 ? 0 : pageIndex * pageSize + 1
  const last = Math.min(total, (pageIndex + 1) * pageSize)
  const selectedCount = table.getSelectedRowIds().length

  return (
    <div className="flex items-center justify-between gap-4 border-t border-border bg-slate-50 px-4 py-2.5 text-[13px] text-slate-500">
      <span>
        {selectedCount > 0 ? `${selectedCount} selected · ` : ''}
        <span className="tabular-nums">
          {first}–{last}
        </span>{' '}
        of <span className="tabular-nums">{total}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
