import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { ScoreBadge } from '@/components/ui/score-badge'
import { CREDITS, EXAMPLE_BRIEF as EXAMPLE } from '@/data/clio'
import { EvidenceMeter } from '@/features/brief/AngleCards'
import { useBrief } from '@/features/brief/BriefContext'

const HEADING = 'text-xs font-semibold tracking-wide text-slate-600 uppercase'

export function ExampleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { credits, generate } = useBrief()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Intelligence brief · ${EXAMPLE.company}`}
      badge={<Badge variant="amber">Example: not about Clio</Badge>}
      footer={
        <>
          <Button size="sm" disabled={credits < 1} onClick={generate}>
            Generate for Clio · 1 credit
          </Button>
          <span className="ml-auto text-xs text-slate-600 tabular-nums">
            {credits} of {CREDITS.total} credits left this month
          </span>
        </>
      }
    >
      <div className="flex flex-col gap-5 p-5 text-body">
        <div className="flex flex-col gap-1">
          <h3 className={HEADING}>Recommended angle</h3>
          <p className="text-base font-semibold text-slate-900">{EXAMPLE.angle}</p>
          <p className="flex items-center gap-1.5 text-xs text-slate-600">
            <EvidenceMeter evidence={EXAMPLE.evidence} />
            <span aria-hidden>·</span>
            {EXAMPLE.sources} sources
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={HEADING}>Who to contact first</h3>
          <ul className="flex flex-col divide-y divide-slate-100">
            {EXAMPLE.contacts.map((contact) => (
              <li key={contact.name} className="flex items-center gap-3 py-2">
                <ScoreBadge score={contact.score} />
                <div className="min-w-0">
                  <p>
                    <span className="font-semibold text-slate-900">{contact.name}</span>
                    <span className="text-slate-600"> · {contact.title}</span>
                  </p>
                  <p className="text-slate-700">{contact.reason}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-1">
          <h3 className={HEADING}>Why now</h3>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-slate-700 marker:text-slate-400">
            {EXAMPLE.whyNow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </Dialog>
  )
}
