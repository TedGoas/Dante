import type * as React from 'react'

import { cn } from '@/lib/utils'

function EmptyState({
  icon,
  title,
  body,
  action,
  className,
  tone = 'neutral',
}: {
  icon?: React.ReactNode
  title: string
  body?: React.ReactNode
  action?: React.ReactNode
  className?: string
  tone?: 'neutral' | 'danger'
}) {
  return (
    <div data-slot="empty-state" className={cn('flex flex-col items-center px-6 py-10 text-center', className)}>
      {icon && (
        <div
          aria-hidden
          className={cn(
            'mb-3 grid size-10 place-items-center rounded-xl border [&_svg]:size-5',
            tone === 'danger' ? 'border-red-100 bg-red-50 text-red-600' : 'border-border bg-gray-50 text-gray-400'
          )}
        >
          {icon}
        </div>
      )}
      <p className="font-medium text-gray-900">{title}</p>
      {body && <p className="mt-1 max-w-sm text-[13px] text-gray-500">{body}</p>}
      {action && <div className="mt-4 flex gap-2">{action}</div>}
    </div>
  )
}

export { EmptyState }
