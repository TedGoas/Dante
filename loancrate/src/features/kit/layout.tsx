import type * as React from 'react'

import { cn } from '@/lib/utils'

export function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[73px]">
      <div className="mb-5 border-b border-border pb-3">
        <h2 id={`${id}-title`} className="text-xl">
          {title}
        </h2>
        {description && <p className="mt-1 text-gray-500">{description}</p>}
      </div>
      {children}
    </section>
  )
}

export function Specimen({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] items-baseline gap-6 border-b border-gray-100 py-4 last:border-0">
      <span className="text-xs text-gray-400">{label}</span>
      <div className="min-w-0">{children}</div>
    </div>
  )
}

/** A labelled cell in a side-by-side state grid. */
export function StateCell({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <span className="text-xs text-gray-400">{label}</span>
      {children}
    </div>
  )
}
