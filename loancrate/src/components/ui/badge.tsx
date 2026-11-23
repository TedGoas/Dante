import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/* Pill shape from the "New" tag on loancrate.com (indigo-50 / indigo-500). */
const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium leading-4 [&_svg]:size-3',
  {
    variants: {
      variant: {
        neutral: 'bg-gray-100 text-gray-700',
        outline: 'border border-border bg-white text-gray-700',
        indigo: 'bg-indigo-50 text-indigo-600',
        blue: 'bg-blue-50 text-blue-700',
        success: 'bg-emerald-50 text-emerald-700',
        warning: 'bg-amber-50 text-amber-800',
        danger: 'bg-red-50 text-red-600',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
)

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

function Badge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { dot?: boolean }) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

export { Badge, badgeVariants, type BadgeVariant }
