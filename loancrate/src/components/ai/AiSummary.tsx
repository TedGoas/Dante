import { FastForwardIcon, FileSearchIcon, RotateCcwIcon, SparklesIcon } from 'lucide-react'
import * as React from 'react'

import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator'
import { Button } from '@/components/ui/button'
import type { Evidence } from '@/data/conditions'
import { getDocument, getField } from '@/data/documents'
import type { LoanSummary } from '@/data/summaries'
import { MOTION, useReveal } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * Streamed AI summary with inline citations and source cards
 * (beautifului.dev "Streaming text" + "Context cards"). Streams word by word
 * with a caret; citations open the evidence. Reduced motion shows the full
 * text at once. Screen readers get the final text once, not every word.
 */

type Token = { kind: 'text'; text: string } | { kind: 'cite'; n: number }

function tokenize(summary: LoanSummary): Token[] {
  return summary.segments.flatMap<Token>((seg) =>
    typeof seg === 'string'
      ? seg.split(/(\s+)/).filter(Boolean).map((text) => ({ kind: 'text', text }))
      : [{ kind: 'cite', n: seg.cite }]
  )
}

export function AiSummary({
  summary,
  title = 'AI summary',
  onShowEvidence,
  showSources = true,
  className,
}: {
  summary: LoanSummary
  title?: string
  onShowEvidence?: (evidence: Evidence) => void
  showSources?: boolean
  className?: string
}) {
  const tokens = React.useMemo(() => tokenize(summary), [summary])
  const [runKey, setRunKey] = React.useState(0)
  const { count, done, skip } = useReveal(tokens.length, { stepMs: MOTION.streamWordMs, runKey })
  const sourceTitle = (n: number) => {
    const s = summary.sources[n - 1]
    return s ? `${getDocument(s.evidence.docId)?.title ?? 'Document'} · ${s.label}` : `Source ${n}`
  }

  return (
    <section aria-label={title} data-slot="ai-summary" className={cn('rounded-xl border border-ai-border bg-ai-soft/40 p-3.5 text-[13px]', className)}>
      <div className="mb-2 flex items-center gap-2">
        <SparklesIcon aria-hidden className="size-3.5 text-ai" />
        <h3 className="text-[13px] font-medium tracking-normal">{title}</h3>
        <span className="ml-auto flex items-center gap-1">
          {done ? (
            <Button size="xs" variant="ghost" onClick={() => setRunKey((k) => k + 1)}>
              <RotateCcwIcon />
              Regenerate
            </Button>
          ) : (
            <Button size="xs" variant="ghost" onClick={skip}>
              <FastForwardIcon />
              Skip
            </Button>
          )}
        </span>
      </div>

      <p aria-busy={!done} className="leading-6 text-gray-800">
        {tokens.slice(0, count).map((t, i) =>
          t.kind === 'text' ? (
            <React.Fragment key={i}>{t.text}</React.Fragment>
          ) : (
            <button
              key={i}
              type="button"
              aria-label={`Source ${t.n}: ${sourceTitle(t.n)}`}
              title={sourceTitle(t.n)}
              onClick={() => {
                const s = summary.sources[t.n - 1]
                if (s) onShowEvidence?.(s.evidence)
              }}
              className="mx-0.5 inline-flex h-4 min-w-4 -translate-y-0.5 cursor-pointer items-center justify-center rounded bg-white px-1 align-middle text-[10px] leading-none font-semibold text-ai ring-1 ring-ai-border hover:bg-ai-soft"
            >
              {t.n}
            </button>
          )
        )}
        {!done && <span className="stream-caret" aria-hidden />}
      </p>
      <span className="sr-only" aria-live="polite">
        {done ? 'Summary ready.' : ''}
      </span>

      {showSources && done && (
        <ol aria-label="Sources" className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {summary.sources.map((s, i) => {
            const field = getField(s.evidence.fieldId)
            const doc = getDocument(s.evidence.docId)
            return (
              <li key={i} style={{ '--i': i } as React.CSSProperties} className="stagger-in">
                <button
                  type="button"
                  onClick={() => onShowEvidence?.(s.evidence)}
                  className="flex w-full cursor-pointer items-start gap-2 rounded-lg border border-border bg-white px-2.5 py-2 text-left hover:border-gray-300"
                >
                  <span className="grid size-4 shrink-0 place-items-center rounded bg-ai-soft text-[10px] font-semibold text-ai">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-gray-500">
                      {doc?.title} · p{(field?.region.page ?? 0) + 1}
                    </span>
                    <span className="block truncate font-medium text-gray-900">{field?.value ?? s.label}</span>
                  </span>
                  {field && <ConfidenceIndicator value={field.confidence} variant="compact" interactive={false} />}
                  <FileSearchIcon aria-hidden className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </section>
  )
}
