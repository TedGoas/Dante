import type * as React from 'react'

import { cn } from '@/lib/utils'

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-md border border-gray-200 border-b-gray-300 bg-white px-1 font-sans text-[11px] font-medium text-gray-600 shadow-[0_1px_0_var(--color-gray-200)]',
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
