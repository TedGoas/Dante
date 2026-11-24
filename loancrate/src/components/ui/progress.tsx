import { Loader2Icon, SparklesIcon } from 'lucide-react'
import type * as React from 'react'

import { useElapsed } from '@/lib/motion'
import { cn } from '@/lib/utils'

/** Spinner with a screen-reader label. Static under reduced motion. */
function Spinner({ label = 'Loading', className }: { label?: string; className?: string }) {
  return (
    <span role="status" className={cn('inline-flex items-center', className)}>
      <Loader2Icon aria-hidden className="size-4 animate-spin text-gray-400" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Determinate bar when `value` is set (0–100), indeterminate otherwise. */
function Progress({
  value,
  label,
  tone = 'neutral',
  className,
}: {
  value?: number
  label: string
  tone?: 'neutral' | 'ai'
  className?: string
}) {
  const fill = tone === 'ai' ? 'bg-indigo-500' : 'bg-primary'
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={value === undefined ? undefined : 0}
      aria-valuemax={value === undefined ? undefined : 100}
      aria-valuenow={value}
      className={cn('relative h-1.5 w-full overflow-hidden rounded-full bg-gray-100', className)}
    >
      {value === undefined ? (
        <div className={cn('absolute inset-y-0 w-2/5 animate-indeterminate rounded-full', fill)} />
      ) : (
        <div className={cn('h-full rounded-full transition-[width] duration-300 ease-quint', fill)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      )}
    </div>
  )
}

/**
 * "AI is working" status line with shimmer text and an optional elapsed
 * timer ("Reading page 2 of 3 · 4s"), after beautifului.dev's loading state.
 * Lives in an aria-live region so label changes are announced; the timer
 * itself is aria-hidden so it isn't read every second.
 */
function AiWorking({
  children,
  running = true,
  elapsed = false,
  className,
}: {
  children: React.ReactNode
  running?: boolean
  /** Show seconds since this mounted (or since `running` became true). */
  elapsed?: boolean
  className?: string
}) {
  const seconds = useElapsed(running && elapsed)
  return (
    <p className={cn('inline-flex items-center gap-1.5 text-[13px] font-medium text-ai', className)}>
      <SparklesIcon aria-hidden className={cn('size-3.5 shrink-0', running && 'animate-pulse')} />
      <span aria-live="polite" className={cn(running && 'shimmer-text')}>
        {children}
      </span>
      {elapsed && running && (
        <span aria-hidden className="font-normal text-gray-400 tabular-nums">
          · {seconds}s
        </span>
      )}
    </p>
  )
}

export { Spinner, Progress, AiWorking }
