import { RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScoreBadge } from '@/components/ui/score-badge'
import { ANGLES, angleSourceIds, NEW_DATA_NOTE, stripCitations } from '@/data/clio'
import { EvidenceMeter } from '@/features/brief/AngleCards'
import { contactFor, useBrief } from '@/features/brief/BriefContext'
import { CreditsMeta } from '@/features/brief/CreditsMeta'

/** Always summarizes the recommended angle, whatever the rep last selected. */
export function BriefReadyTile() {
  const { credits, generate, generated, openBrief } = useBrief()
  const recommended = ANGLES[0]
  const lead = recommended.contacts[0]
  const contact = contactFor(lead.id)

  return (
    <>
      <p className="truncate text-base font-semibold text-slate-900" title={recommended.line}>
        {recommended.line}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
        <EvidenceMeter evidence={recommended.evidence} animated />
        <span aria-hidden>·</span>
        {angleSourceIds(recommended).length} sources
      </p>
      <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-3">
        <ScoreBadge score={contact.score} />
        <div className="min-w-0 text-body">
          <p className="truncate">
            <span className="font-semibold text-slate-900">{contact.name}</span>
            <span className="text-slate-500"> · {contact.title}</span>
          </p>
          <p className="truncate text-slate-600">{stripCitations(lead.reason)}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2">
        <Button size="sm" onClick={openBrief}>
          Open brief
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
