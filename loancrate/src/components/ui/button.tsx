import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

/*
 * Matches the Accept / Modify buttons in the loancrate.com product mockup:
 * 36px, rounded-xl, near-black primary, lavender-bordered secondary, soft
 * purple-tinted shadow on both.
 */
const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-sm font-medium leading-4 transition duration-150 ease-quint active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'border border-primary bg-primary text-primary-foreground shadow-button hover:bg-primary-hover',
        secondary:
          'border border-secondary-border bg-white text-secondary-foreground shadow-button hover:bg-gray-50',
        outline: 'border border-border bg-white text-gray-800 hover:bg-gray-50',
        ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
        destructive:
          'border border-red-200 bg-white text-red-600 hover:border-red-300 hover:bg-red-50',
        dashed:
          'border border-dashed border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-900',
        link: 'h-auto! px-0! text-link underline-offset-4 hover:text-link-hover hover:underline',
      },
      size: {
        default: 'h-9 px-4',
        sm: 'h-8 rounded-lg px-3 text-[13px]',
        xs: 'h-6.5 gap-1 rounded-md px-2 text-xs [&_svg]:size-3',
        icon: 'size-9',
        'icon-sm': 'size-8 rounded-lg [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
