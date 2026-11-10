import { ArrowUpRightIcon, type LucideIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Overview card: icon + title header, then content, then optional footer.
 * `aside` replaces the default arrow link. Pass null to show nothing there.
 */
function Card({
  icon: Icon,
  title,
  aside,
  footer,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<'section'>, 'title'> & {
  icon: LucideIcon
  title: string
  aside?: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <section className={cn('flex min-w-0 flex-col rounded-card border border-border bg-background', className)} {...props}>
      <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-5">
        <Icon aria-hidden className="size-4 text-slate-500" />
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <div className="ml-auto flex items-center">
          {aside === undefined ? (
            <a href="#" aria-label={`Open ${title}`} className="rounded-sm text-slate-500 hover:text-slate-900">
              <ArrowUpRightIcon aria-hidden className="size-4" />
            </a>
          ) : (
            aside
          )}
        </div>
      </header>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {footer ? <div className="flex h-10 shrink-0 items-center gap-2 border-t border-border px-5">{footer}</div> : null}
    </section>
  )
}

export { Card }
