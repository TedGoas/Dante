import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Tooltip } from '@/components/ui/tooltip'

/** Icon-only button with a required accessible label, shown as a tooltip. */
function IconButton({
  label,
  size = 'icon-sm',
  variant = 'ghost',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'aria-label'> & { label: string }) {
  return (
    <Tooltip content={label}>
      <Button aria-label={label} size={size} variant={variant} {...props} />
    </Tooltip>
  )
}

export { IconButton }
