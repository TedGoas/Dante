import * as React from 'react'

import { BeforeGeneration } from '@/features/brief/BeforeGeneration'
import { useBrief } from '@/features/brief/BriefContext'
import { BriefReadyTile } from '@/features/brief/BriefReadyTile'
import { Generating } from '@/features/brief/Generating'
import { cn } from '@/lib/utils'

export type TileSize = 'tile' | 'page'

/** One card for all three states. Fixed height on Overview so the grid doesn't jump. */
export function BriefTile({ size = 'tile' }: { size?: TileSize }) {
  const { status } = useBrief()
  const ref = React.useRef<HTMLElement>(null)
  const previousStatus = React.useRef(status)

  // Generate and Refresh unmount the button that had focus. Keep focus in the card.
  React.useEffect(() => {
    if (status === 'generating' && previousStatus.current !== 'generating') ref.current?.focus()
    previousStatus.current = status
  }, [status])

  return (
    <section
      ref={ref}
      data-brief-tile
      tabIndex={-1}
      aria-label="Intelligence brief"
      className={cn(
        'flex flex-col rounded-card border border-border bg-background p-4',
        size === 'tile' ? 'h-[280px]' : 'min-h-[320px] p-6'
      )}
    >
      {status === 'idle' ? <BeforeGeneration size={size} /> : null}
      {status === 'generating' ? <Generating /> : null}
      {status === 'ready' ? <BriefReadyTile /> : null}
    </section>
  )
}
