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
}: {
  cell: FieldCell
  className?: string
  valuePrefix?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-sm font-normal text-foreground',
        className
      )}
    >
      <CellBadge status={cell.status} />
      <span>
        {valuePrefix}
        {cell.value}
      </span>
    </span>
  )
}
