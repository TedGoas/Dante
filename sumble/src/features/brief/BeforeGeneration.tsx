import { InfoIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { COVERAGE } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import type { TileSize } from '@/features/brief/BriefTile'
import { CreditsMeta } from '@/features/brief/CreditsMeta'
import { ExampleModal } from '@/features/brief/ExampleModal'
import { cn } from '@/lib/utils'

function DataDot({ level }: { level: 'full' | 'limited' }) {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className="size-2.5 shrink-0 text-slate-600">
      <circle cx="5" cy="5" r="4.25" fill={level === 'full' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" />
      {level === 'limited' ? <path d="M5 .75a4.25 4.25 0 0 0 0 8.5z" fill="currentColor" /> : null}
    </svg>
  )
}

export function BeforeGeneration({ size }: { size: TileSize }) {
  const { credits, generate } = useBrief()
  const [exampleOpen, setExampleOpen] = React.useState(false)
  const outOfCredits = credits < 1

  return (
    <>
      <h3 className={cn('font-semibold tracking-tight text-slate-900', size === 'page' ? 'text-2xl' : 'text-xl')}>
        See the angle, who to call, and when
      </h3>
      <ul className="mt-3 flex flex-col gap-1.5 text-body text-slate-600">
        {COVERAGE.map((item) => (
          <li key={item.text} className="flex h-5 items-center gap-2">
            <DataDot level={item.level} />
            <span className="sr-only">{item.level === 'full' ? 'Strong data:' : 'Limited data:'}</span>
            {item.text}
            {item.level === 'limited' ? (
              <IconButton label="Filled dot: strong data. Half dot: limited data." className="size-5">
                <InfoIcon />
              </IconButton>
            ) : null}
          </li>
        ))}
      </ul>
      <div className={cn('mt-auto flex items-center gap-2', size === 'page' && 'pt-6')}>
        <Button size="sm" disabled={outOfCredits} onClick={generate}>
          Generate · 1 credit
        </Button>
        <Button size="sm" variant="outline" onClick={() => setExampleOpen(true)}>
          See example
        </Button>
        <CreditsMeta />
      </div>
      <ExampleModal open={exampleOpen} onClose={() => setExampleOpen(false)} />
    </>
  )
}
