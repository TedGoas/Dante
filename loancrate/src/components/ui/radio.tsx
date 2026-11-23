import * as React from 'react'

import { cn } from '@/lib/utils'

/** Native radio styled to match Checkbox. Group with a <fieldset> + shared `name`. */
function Radio({ className, ...props }: Omit<React.ComponentProps<'input'>, 'type'>) {
  return (
    <input
      type="radio"
      data-slot="radio"
      className={cn(
        'peer grid size-4 shrink-0 cursor-pointer appearance-none place-items-center rounded-full border border-input bg-white transition-colors before:size-1.5 before:scale-0 before:rounded-full before:bg-white before:transition-transform before:content-[""] hover:border-gray-400 checked:border-primary checked:bg-primary checked:before:scale-100 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Radio }
