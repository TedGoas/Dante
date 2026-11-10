import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-border bg-background px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus-visible:border-green-600 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-green-600/15',
        className
      )}
      {...props}
    />
  )
}

export { Input }
