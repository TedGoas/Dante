import { RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScoreBadge } from '@/components/ui/score-badge'
import { ANGLES, angleSourceIds, NEW_DATA_NOTE, stripCitations } from '@/data/clio'
import { EvidenceMeter } from '@/features/brief/AngleCards'
import { contactFor, useBrief } from '@/features/brief/BriefContext'
import { TileLabel } from '@/features/brief/TileLabel'

/** Always summarizes the recommended angle, whatever the rep last selected. */
export function BriefReadyTile() {
  const { credits, generate, generated, openBrief } = useBrief()
  const recommended = ANGLES[0]
  const lead = recommended.contacts[0]
  const contact = contactFor(lead.id)

  return (
    <>
      <TileLabel
        label="Intelligence brief"
        detail={generated === 'days' ? 'Generated 3 days ago · free to reopen' : 'generated just now'}
      />
      <p className="mt-3 truncate text-base font-semibold text-slate-900" title={recommended.line}>
        {recommended.line}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
        <EvidenceMeter evidence={recommended.evidence} />
        <span aria-hidden>·</span>
        {angleSourceIds(recommended).length} sources
      </p>
      <div className="mt-4 flex items-center gap-3 rounded-card bg-muted p-3 text-body">
        <ScoreBadge score={contact.score} />
        <div className="min-w-0">
          <p className="truncate">
            <span className="font-semibold text-slate-900">{contact.name}</span>
            <span className="text-slate-600"> · {contact.title}</span>
          </p>
          <p className="truncate text-slate-700">{stripCitations(lead.reason)}</p>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
        <Button size="sm" onClick={openBrief}>
          Open brief
        </Button>
        <Button size="sm" variant="outline" disabled={credits < 1} onClick={generate}>
          <RefreshCwIcon />
          Refresh · 1 credit
        </Button>
        {generated === 'days' ? <span className="text-xs text-slate-600">{NEW_DATA_NOTE}</span> : null}
      </div>
    </>
  )
}
