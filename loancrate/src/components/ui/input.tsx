import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type = 'text', ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      type={type}
      className={cn(
        'h-9 w-full min-w-0 rounded-xl border border-border bg-background px-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus-visible:border-blue-500 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 aria-invalid:border-red-500 aria-invalid:focus-visible:ring-red-500/15',
        className
      )}
      {...props}
    />
  )
}

export { Input }
