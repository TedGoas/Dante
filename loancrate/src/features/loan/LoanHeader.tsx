import { ArrowLeftIcon, ClockIcon, OctagonAlertIcon, TriangleAlertIcon } from 'lucide-react'
import type * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { stageBadge, type Loan } from '@/data/loans'
import { daysUntil, money, shortDate } from '@/lib/seed'
import { cn } from '@/lib/utils'

/** Loan identity + the deadlines that drive priority (DOMAIN.md › design). */
export function LoanHeader({ loan, backHref = '#/pipeline', actions }: { loan: Loan; backHref?: string; actions?: React.ReactNode }) {
  return (
    <header className="flex flex-col gap-3 px-5 py-3.5">
      <a href={backHref} className="inline-flex w-fit items-center gap-1 rounded text-xs font-medium text-gray-500 hover:text-gray-900">
        <ArrowLeftIcon aria-hidden className="size-3.5" />
        Pipeline
      </a>
      <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl">
              {loan.borrower}
              {loan.coBorrower && <span className="text-gray-400"> & {loan.coBorrower.split(' ')[0]}</span>}
            </h1>
            <Badge variant={stageBadge[loan.stage]} dot>
              {loan.stage}
            </Badge>
          </div>
          <p className="mt-0.5 text-[13px] text-gray-500">
            <span className="font-medium text-gray-700 tabular-nums">Loan #{loan.number}</span> · {loan.propertyAddress}
          </p>
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          <Fact label="Program">
            {loan.program} · {loan.purpose}
          </Fact>
          <Fact label="Amount">
            <span className="tabular-nums">{money.format(loan.amount)}</span>
          </Fact>
          <Fact label="Processor">{loan.processor}</Fact>
          <Fact label="Underwriter">{loan.underwriter}</Fact>
          <Fact label="Closing">
            <Deadline date={loan.closingDate} noun="Closes" />
          </Fact>
          <Fact label="Rate lock">
            <Deadline date={loan.rateLockExpires} noun="Expires" />
          </Fact>
        </dl>
        {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
      </div>
    </header>
  )
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className="font-medium text-gray-900">{children}</dd>
    </div>
  )
}

/**
 * Date with urgency. ≤1 day: red + octagon. ≤3 days: amber + triangle.
 * Always icon + words, never color alone.
 */
export function Deadline({ date, noun = 'Due', className }: { date: Date; noun?: string; className?: string }) {
  const days = daysUntil(date)
  const level = days <= 1 ? 'urgent' : days <= 3 ? 'soon' : 'ok'
  const Icon = level === 'urgent' ? OctagonAlertIcon : level === 'soon' ? TriangleAlertIcon : ClockIcon
  const words =
    days < 0 ? `${noun === 'Closes' ? 'Closed' : 'Expired'} ${-days}d ago` : days === 0 ? `${noun} today` : days === 1 ? `${noun} tomorrow` : `${noun} in ${days} days`
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap',
        level === 'urgent' && 'text-red-600',
        level === 'soon' && 'text-amber-700',
        level === 'ok' && 'font-normal text-gray-700',
        className
      )}
    >
      <Icon aria-hidden className="size-3.5 shrink-0" />
      {level === 'ok' ? shortDate.format(date) : words}
      {level !== 'ok' && <span className="font-normal text-gray-400">({shortDate.format(date)})</span>}
    </span>
  )
}
