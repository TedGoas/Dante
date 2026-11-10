import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon, MinusIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer grid size-4 shrink-0 cursor-pointer place-items-center rounded-sm border border-slate-300 bg-white transition-colors hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-green-700 data-[state=checked]:bg-green-700 data-[state=indeterminate]:border-green-700 data-[state=indeterminate]:bg-green-700',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-white">
        {props.checked === 'indeterminate' ? (
          <MinusIcon className="size-3" strokeWidth={3} />
        ) : (
          <CheckIcon className="size-3" strokeWidth={3} />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
