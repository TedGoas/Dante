import { SparklesIcon } from 'lucide-react'

import type { HistoryEntry } from '@/data/conditions'
import { longDateTime, relativeTime } from '@/lib/seed'
import { cn } from '@/lib/utils'

export type ActivityEntry = HistoryEntry & { conditionTitle?: string }

/**
 * Audit trail: who did what, when, and why. AI and human actors are always
 * distinguishable by avatar shape, an "AI" label, and text (not color alone).
 */
export function ActivityLog({
  entries,
  compact = false,
  emptyMessage = 'No activity yet.',
  className,
}: {
  entries: ActivityEntry[]
  compact?: boolean
  emptyMessage?: string
  className?: string
}) {
  if (!entries.length) return <p className="py-6 text-center text-[13px] text-gray-500">{emptyMessage}</p>
  return (
    <ol data-slot="activity-log" className={cn('flex flex-col', className)}>
      {entries.map((entry, i) => {
        const ai = entry.actor.kind === 'ai'
        const last = i === entries.length - 1
        return (
          <li key={entry.id} className="relative flex gap-3 pb-4">
            {!last && <span aria-hidden className="absolute top-7 bottom-0 left-3 w-px bg-gray-200" />}
            <Avatar entry={entry} />
            <div className="min-w-0 flex-1 pt-0.5 text-[13px] leading-5">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{entry.actor.name}</span>
                {ai ? (
                  <span className="ml-1.5 rounded bg-ai-soft px-1 py-px text-[10px] font-semibold tracking-wide text-ai">AI</span>
                ) : (
                  entry.actor.kind === 'human' && <span className="text-gray-400"> · {entry.actor.role}</span>
                )}
              </p>
              <p className="text-gray-700">
                {entry.action}
                {!compact && entry.conditionTitle && <span className="text-gray-400"> · {entry.conditionTitle}</span>}
              </p>
              {entry.note && (
                <p className="mt-1 border-l-2 border-gray-200 pl-2.5 text-gray-600">{entry.note}</p>
              )}
              <time dateTime={entry.at.toISOString()} title={longDateTime.format(entry.at)} className="mt-0.5 block text-xs text-gray-400">
                {relativeTime(entry.at)}
              </time>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Avatar({ entry }: { entry: ActivityEntry }) {
  if (entry.actor.kind === 'ai') {
    return (
      <span aria-hidden className="relative z-10 grid size-6 shrink-0 place-items-center rounded-md border border-ai-border bg-ai-soft text-ai">
        <SparklesIcon className="size-3.5" />
      </span>
    )
  }
  const initials = entry.actor.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
  return (
    <span aria-hidden className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-700">
      {initials}
    </span>
  )
}
