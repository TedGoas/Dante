import type { CellData, Header, RowData } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/lib/utils'
import type { DataTableFeatures } from './features'

/** Header label that cycles sort on click; the `<th>` carries `aria-sort`. */
export function SortableHeader<TData extends RowData, TValue extends CellData>({
  header,
  children,
  align = 'left',
}: {
  header: Header<DataTableFeatures, TData, TValue>
  children: React.ReactNode
  align?: 'left' | 'right'
}) {
  const column = header.column
  if (!column.getCanSort()) return <>{children}</>

  const sorted = column.getIsSorted()
  const Icon =
    sorted === 'asc' ? ArrowUpIcon : sorted === 'desc' ? ArrowDownIcon : ChevronsUpDownIcon

  return (
    <button
      type="button"
      onClick={column.getToggleSortingHandler()}
      className={cn(
        'group -mx-1.5 inline-flex cursor-pointer items-center gap-1 rounded px-1.5 py-1 transition-colors hover:bg-slate-200/60 hover:text-slate-900',
        sorted && 'text-slate-900',
        align === 'right' && 'flex-row-reverse'
      )}
    >
      {children}
      <Icon
        aria-hidden
        className={cn(
          'size-3.5 shrink-0',
          sorted ? 'text-green-700' : 'text-slate-300 group-hover:text-slate-500'
        )}
      />
    </button>
  )
}
