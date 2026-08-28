import { Check, X } from 'lucide-react'

import type { CellStatus, FieldCell } from '@/data/validationRows'
import { cn } from '@/lib/utils'

function CellBadge({ status }: { status: CellStatus }) {
  const ok = status === 'ok'

  return (
    <span
      className={cn(
        'inline-flex size-6 shrink-0 items-center justify-center rounded-md',
        ok ? 'bg-[#d8eedf] text-[#1f7a45]' : 'bg-[#f6d9d6] text-[#c9372c]'
      )}
      aria-hidden="true"
    >
      {ok ? (
        <Check className="size-3.5" strokeWidth={2.5} />
      ) : (
        <X className="size-3.5" strokeWidth={2.5} />
      )}
    </span>
  )
}

export function FieldStatusCell({
  cell,
  className,
}: {
  cell: FieldCell
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-sm font-normal text-foreground',
        className
      )}
    >
      <CellBadge status={cell.status} />
      <span>{cell.value}</span>
    </span>
  )
}
