import type { ValidationStatus } from '@/data/validationRows'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<ValidationStatus, string> = {
  pass: 'Pass',
  warning: 'Warning',
  fail: 'Fail',
}

function StatusIcon({ status }: { status: ValidationStatus }) {
  if (status === 'pass') {
    return (
      <span
        className="inline-flex size-6 shrink-0 items-center justify-center border border-[#7cb896] bg-[#d8eedf]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16" className="size-3.5 text-[#1f7a45]" fill="none">
          <path
            d="M3.5 8.2 6.4 11l6.1-6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }

  if (status === 'warning') {
    return (
      <span
        className="inline-flex size-6 shrink-0 items-center justify-center border border-[#c4a574] bg-[#f3e6d0]"
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
          <path
            d="M8 2.2 14.2 13.2H1.8L8 2.2Z"
            fill="#8a5a1c"
            stroke="#8a5a1c"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <path
            d="M8 6.2v3.2"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.2" r="0.85" fill="white" />
        </svg>
      </span>
    )
  }

  return (
    <span
      className="inline-flex size-6 shrink-0 items-center justify-center border border-[#d48a84] bg-[#f6d9d6]"
      aria-hidden="true"
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
        <circle cx="8" cy="8" r="6" fill="#c9372c" />
        <path
          d="M8 4.6v4"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.1" r="0.9" fill="white" />
      </svg>
    </span>
  )
}

export function StatusCell({
  status,
  className,
}: {
  status: ValidationStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-sm font-normal normal-case tracking-normal text-foreground',
        className
      )}
    >
      <StatusIcon status={status} />
      {STATUS_LABEL[status]}
    </span>
  )
}

export function StatusLegend() {
  const items: ValidationStatus[] = ['pass', 'warning', 'fail']

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-sm font-bold text-foreground">Legend</h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((status) => (
          <li key={status}>
            <StatusCell status={status} />
          </li>
        ))}
      </ul>
    </div>
  )
}
