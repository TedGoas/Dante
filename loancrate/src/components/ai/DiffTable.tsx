import { CheckCheckIcon, CheckIcon, FileSearchIcon, RotateCcwIcon, SparklesIcon, Undo2Icon, XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import type { Evidence } from '@/data/conditions'
import type { DiffRow } from '@/data/proposals'
import { MOTION, useReveal } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * AI-proposed edits that sweep through a table (beautifului.dev "Diff
 * table"). Each changed row gets an indigo wash, the old value strikes
 * through, the new one fades in. Accept or reject per row, or all at once.
 * Reduced motion shows the finished diff immediately.
 */

type Decision = 'pending' | 'accepted' | 'rejected'

export function DiffTable({
  rows,
  title = 'AI proposed updates',
  onShowEvidence,
  onDecisionsChange,
  className,
}: {
  rows: DiffRow[]
  title?: string
  onShowEvidence?: (evidence: Evidence) => void
  onDecisionsChange?: (decisions: Record<string, Decision>) => void
  className?: string
}) {
  const changed = rows.filter((r) => r.proposed !== undefined)
  const [runKey, setRunKey] = React.useState(0)
  const { count, done } = useReveal(changed.length, { stepMs: MOTION.sweepCellMs * 3, runKey })
  const [decisions, setDecisions] = React.useState<Record<string, Decision>>({})

  const decide = (next: Record<string, Decision>) => {
    setDecisions(next)
    onDecisionsChange?.(next)
  }
  const set = (id: string, d: Decision) => decide({ ...decisions, [id]: d })
  const pending = changed.filter((r) => (decisions[r.id] ?? 'pending') === 'pending')
  const accepted = changed.filter((r) => decisions[r.id] === 'accepted').length

  return (
    <section aria-label={title} data-slot="diff-table" className={cn('overflow-hidden rounded-xl border border-border bg-white text-[13px]', className)}>
      <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
        <SparklesIcon aria-hidden className="size-3.5 text-ai" />
        <h3 className="text-[13px] font-medium tracking-normal">{title}</h3>
        <span className="text-xs text-gray-500" aria-live="polite">
          {done ? `${changed.length} changes · ${accepted} accepted` : `Proposing ${count} of ${changed.length}…`}
        </span>
        <span className="ml-auto flex gap-1">
          {done && pending.length > 0 && (
            <Button size="xs" variant="secondary" onClick={() => decide(Object.fromEntries(changed.map((r) => [r.id, decisions[r.id] === 'rejected' ? 'rejected' : 'accepted'])))}>
              <CheckCheckIcon />
              Accept all
            </Button>
          )}
          {done && (
            <IconButton
              label="Replay proposal"
              className="size-6.5"
              onClick={() => {
                decide({})
                setRunKey((k) => k + 1)
              }}
            >
              <RotateCcwIcon />
            </IconButton>
          )}
        </span>
      </div>
      <table className="w-full">
        <thead className="sr-only">
          <tr>
            <th>Field</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const changeIndex = changed.indexOf(row)
            const revealed = changeIndex >= 0 && changeIndex < count
            const decision = decisions[row.id] ?? 'pending'
            return (
              <tr key={row.id} className="border-b border-gray-100 last:border-0">
                <th scope="row" className="w-[38%] px-3 py-2 text-left align-top font-normal">
                  <span className="block text-gray-900">{row.label}</span>
                  <span className="block text-[11px] text-gray-400">{row.section}</span>
                </th>
                <td
                  key={revealed ? `r-${runKey}` : 'idle'}
                  className={cn('px-2 py-2 align-top', revealed && decision === 'pending' && 'cell-sweep')}
                >
                  {!revealed ? (
                    <span className={cn('tabular-nums', changeIndex >= 0 ? 'text-gray-900' : 'text-gray-500')}>{row.current}</span>
                  ) : decision === 'rejected' ? (
                    <span className="flex flex-col">
                      <span className="text-gray-900 tabular-nums">{row.current}</span>
                      <span className="text-xs text-gray-400 line-through">
                        <span className="sr-only">Rejected proposal: </span>
                        {row.proposed}
                      </span>
                    </span>
                  ) : (
                    <span className="flex flex-col">
                      <span className="text-xs text-gray-400 line-through tabular-nums">
                        <span className="sr-only">Was </span>
                        {row.current}
                      </span>
                      <span className={cn('animate-fade-in font-medium tabular-nums', decision === 'accepted' ? 'text-gray-900' : 'text-ai')}>
                        {decision === 'accepted' ? <CheckIcon aria-hidden className="mr-1 inline size-3.5 text-emerald-600" /> : <SparklesIcon aria-hidden className="mr-1 inline size-3" />}
                        <span className="sr-only">{decision === 'accepted' ? 'Accepted: ' : 'Proposed: '}</span>
                        {row.proposed}
                      </span>
                      {row.reason && <span className="mt-0.5 text-xs text-gray-500">{row.reason}</span>}
                    </span>
                  )}
                </td>
                <td className="w-[1%] px-2 py-1.5 align-top whitespace-nowrap">
                  {revealed && (
                    <span className="flex animate-fade-in items-center">
                      {decision === 'pending' ? (
                        <>
                          <IconButton label={`Accept change to ${row.label}`} className="size-7" onClick={() => set(row.id, 'accepted')}>
                            <CheckIcon />
                          </IconButton>
                          <IconButton label={`Reject change to ${row.label}`} className="size-7" onClick={() => set(row.id, 'rejected')}>
                            <XIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton label={`Undo decision on ${row.label}`} className="size-7" onClick={() => set(row.id, 'pending')}>
                          <Undo2Icon />
                        </IconButton>
                      )}
                      {row.evidence && onShowEvidence && (
                        <IconButton label={`Show evidence for ${row.label}`} className="size-7" onClick={() => onShowEvidence(row.evidence!)}>
                          <FileSearchIcon />
                        </IconButton>
                      )}
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
