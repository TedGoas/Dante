import type { CellData, Column, RowData } from '@tanstack/react-table'
import { CheckIcon, PlusCircleIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { DataTableFeatures } from './features'

/**
 * Multi-select filter chip for one column. Counts come from faceting, so they
 * respond to the other active filters.
 */
export function FacetedFilter<TData extends RowData, TValue extends CellData>({
  column,
  title,
  options,
}: {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
  options: string[]
}) {
  const counts = column.getFacetedUniqueValues()
  const selected = new Set((column.getFilterValue() as string[] | undefined) ?? [])

  function toggle(value: string) {
    const next = new Set(selected)
    if (next.has(value)) next.delete(value)
    else next.add(value)
    column.setFilterValue(next.size ? [...next] : undefined)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="dashed" size="sm">
          <PlusCircleIcon />
          {title}
          {selected.size > 0 && (
            <>
              <span aria-hidden className="mx-0.5 h-4 w-px bg-slate-200" />
              {selected.size > 2 ? (
                <Badge variant="green">{selected.size} selected</Badge>
              ) : (
                [...selected].map((value) => (
                  <Badge key={value} variant="green">
                    {value}
                  </Badge>
                ))
              )}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent aria-label={`Filter by ${title}`}>
        <ul data-slot="filter-menu-list" className="flex flex-col gap-0.5">
          {options.map((option) => {
            const isSelected = selected.has(option)
            return (
              <li key={option}>
                <button
                  type="button"
                  role="menuitemcheckbox"
                  aria-checked={isSelected}
                  onClick={() => toggle(option)}
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  <span
                    aria-hidden
                    className={cn(
                      'grid size-4 place-items-center rounded-sm border',
                      isSelected
                        ? 'border-green-700 bg-green-700 text-white'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {isSelected && <CheckIcon className="size-3" strokeWidth={3} />}
                  </span>
                  <span className="flex-1">{option}</span>
                  <span className="text-xs tabular-nums text-slate-400">
                    {counts.get(option) ?? 0}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        {selected.size > 0 && (
          <>
            <div className="-mx-1.5 my-1.5 h-px bg-slate-200" />
            <button
              type="button"
              onClick={() => column.setFilterValue(undefined)}
              className="w-full cursor-pointer rounded-md px-2.5 py-2 text-center text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Clear filter
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}
