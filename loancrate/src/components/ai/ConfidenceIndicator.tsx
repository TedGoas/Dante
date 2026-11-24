import { CircleCheckIcon, OctagonAlertIcon, TriangleAlertIcon } from 'lucide-react'

import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { confidenceLabel, confidenceLevel } from './confidence'

const styles = {
  high: { icon: CircleCheckIcon, text: 'text-emerald-700', short: 'High' },
  medium: { icon: TriangleAlertIcon, text: 'text-amber-700', short: 'Medium' },
  low: { icon: OctagonAlertIcon, text: 'text-red-600', short: 'Low' },
}

/**
 * Confidence as icon + text, never color alone. `compact` shows only the icon
 * (with a tooltip and sr-only text) for dense table cells.
 */
export function ConfidenceIndicator({
  value,
  variant = 'full',
  className,
}: {
  value: number
  variant?: 'full' | 'compact'
  className?: string
}) {
  const level = confidenceLevel(value)
  const { icon: Icon, text, short } = styles[level]
  const pct = `${Math.round(value * 100)}%`
  const label = `${confidenceLabel[level]}, ${pct}`

  if (variant === 'compact') {
    return (
      <Tooltip content={label}>
        <span tabIndex={0} className={cn('inline-flex items-center rounded-sm', text, className)}>
          <Icon aria-hidden className="size-3.5" />
          <span className="sr-only">{label}</span>
        </span>
      </Tooltip>
    )
  }

  return (
    <span className={cn('inline-flex items-center gap-1 text-xs font-medium whitespace-nowrap', text, className)}>
      <Icon aria-hidden className="size-3.5 shrink-0" />
      {short}
      <span className="font-normal tabular-nums opacity-80">{pct}</span>
      <span className="sr-only">confidence</span>
    </span>
  )
}
