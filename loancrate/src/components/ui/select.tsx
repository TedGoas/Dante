import { ChevronDownIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

/** Native <select> styled to match Input. No extra dependency. */
function Select({ className, children, ...props }: React.ComponentProps<'select'>) {
  return (
    <div data-slot="select" className={cn('relative w-full', className)}>
      <select
        className="h-9 w-full cursor-pointer appearance-none rounded-xl border border-border bg-background pr-9 pl-3 text-sm text-gray-900 outline-none transition-colors hover:border-gray-300 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 aria-invalid:border-red-500"
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-gray-400"
      />
    </div>
  )
}

export { Select }
