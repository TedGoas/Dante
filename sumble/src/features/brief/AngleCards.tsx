import { ANGLES, angleSourceIds, type Evidence } from '@/data/clio'
import { Badge } from '@/components/ui/badge'
import { useBrief } from '@/features/brief/BriefContext'
import { cn } from '@/lib/utils'

const EVIDENCE_BARS: Record<Evidence, number> = { Strong: 3, Medium: 2, Weak: 1 }

function EvidenceMeter({ evidence }: { evidence: Evidence }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="inline-flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              'w-1 rounded-[1px]',
              ['h-1.5', 'h-2', 'h-2.5'][i],
              i < EVIDENCE_BARS[evidence] ? 'bg-green-700' : 'bg-slate-200'
            )}
          />
        ))}
      </span>
      {evidence}
    </span>
  )
}

/** Native radios, so arrow keys and focus behave without extra code. */
export function AngleCards() {
  const { angle: selected, setAngleId } = useBrief()

  return (
    <div role="radiogroup" aria-label="Angles" className="grid grid-cols-3 gap-2">
      {ANGLES.map((angle, i) => (
        <label
          key={angle.id}
          className="flex cursor-pointer flex-col gap-2 rounded-lg border border-border bg-background p-3 transition-colors hover:border-slate-400 has-checked:border-green-700 has-checked:bg-selected has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
        >
          <input
            type="radio"
            name="angle"
            value={angle.id}
            checked={selected.id === angle.id}
            onChange={() => setAngleId(angle.id)}
            className="sr-only"
          />
          <span className="flex h-5 items-center">
            {i === 0 ? (
              <Badge variant="green">Recommended</Badge>
            ) : (
              <span className="text-xs text-slate-500">Option {i + 1}</span>
            )}
          </span>
          <span className="flex-1 text-body leading-snug font-semibold text-slate-900">{angle.line}</span>
          <span className="flex items-center gap-1.5 text-xs text-slate-600">
            <EvidenceMeter evidence={angle.evidence} />
            <span aria-hidden>·</span>
            {angleSourceIds(angle).length} sources
          </span>
        </label>
      ))}
    </div>
  )
}
