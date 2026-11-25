import * as React from 'react'

import { useGlide } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * Small single-choice toggle group (zoom, view modes). The selected pill
 * glides between options. Buttons use aria-pressed inside a labelled group.
 */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
  size = 'sm',
  className,
}: {
  label: string
  value: T
  options: { value: T; label: React.ReactNode }[]
  onChange: (value: T) => void
  size?: 'xs' | 'sm'
  className?: string
}) {
  const groupRef = React.useRef<HTMLDivElement>(null)
  const glide = useGlide()

  React.useLayoutEffect(() => {
    glide.moveTo(groupRef.current?.querySelector<HTMLElement>('[aria-pressed="true"]'))
  }, [value, glide.moveTo])

  return (
    <div ref={groupRef} role="group" aria-label={label} className={cn('relative flex rounded-lg border border-border p-0.5', className)}>
      <span aria-hidden className={cn(glide.className, 'rounded-md bg-primary')} style={glide.style} />
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'relative z-10 cursor-pointer rounded-md px-2 font-medium transition-colors duration-150',
              size === 'xs' ? 'h-6 text-xs' : 'h-6.5 text-xs',
              selected ? 'text-white' : 'text-gray-600 hover:text-gray-900'
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
