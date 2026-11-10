import { Badge } from '@/components/ui/badge'
import { ANGLES, angleSourceIds, type Evidence } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { cn } from '@/lib/utils'

const EVIDENCE_BARS: Record<Evidence, number> = { Strong: 3, Medium: 2, Weak: 1 }

export function EvidenceMeter({ evidence, animated = false }: { evidence: Evidence; animated?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span aria-hidden className="inline-flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={animated ? { animationDelay: `${i * 50}ms` } : undefined}
            className={cn(
              'w-1 origin-bottom rounded-[1px]',
              ['h-1.5', 'h-2', 'h-2.5'][i],
              i < EVIDENCE_BARS[evidence] ? 'bg-green-700' : 'bg-slate-200',
              animated && 'animate-grow-bar'
            )}
          />
        ))}
      </span>
      {evidence}
    </span>
  )
}

/** Compact selectors. Native radios, so arrow keys and focus behave without extra code. */
export function AngleCards() {
  const { angle: selected, setAngleId } = useBrief()

  return (
    <div role="radiogroup" aria-label="Angles" className="grid grid-cols-3 gap-2">
      {ANGLES.map((angle, i) => {
        const isSelected = selected.id === angle.id
        return (
          <label
            key={angle.id}
            className="flex cursor-pointer flex-col gap-1 rounded-card border border-border bg-background px-3 py-2.5 transition-colors duration-150 ease-quint hover:border-slate-400 has-checked:border-green-700 has-checked:bg-selected has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
          >
            <input
              type="radio"
              name="angle"
              value={angle.id}
              checked={isSelected}
              onChange={() => setAngleId(angle.id)}
              className="sr-only"
            />
            <span className="flex h-5 items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-slate-900">{angle.short}</span>
              {i === 0 ? <Badge variant="green">Recommended</Badge> : null}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-600">
              <EvidenceMeter key={String(isSelected)} evidence={angle.evidence} animated={isSelected} />
              <span aria-hidden>·</span>
              {angleSourceIds(angle).length} sources
            </span>
          </label>
        )
      })}
    </div>
  )
}
