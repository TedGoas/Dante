import { ArrowUpRightIcon, type LucideIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

/** Overview card: icon + title + arrow link header, then content, then optional footer. */
function Card({
  icon: Icon,
  title,
  footer,
  className,
  children,
}: {
  icon: LucideIcon
  title: string
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-card border border-border bg-background', className)}>
      <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-4">
        <Icon aria-hidden className="size-4 text-slate-600" />
        <h2 className="text-body font-semibold text-slate-900">{title}</h2>
        <a href="#" aria-label={`Open ${title}`} className="ml-auto rounded-sm text-slate-600 hover:text-slate-900">
          <ArrowUpRightIcon aria-hidden className="size-4" />
        </a>
      </header>
      <div className="min-h-0 flex-1">{children}</div>
      {footer ? <div className="flex h-10 shrink-0 items-center gap-2 border-t border-border px-4">{footer}</div> : null}
    </section>
  )
}

export { Card }
