import { Check, X } from 'lucide-react'

import type { CellStatus, FieldCell } from '@/data/validationRows'
import { cn } from '@/lib/utils'

function CellBadge({ status }: { status: CellStatus }) {
  const ok = status === 'ok'

  return (
    <span
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-status',
        ok
          ? 'bg-status-ok-bg text-status-ok-fg'
          : 'bg-status-fail-bg text-status-fail-fg'
      )}
      aria-hidden="true"
    >
      {ok ? (
        <Check size={12} strokeWidth={2.5} />
      ) : (
        <X size={12} strokeWidth={2.5} />
      )}
    </span>
  )
}

export function FieldStatusCell({
  cell,
  className,
  valuePrefix,
  onValueClick,
}: {
  cell: FieldCell
  className?: string
  valuePrefix?: string
  onValueClick?: () => void
}) {
  const displayValue = (
    <>
      {valuePrefix}
      {cell.value}
    </>
  )

  const valueClassName = cn(
    'border-b border-dotted leading-none',
    onValueClick
      ? 'cursor-pointer border-foreground/45 p-0 text-left hover:border-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1'
      : 'border-transparent'
  )

  return (
    <span
      className={cn(
        'flex h-5 items-center gap-2 text-sm font-normal leading-none text-foreground',
        className
      )}
    >
      <CellBadge status={cell.status} />
      {onValueClick ? (
        <button type="button" onClick={onValueClick} className={valueClassName}>
          {displayValue}
        </button>
      ) : (
        <span className={valueClassName}>{displayValue}</span>
      )}
    </span>
  )
}
