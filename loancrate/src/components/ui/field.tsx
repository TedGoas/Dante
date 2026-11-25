import * as React from 'react'

import { cn } from '@/lib/utils'

function Label({ className, ...props }: React.ComponentProps<'label'>) {
  return (
    <label
      data-slot="label"
      className={cn('text-[13px] font-medium text-gray-900', className)}
      {...props}
    />
  )
}

/**
 * Label + control + help or error text. Pass the control's id as `htmlFor`;
 * the control should set `aria-describedby={`${htmlFor}-hint`}`.
 */
function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  className,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  optional?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div data-slot="field" className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {optional && <span className="ml-1 font-normal text-gray-400">Optional</span>}
      </Label>
      {children}
      {(error || hint) && (
        <p
          id={`${htmlFor}-hint`}
          className={cn('text-xs', error ? 'text-red-600' : 'text-gray-500')}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  )
}

export { Field, Label }
