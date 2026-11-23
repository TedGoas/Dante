import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-20 w-full min-w-0 rounded-xl border border-border bg-background px-3 py-2 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus-visible:border-blue-500 focus-visible:ring-3 focus-visible:ring-blue-500/15 disabled:cursor-not-allowed disabled:bg-gray-50 aria-invalid:border-red-500',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
