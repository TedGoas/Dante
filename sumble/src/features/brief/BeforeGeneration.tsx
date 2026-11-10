import { InfoIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { COVERAGE, CREDITS } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import type { TileSize } from '@/features/brief/BriefTile'
import { ExampleModal } from '@/features/brief/ExampleModal'
import { HowCalculated } from '@/features/brief/HowCalculated'
import { TileLabel } from '@/features/brief/TileLabel'
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
      <TileLabel label="Intelligence brief" />
      <h2 className={cn('mt-2 font-semibold tracking-tight text-slate-900', size === 'page' ? 'text-2xl' : 'text-xl')}>
        See the angle, who to call, and when
      </h2>
      <ul className="mt-2.5 flex flex-col gap-1 text-body text-slate-700">
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
      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" disabled={outOfCredits} onClick={generate}>
          Generate · 1 credit
        </Button>
        <Button size="sm" variant="outline" onClick={() => setExampleOpen(true)}>
          See example
        </Button>
      </div>
      <div className="mt-auto flex items-center gap-2 border-t border-border pt-3 text-xs text-slate-600 tabular-nums">
        {outOfCredits ? (
          <span>
            <span className="font-medium text-slate-900">You're out of credits</span>
            {' · '}
            <a href="#" className="rounded-sm font-medium text-green-700 underline-offset-4 hover:underline">
              Get more credits
            </a>
          </span>
        ) : (
          <span>
            {credits} of {CREDITS.total} credits left this month
          </span>
        )}
        <span aria-hidden className="h-3 w-px bg-slate-300" />
        <HowCalculated />
      </div>
      <ExampleModal open={exampleOpen} onClose={() => setExampleOpen(false)} />
    </>
  )
}
