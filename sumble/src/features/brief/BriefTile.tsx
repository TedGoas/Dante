import { SparklesIcon } from 'lucide-react'
import * as React from 'react'

import { Card } from '@/components/ui/card'
import { BeforeGeneration } from '@/features/brief/BeforeGeneration'
import { useBrief } from '@/features/brief/BriefContext'
import { BriefReadyTile } from '@/features/brief/BriefReadyTile'
import { Generating } from '@/features/brief/Generating'
import { cn } from '@/lib/utils'

export type TileSize = 'tile' | 'page'

/** One card for all three states. Fixed height on Overview so the grid doesn't jump. */
export function BriefTile({ size = 'tile' }: { size?: TileSize }) {
  const { status, generated, finishedAt } = useBrief()
  const ref = React.useRef<HTMLElement>(null)
  const previousStatus = React.useRef(status)

  // Generate and Refresh unmount the button that had focus. Keep focus in the card.
  React.useEffect(() => {
    if (status === 'generating' && previousStatus.current !== 'generating') ref.current?.focus()
    previousStatus.current = status
  }, [status])

  const generatedLabel = generated === 'days' ? 'Generated 3 days ago · free to reopen' : 'Generated just now'
  const asideText = { idle: null, generating: 'about 20 seconds', ready: generatedLabel }[status]

  return (
    <Card
      ref={ref}
      data-brief-tile
      tabIndex={-1}
      aria-label="Intelligence brief"
      icon={SparklesIcon}
      title={status === 'generating' ? 'Generating brief' : 'Intelligence brief'}
      aside={asideText ? <span className="text-xs text-slate-500">{asideText}</span> : null}
      className={cn(
        size === 'page' && 'min-h-[300px]',
        size === 'tile' && 'overflow-hidden transition-[height] duration-300 ease-quint',
        size === 'tile' && (status === 'ready' ? 'h-[384px]' : 'h-[264px]')
      )}
    >
      <div key={`${status}-${finishedAt}`} className={cn('flex flex-1 animate-fade-up flex-col', size === 'tile' ? 'p-5' : 'p-6')}>
        {status === 'idle' ? <BeforeGeneration size={size} /> : null}
        {status === 'generating' ? <Generating /> : null}
        {status === 'ready' ? <BriefReadyTile /> : null}
      </div>
    </Card>
  )
}
