import { XIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

/**
 * Toggle chip (filters, quick choices). `pressed` drives aria-pressed.
 * Pass `onRemove` for a removable applied-filter chip instead.
 */
function Chip({
  pressed,
  onRemove,
  className,
  children,
  ...props
}: React.ComponentProps<'button'> & { pressed?: boolean; onRemove?: () => void }) {
  const base =
    'inline-flex h-7 items-center gap-1.5 rounded-full border text-[13px] font-medium transition-colors [&_svg]:size-3.5'

  if (onRemove) {
    return (
      <span
        data-slot="chip"
        className={cn(base, 'border-indigo-100 bg-indigo-50 pr-1 pl-3 text-indigo-700', className)}
      >
        {children}
        <button
          type="button"
          aria-label={`Remove ${typeof children === 'string' ? children : 'filter'}`}
          onClick={onRemove}
          className="grid size-5 cursor-pointer place-items-center rounded-full text-indigo-400 hover:bg-indigo-100 hover:text-indigo-700"
        >
          <XIcon />
        </button>
      </span>
    )
  }

  return (
    <button
      type="button"
      data-slot="chip"
      aria-pressed={pressed}
      className={cn(
        base,
        'cursor-pointer px-3',
        pressed
          ? 'border-primary bg-primary text-white'
          : 'border-border bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { Chip }
