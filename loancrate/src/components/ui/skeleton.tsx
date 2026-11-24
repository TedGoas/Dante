import type * as React from 'react'

import { cn } from '@/lib/utils'

/** Loading placeholder. Pulses; static under reduced motion (global rule). */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return <div aria-hidden data-slot="skeleton" className={cn('animate-pulse rounded-md bg-gray-200/70', className)} {...props} />
}

export { Skeleton }
