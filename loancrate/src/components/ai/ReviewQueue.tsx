import { ArrowLeftIcon, ArrowRightIcon, CircleCheckIcon, FileSearchIcon, RotateCcwIcon } from 'lucide-react'
import * as React from 'react'

import { AiSuggestion } from '@/components/ai/AiSuggestion'
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator'
import { DocumentPage } from '@/components/evidence/DocumentPage'
import type { FieldReview } from '@/components/evidence/reviews'
import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Progress } from '@/components/ui/progress'
import { getDocument, type ExtractedField } from '@/data/documents'
import { prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * One-at-a-time review of pending AI suggestions (beautifului.dev "Approval
 * card"). Exceptions first: lowest confidence leads. Keyboard: A accept,
 * E modify, R reject, J skip, K back. Decisions go through the shared
 * field-review state, so the viewer and Data tab stay in sync.
 */

/** Pending fields, lowest confidence first. */
export function reviewOrder(fields: ExtractedField[], isPending: (f: ExtractedField) => boolean): ExtractedField[] {
  return fields.filter(isPending).sort((a, b) => a.confidence - b.confidence)
}

const CROP_W = 520
const CROP_H = 132

export function ReviewQueue({
  fields,
  getReview,
  handlersFor,
  onShowInViewer,
  className,
}: {
  /** Fields to review, in order. Snapshotted on mount so decisions don't reshuffle. */
  fields: ExtractedField[]
  getReview: (field: ExtractedField) => FieldReview
  handlersFor: (field: ExtractedField) => Partial<React.ComponentProps<typeof AiSuggestion>>
  onShowInViewer?: (field: ExtractedField) => void
  className?: string
}) {
  const [order] = React.useState(fields)
  const [index, setIndex] = React.useState(0)
  const [direction, setDirection] = React.useState<'next' | 'prev'>('next')
  const [editSignal, setEditSignal] = React.useState(0)
  const rootRef = React.useRef<HTMLDivElement>(null)
  const advanceTimer = React.useRef<number>(undefined)

  const finished = index >= order.length
  const field = order[index]

  const go = React.useCallback(
    (to: number) => {
      window.clearTimeout(advanceTimer.current)
      setDirection(to >= index ? 'next' : 'prev')
      setIndex(Math.max(0, Math.min(order.length, to)))
    },
    [index, order.length]
  )

  // After a decision, pause on the result briefly, then advance.
  const decideThenAdvance = (fn?: () => void) => () => {
    fn?.()
    window.clearTimeout(advanceTimer.current)
    advanceTimer.current = window.setTimeout(() => go(index + 1), prefersReducedMotion() ? 0 : 420)
  }

  React.useEffect(() => () => window.clearTimeout(advanceTimer.current), [])

  const handlers = field ? handlersFor(field) : {}
  const review = field ? getReview(field) : undefined

  function onKeyDown(event: React.KeyboardEvent) {
    const target = event.target as HTMLElement
    if (target.closest('input, textarea, [role="dialog"], [data-radix-popper-content-wrapper]')) return
    if (event.metaKey || event.ctrlKey || event.altKey) return
    const key = event.key.toLowerCase()
    if (finished) return
    if (key === 'a' && review?.state === 'pending') decideThenAdvance(handlers.onAccept)()
    else if (key === 'e' && review?.state === 'pending') setEditSignal((n) => n + 1)
    else if (key === 'r' && review?.state === 'pending') decideThenAdvance(() => handlers.onReject?.())()
    else if (key === 'j') go(index + 1)
    else if (key === 'k') go(index - 1)
    else return
    event.preventDefault()
  }

  const counts = order.reduce(
    (acc, f) => {
      acc[getReview(f).state === 'pending' ? 'skipped' : getReview(f).state] += 1
      return acc
    },
    { accepted: 0, modified: 0, rejected: 0, skipped: 0, loading: 0 } as Record<string, number>
  )

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Review queue"
      role="region"
      data-slot="review-queue"
      className={cn('flex flex-col gap-3 rounded-xl border border-border bg-white p-4 focus-visible:outline-2', className)}
    >
      <div className="flex items-center gap-3">
        <p className="text-[13px] font-medium text-gray-900" aria-live="polite">
          {finished ? 'Review complete' : `${index + 1} of ${order.length}`}
        </p>
        <Progress value={(Math.min(index, order.length) / Math.max(order.length, 1)) * 100} label="Review progress" className="flex-1" />
      </div>

      {order.length === 0 ? (
        <p className="py-6 text-center text-[13px] text-gray-500">Nothing to review. Every AI suggestion has a decision.</p>
      ) : finished ? (
        <div className="flex animate-pop-in flex-col items-center gap-2 py-6 text-center">
          <CircleCheckIcon aria-hidden className="size-6 text-emerald-600" />
          <p className="font-medium text-gray-900">All {order.length} suggestions reviewed</p>
          <p className="text-[13px] text-gray-500">
            {counts.accepted} accepted · {counts.modified} modified · {counts.rejected} rejected · {counts.skipped} skipped
          </p>
          <Button size="sm" variant="secondary" className="mt-2" onClick={() => go(0)}>
            <RotateCcwIcon />
            Start over
          </Button>
        </div>
      ) : (
        field &&
        review && (
          <div key={field.id} className={cn('flex flex-col gap-3', direction === 'next' ? 'animate-slide-next' : 'animate-slide-prev')}>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">
                  {getDocument(field.docId)?.title} · p{field.region.page + 1}
                </p>
                <p className="font-medium text-gray-900">{field.label}</p>
              </div>
              <ConfidenceIndicator value={field.confidence} />
            </div>
            <EvidenceCrop field={field} />
            <AiSuggestion
              label={field.label}
              density="field"
              showLabel={false}
              {...review}
              {...handlers}
              editSignal={editSignal}
              onAccept={decideThenAdvance(handlers.onAccept)}
              onModify={(v) => decideThenAdvance(() => handlers.onModify?.(v))()}
              onReject={(r) => decideThenAdvance(() => handlers.onReject?.(r))()}
              onShowEvidence={onShowInViewer ? () => onShowInViewer(field) : undefined}
            />
          </div>
        )
      )}

      <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
        <Button size="xs" variant="ghost" disabled={index === 0} onClick={() => go(index - 1)}>
          <ArrowLeftIcon />
          Back
        </Button>
        <Button size="xs" variant="ghost" disabled={finished} onClick={() => go(index + 1)}>
          Skip
          <ArrowRightIcon />
        </Button>
        <p className="ml-auto hidden items-center gap-1.5 text-[11px] text-gray-400 sm:flex" aria-hidden>
          <Kbd>A</Kbd>
          <Kbd>E</Kbd>
          <Kbd>R</Kbd>
          <span className="mx-0.5">·</span>
          <Kbd>J</Kbd>
          <Kbd>K</Kbd>
        </p>
        <span className="sr-only">Shortcuts: A accept, E modify, R reject, J skip, K back.</span>
      </div>
    </div>
  )
}

/** A cropped window of the source page centered on the field's region. */
function EvidenceCrop({ field }: { field: ExtractedField }) {
  const doc = getDocument(field.docId)
  if (!doc) return null
  const pageH = (CROP_W * 11) / 8.5
  const r = field.region
  const cx = ((r.x + r.w / 2) / 100) * CROP_W
  const cy = ((r.y + r.h / 2) / 100) * pageH
  return (
    <div aria-hidden className="relative overflow-hidden rounded-lg border border-border bg-viewer" style={{ height: CROP_H }}>
      <div className="absolute top-1/2 left-1/2" style={{ width: CROP_W, transform: `translate(${-cx}px, ${-cy}px)` }}>
        <DocumentPage page={doc.pages[r.page]} lowQuality={doc.quality === 'low'}>
          <div
            className="absolute animate-highlight-pulse rounded-[3px] border-2 border-indigo-600 bg-indigo-400/15"
            style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
          />
        </DocumentPage>
      </div>
      <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 py-0.5 text-[11px] text-gray-500">
        <FileSearchIcon className="size-3" />
        Source
      </span>
    </div>
  )
}
