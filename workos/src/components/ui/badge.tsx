import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-none border-0 px-0 py-0 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        secondary: 'text-muted-foreground',
        outline: 'text-foreground',
        pass: 'text-nyse-pass',
        warning: 'text-nyse-warn',
        fail: 'text-nyse-fail',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
