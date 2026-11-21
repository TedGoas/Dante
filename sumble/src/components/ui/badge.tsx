import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium leading-4 [&_svg]:size-3',
  {
    variants: {
      variant: {
        neutral: 'bg-slate-100 text-slate-700',
        outline: 'border border-slate-200 bg-white text-slate-700',
        green: 'bg-green-100 text-green-900',
        blue: 'bg-sky-100 text-sky-900',
        violet: 'bg-violet-100 text-violet-900',
        amber: 'bg-amber-100 text-amber-900',
        rose: 'bg-rose-100 text-rose-900',
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

export { Badge, badgeVariants, type BadgeVariant }
