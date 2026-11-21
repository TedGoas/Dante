import { RefreshCwIcon } from 'lucide-react'
import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ANGLES, angleSourceIds, BRIEF_TEASER, initials, NEW_DATA_NOTE, TIMING } from '@/data/clio'
import { AngleLaunchCard } from '@/features/brief/AngleLaunchCard'
import { contactFor, useBrief } from '@/features/brief/BriefContext'
import { CreditsMeta } from '@/features/brief/CreditsMeta'
import { cn } from '@/lib/utils'

/** The payoff: what Sumble found, with each angle as a door into the brief. */
export function BriefReadyTile() {
  const { credits, finishedAt, generate, generated, openBrief, openOutreach, setAngleId } = useBrief()
  const recommended = ANGLES[0]
  const lead = contactFor(recommended.contacts[0].id)
  const firstName = lead.name.split(' ')[0]

  // Decided once on mount, so returning to this tab never replays it.
  const [reveal] = React.useState(() => Date.now() - finishedAt < TIMING.revealWindowMs)

  function draftToLead() {
    setAngleId(recommended.id)
    openOutreach(lead)
  }

  return (
    <>
      <div className={cn('flex items-center gap-3', reveal && 'animate-fade-up')}>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold tracking-tight text-slate-900">{BRIEF_TEASER.headline}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {BRIEF_TEASER.work} · {angleSourceIds(recommended).length} sources
          </p>
        </div>
        <Avatar aria-hidden className="size-8">
          <AvatarFallback>{initials(lead.name)}</AvatarFallback>
        </Avatar>
        <Button size="sm" variant="outline" onClick={draftToLead}>
          Draft to {firstName}
        </Button>
      </div>

      <div className="mt-4 grid flex-1 grid-cols-3 gap-3">
        {ANGLES.map((angle, index) => (
          <AngleLaunchCard key={angle.id} angle={angle} index={index} recommended={index === 0} reveal={reveal} />
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Button data-brief-primary size="sm" onClick={() => openBrief()}>
          Open full brief
        </Button>
        <Button size="sm" variant="outline" disabled={credits < 1} onClick={generate}>
          <RefreshCwIcon />
          Refresh · 1 credit
        </Button>
        {generated === 'days' ? <span className="ml-1 w-[88px] text-xs text-slate-600">{NEW_DATA_NOTE}</span> : null}
        <CreditsMeta />
      </div>
    </>
  )
}
