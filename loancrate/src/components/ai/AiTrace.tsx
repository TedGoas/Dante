import {
  ArrowRightLeftIcon,
  CheckIcon,
  ChevronDownIcon,
  FilePlus2Icon,
  FileSearchIcon,
  Loader2Icon,
  OctagonAlertIcon,
  PencilLineIcon,
  ScanTextIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TagIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import * as React from 'react'

import type { Evidence } from '@/data/conditions'
import type { TraceStep, TraceStepKind } from '@/data/traces'
import { MOTION, useReveal } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * Step-by-step trace of what the AI did (beautifului.dev "Thinking").
 * Collapsed by default to a one-line summary; `live` reveals steps one at a
 * time with the running step shimmering. Change `runKey` to replay.
 */

const kindIcon: Record<TraceStepKind, React.ElementType> = {
  classify: TagIcon,
  rename: PencilLineIcon,
  replace: ArrowRightLeftIcon,
  extract: ScanTextIcon,
  check: ShieldCheckIcon,
  create: FilePlus2Icon,
  request: SendIcon,
}

const statusMeta = {
  done: { icon: CheckIcon, text: 'Done', className: 'text-emerald-600' },
  warning: { icon: TriangleAlertIcon, text: 'Needs attention', className: 'text-amber-600' },
  failed: { icon: OctagonAlertIcon, text: 'Failed', className: 'text-red-600' },
}

const seconds = (ms: number) => `${(ms / 1000).toFixed(ms < 1000 ? 2 : 1)}s`

export function AiTrace({
  steps,
  title = 'AI review',
  live = false,
  runKey,
  defaultOpen = false,
  onShowEvidence,
  className,
}: {
  steps: TraceStep[]
  title?: string
  live?: boolean
  runKey?: unknown
  defaultOpen?: boolean
  onShowEvidence?: (evidence: Evidence) => void
  className?: string
}) {
  const { count, done } = useReveal(steps.length, { stepMs: MOTION.traceStepMs, running: live, runKey })
  const shown = live ? steps.slice(0, count) : steps
  const running = live && !done ? steps[count] : undefined
  const total = steps.reduce((sum, s) => sum + s.ms, 0)
  const issues = steps.filter((s) => s.status !== 'done').length
  const [open, setOpen] = React.useState(defaultOpen || live)

  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      data-slot="ai-trace"
      className={cn('group rounded-xl border border-border bg-white text-[13px]', className)}
    >
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-3 py-2.5 [&::-webkit-details-marker]:hidden">
        <SparklesIcon aria-hidden className="size-3.5 shrink-0 text-ai" />
        <span className="font-medium text-gray-900">{title}</span>
        <span className="truncate text-gray-500" aria-live="polite">
          {running ? (
            <span className="shimmer-text">{running.label}…</span>
          ) : (
            <>
              {steps.length} steps · {seconds(total)}
              {issues > 0 && (
                <span className="ml-1.5 inline-flex items-center gap-1 text-amber-700">
                  <TriangleAlertIcon aria-hidden className="size-3" />
                  {issues} to check
                </span>
              )}
            </>
          )}
        </span>
        <ChevronDownIcon aria-hidden className="ml-auto size-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <ol className="flex flex-col px-3 pb-3">
        {shown.map((step, i) => {
          const Kind = kindIcon[step.kind]
          const status = statusMeta[step.status]
          const StatusIcon = status.icon
          const last = i === shown.length - 1 && !running
          return (
            <li key={step.id} className={cn('relative flex gap-2.5 pb-3', live && 'animate-fade-up')}>
              {!last && <span aria-hidden className="absolute top-6 bottom-0 left-[11px] w-px bg-gray-200" />}
              <span aria-hidden className="relative z-10 grid size-6 shrink-0 place-items-center rounded-md border border-border bg-white text-gray-500">
                <Kind className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="flex items-start gap-1.5">
                  <span className="text-gray-900">{step.label}</span>
                  <StatusIcon aria-hidden className={cn('mt-0.5 size-3.5 shrink-0', status.className)} />
                  <span className="sr-only">({status.text})</span>
                  <span className="ml-auto shrink-0 text-xs text-gray-400 tabular-nums">{seconds(step.ms)}</span>
                </p>
                {step.detail && <p className="mt-0.5 text-xs text-gray-500">{step.detail}</p>}
                {step.evidence && onShowEvidence && (
                  <button
                    type="button"
                    onClick={() => onShowEvidence(step.evidence!)}
                    className="mt-1 inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-link hover:text-link-hover hover:underline"
                  >
                    <FileSearchIcon aria-hidden className="size-3" />
                    View
                  </button>
                )}
              </div>
            </li>
          )
        })}
        {running && (
          <li className="flex items-center gap-2.5">
            <span aria-hidden className="grid size-6 place-items-center rounded-md border border-ai-border bg-ai-soft text-ai">
              <Loader2Icon className="size-3.5 animate-spin" />
            </span>
            <span className="shimmer-text">{running.label}…</span>
          </li>
        )}
      </ol>
    </details>
  )
}
