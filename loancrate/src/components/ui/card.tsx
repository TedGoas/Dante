import * as React from 'react'

import { cn } from '@/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'section'>) {
  return (
    <section
      data-slot="card"
      className={cn('rounded-2xl border border-border bg-white shadow-card', className)}
      {...props}
    />
  )
}

export { Card }
