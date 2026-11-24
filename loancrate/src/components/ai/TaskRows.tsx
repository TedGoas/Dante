import { CircleCheckIcon, ClockIcon, FileUpIcon, Loader2Icon, OctagonAlertIcon, RefreshCwIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { Task, TaskStatus } from '@/data/uploads'
import { prefersReducedMotion, useElapsed } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * Live task status rows (beautifului.dev "Task rows"): uploads being
 * classified and extracted. Status is icon + words; running rows show
 * progress and elapsed time. Failed rows offer Retry.
 */

const meta: Record<TaskStatus, { icon: React.ElementType; label: string; className: string }> = {
  queued: { icon: ClockIcon, label: 'Queued', className: 'text-gray-500' },
  running: { icon: Loader2Icon, label: 'Extracting', className: 'text-ai' },
  done: { icon: CircleCheckIcon, label: 'Done', className: 'text-emerald-700' },
  failed: { icon: OctagonAlertIcon, label: 'Failed', className: 'text-red-600' },
}

export function TaskRows({
  tasks,
  onRetry,
  compact = false,
  className,
}: {
  tasks: Task[]
  onRetry?: (id: string) => void
  compact?: boolean
  className?: string
}) {
  return (
    <ul data-slot="task-rows" className={cn('flex flex-col', className)}>
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} onRetry={onRetry} compact={compact} />
      ))}
    </ul>
  )
}

function TaskRow({ task, onRetry, compact }: { task: Task; onRetry?: (id: string) => void; compact: boolean }) {
  const m = meta[task.status]
  const Icon = m.icon
  const seconds = useElapsed(task.status === 'running')
  return (
    <li className={cn('flex items-start gap-2.5 border-b border-gray-100 last:border-0', compact ? 'py-2' : 'py-2.5')}>
      <FileUpIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-[13px] text-gray-900">{task.name}</span>
          <span className={cn('ml-auto inline-flex shrink-0 items-center gap-1 text-xs font-medium', m.className)} aria-live="polite">
            <Icon aria-hidden className={cn('size-3.5', task.status === 'running' && 'animate-spin')} />
            {m.label}
            {task.status === 'running' && (
              <span className="font-normal text-gray-400 tabular-nums">
                {task.progress ?? 0}% · {seconds}s
              </span>
            )}
          </span>
        </div>
        {task.status === 'running' && <Progress value={task.progress ?? 0} tone="ai" label={`${task.name} progress`} className="mt-1.5 h-1" />}
        {task.detail && !compact && <p className={cn('mt-0.5 text-xs', task.status === 'failed' ? 'text-red-600' : 'text-gray-500')}>{task.detail}</p>}
        {task.detail && compact && task.status === 'failed' && <p className="mt-0.5 text-xs text-red-600">{task.detail}</p>}
        {task.status === 'failed' && onRetry && (
          <Button size="xs" variant="outline" className="mt-1.5" onClick={() => onRetry(task.id)}>
            <RefreshCwIcon />
            Retry
          </Button>
        )}
      </div>
    </li>
  )
}

/**
 * Demo driver: advances running tasks, then starts the next queued one.
 * Retrying a failed task succeeds. Under reduced motion it jumps to the
 * finished state.
 */
export function useSimulatedTasks(seed: Task[], { tickMs = 450 }: { tickMs?: number } = {}) {
  const [tasks, setTasks] = React.useState(seed)

  React.useEffect(() => {
    if (prefersReducedMotion()) {
      setTasks((list) => list.map((t) => (t.status === 'failed' ? t : { ...t, status: 'done', progress: 100 })))
      return
    }
    const timer = window.setInterval(() => {
      setTasks((list) => {
        let next = list.map((t) => {
          if (t.status !== 'running') return t
          const progress = Math.min(100, (t.progress ?? 0) + 6 + ((t.name.length * 7) % 9))
          return progress >= 100 ? { ...t, status: 'done' as const, progress: 100 } : { ...t, progress }
        })
        if (!next.some((t) => t.status === 'running')) {
          const i = next.findIndex((t) => t.status === 'queued')
          if (i >= 0) next = next.map((t, j) => (j === i ? { ...t, status: 'running' as const, progress: 0 } : t))
        }
        return next
      })
    }, tickMs)
    return () => window.clearInterval(timer)
  }, [tickMs])

  const retry = (id: string) =>
    setTasks((list) =>
      list.map((t) =>
        t.id === id ? { ...t, status: list.some((x) => x.status === 'running') ? 'queued' : 'running', progress: 0, detail: 'Retrying with the unlocked copy' } : t
      )
    )
  const reset = () => setTasks(seed)

  return { tasks, retry, reset }
}
