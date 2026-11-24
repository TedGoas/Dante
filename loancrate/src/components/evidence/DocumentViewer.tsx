import {
  ChevronLeftIcon,
  ChevronRightIcon,
  FileWarningIcon,
  RefreshCwIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from 'lucide-react'
import * as React from 'react'

import { AiSuggestion } from '@/components/ai/AiSuggestion'
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator'
import { CONFIDENCE } from '@/components/ai/confidence'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { IconButton } from '@/components/ui/icon-button'
import { AiWorking, Progress } from '@/components/ui/progress'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { docStatusLabel, versionsOf, type Document, type ExtractedField } from '@/data/documents'
import { shortDate } from '@/lib/seed'
import { cn } from '@/lib/utils'
import { DocumentPage } from './DocumentPage'
import { useFieldReviews, type FieldReview } from './reviews'

/*
 * Evidence viewer: a fake document page with highlight overlays for every
 * extracted field, plus a side list of those fields with AI review actions.
 *
 * Focus a field from outside with either the `activeFieldId` prop or the
 * imperative handle: `viewerRef.current.focusField(id)`. Focusing switches to
 * the right page, scrolls the region into view, and pulses it (no pulse under
 * reduced motion).
 */

export type DocumentViewerHandle = { focusField: (fieldId: string) => void }

type Zoom = 'fit' | '100' | '150'
const zoomWidth: Record<Zoom, string> = { fit: 'w-full max-w-[880px]', '100': 'w-[816px]', '150': 'w-[1224px]' }

export type DocumentViewerProps = {
  document: Document
  /** Override the state derived from document.status (useful for demos). */
  state?: 'ready' | 'loading' | 'failed'
  activeFieldId?: string | null
  onActiveFieldChange?: (fieldId: string | null) => void
  /** Called with the selected version's document id. */
  onVersionChange?: (docId: string) => void
  onRetry?: () => void
  /** Shared review state. Omit to keep reviews local to the viewer. */
  getReview?: (field: ExtractedField) => FieldReview
  reviewHandlers?: (field: ExtractedField) => Partial<React.ComponentProps<typeof AiSuggestion>>
  showFieldList?: boolean
  ref?: React.Ref<DocumentViewerHandle>
  className?: string
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function DocumentViewer({
  document: doc,
  state,
  activeFieldId: activeProp,
  onActiveFieldChange,
  onVersionChange,
  onRetry,
  getReview,
  reviewHandlers,
  showFieldList = true,
  ref,
  className,
}: DocumentViewerProps) {
  const [page, setPage] = React.useState(0)
  const [zoom, setZoom] = React.useState<Zoom>('fit')
  const [activeLocal, setActiveLocal] = React.useState<string | null>(null)
  const [pulse, setPulse] = React.useState(0)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const highlightRefs = React.useRef(new Map<string, HTMLButtonElement>())
  const local = useFieldReviews()
  const review = getReview ?? local.get
  const handlers = reviewHandlers ?? local.handlersFor

  const active = activeProp !== undefined ? activeProp : activeLocal
  const resolved = state ?? (doc.status === 'processing' ? 'loading' : doc.status === 'failed' ? 'failed' : 'ready')
  const versions = versionsOf(doc)
  const pageCount = doc.pages.length
  const pageFields = doc.fields.filter((f) => f.region.page === page)

  // New document: back to page 1, nothing active.
  React.useEffect(() => {
    setPage(0)
    setActiveLocal(null)
  }, [doc.id])

  const focusField = React.useCallback(
    (fieldId: string) => {
      const field = doc.fields.find((f) => f.id === fieldId)
      if (!field) return
      setPage(field.region.page)
      setActiveLocal(fieldId)
      setPulse((n) => n + 1)
      onActiveFieldChange?.(fieldId)
    },
    [doc.fields, onActiveFieldChange]
  )

  React.useImperativeHandle(ref, () => ({ focusField }), [focusField])

  // Controlled focus from the parent.
  React.useEffect(() => {
    if (!activeProp) return
    const field = doc.fields.find((f) => f.id === activeProp)
    if (!field) return
    setPage(field.region.page)
    setPulse((n) => n + 1)
  }, [activeProp, doc.fields])

  // Scroll the active highlight into view inside the viewer (never the page).
  React.useEffect(() => {
    if (!active) return
    const frame = requestAnimationFrame(() => {
      const el = highlightRefs.current.get(active)
      const box = scrollRef.current
      if (!el || !box) return
      const a = el.getBoundingClientRect()
      const b = box.getBoundingClientRect()
      box.scrollTo({
        top: box.scrollTop + (a.top - b.top) - b.height / 2 + a.height / 2,
        left: box.scrollLeft + (a.left - b.left) - b.width / 2 + a.width / 2,
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      })
    })
    return () => cancelAnimationFrame(frame)
  }, [active, pulse, page, zoom])

  const pending = doc.fields.filter((f) => review(f).state === 'pending').length

  return (
    <section
      aria-label={`Document viewer: ${doc.title}`}
      data-slot="document-viewer"
      className={cn('flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-white', className)}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <div className="mr-auto flex min-w-0 items-center gap-2">
          <h2 className="truncate text-sm font-medium tracking-normal">{doc.title}</h2>
          <span className="hidden truncate text-xs text-gray-400 sm:inline">{doc.fileName}</span>
        </div>
        {versions.length > 1 && (
          <Select
            aria-label="Document version"
            value={doc.id}
            onChange={(e) => onVersionChange?.(e.target.value)}
            disabled={!onVersionChange}
            className="w-auto [&_select]:h-8 [&_select]:rounded-lg [&_select]:text-[13px]"
          >
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                v{v.version} · {v.superseded ? 'superseded' : 'current'} · {shortDate.format(v.uploadedAt)}
              </option>
            ))}
          </Select>
        )}
        {resolved === 'ready' && (
          <>
            <div className="flex items-center gap-0.5" role="group" aria-label="Pages">
              <IconButton label="Previous page" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeftIcon />
              </IconButton>
              <span className="min-w-[78px] text-center text-xs text-gray-600 tabular-nums" aria-live="polite">
                Page {page + 1} of {pageCount}
              </span>
              <IconButton label="Next page" disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)}>
                <ChevronRightIcon />
              </IconButton>
            </div>
            <div role="group" aria-label="Zoom" className="flex rounded-lg border border-border p-0.5">
              {(['fit', '100', '150'] as Zoom[]).map((z) => (
                <button
                  key={z}
                  type="button"
                  aria-pressed={zoom === z}
                  onClick={() => setZoom(z)}
                  className={cn(
                    'h-6.5 cursor-pointer rounded-md px-2 text-xs font-medium',
                    zoom === z ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {z === 'fit' ? 'Fit' : `${z}%`}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {doc.superseded && (
        <Banner tone="neutral" icon={<FileWarningIcon />}>
          You’re viewing a superseded version (v{doc.version}). AI uses the current version.
        </Banner>
      )}
      {doc.quality === 'low' && resolved === 'ready' && (
        <Banner tone="warning" icon={<TriangleAlertIcon />}>
          <strong className="font-medium">Low-quality scan.</strong> Verify values against the image before accepting.
        </Banner>
      )}

      <div className="flex min-h-0 flex-1">
        {/* Page area */}
        <div ref={scrollRef} className="relative min-h-0 min-w-0 flex-1 overflow-auto bg-viewer p-5">
          {resolved === 'loading' && <LoadingPage pages={pageCount} />}
          {resolved === 'failed' && (
            <div className="mx-auto max-w-md rounded-xl border border-border bg-white">
              <EmptyState
                tone="danger"
                icon={<FileWarningIcon />}
                title="Couldn’t read this document"
                body={doc.failureReason ?? 'Extraction failed.'}
                action={
                  <>
                    <Button size="sm" variant="secondary" onClick={onRetry}>
                      <RefreshCwIcon />
                      Retry extraction
                    </Button>
                  </>
                }
              />
            </div>
          )}
          {resolved === 'ready' && (
            <div className={cn('mx-auto', zoomWidth[zoom])}>
              <DocumentPage page={doc.pages[page]} lowQuality={doc.quality === 'low'}>
                {pageFields.map((field) => {
                  const isActive = active === field.id
                  const low = field.confidence < CONFIDENCE.medium
                  const r = field.region
                  return (
                    <button
                      key={isActive ? `${field.id}-${pulse}` : field.id}
                      ref={(el) => {
                        if (el) highlightRefs.current.set(field.id, el)
                        else highlightRefs.current.delete(field.id)
                      }}
                      type="button"
                      aria-label={`${field.label}: ${review(field).value}`}
                      aria-pressed={isActive}
                      onClick={() => focusField(field.id)}
                      style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
                      className={cn(
                        'absolute cursor-pointer rounded-[3px] border transition-colors',
                        low ? 'border-dashed border-amber-500 bg-amber-300/15' : 'border-indigo-400/60 bg-indigo-400/10',
                        'hover:bg-indigo-400/20',
                        isActive && 'animate-highlight-pulse border-2 border-indigo-600 bg-indigo-400/20'
                      )}
                    />
                  )
                })}
              </DocumentPage>
            </div>
          )}
        </div>

        {/* Extracted fields */}
        {showFieldList && (
          <aside aria-label="Extracted fields" className="flex w-[300px] shrink-0 flex-col border-l border-border">
            <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
              <SparklesIcon aria-hidden className="size-3.5 text-ai" />
              <h3 className="text-[13px] font-medium tracking-normal">Extracted fields</h3>
              {resolved === 'ready' && doc.fields.length > 0 && (
                <span className="ml-auto text-xs text-gray-500" aria-live="polite">
                  {pending ? `${pending} to review` : 'All reviewed'}
                </span>
              )}
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {resolved === 'loading' && (
                <div className="flex flex-col gap-4 p-3.5">
                  <AiWorking>Reading {pageCount} pages…</AiWorking>
                  <Progress label="Extraction progress" tone="ai" />
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex flex-col gap-1.5">
                      <Skeleton className="h-2.5 w-20" />
                      <Skeleton className="h-3.5 w-40" />
                    </div>
                  ))}
                </div>
              )}
              {resolved === 'failed' && <p className="p-3.5 text-[13px] text-gray-500">No fields. Extraction failed.</p>}
              {resolved === 'ready' && doc.fields.length === 0 && (
                <p className="p-3.5 text-[13px] text-gray-500">No fields extracted from this document type.</p>
              )}
              {resolved === 'ready' && (
                <ul className="flex flex-col">
                  {doc.fields.map((field) => {
                    const isActive = active === field.id
                    return (
                      <li
                        key={field.id}
                        className={cn('border-b border-gray-100 px-3.5 py-3', isActive && 'bg-ai-soft/70')}
                      >
                        <div className="mb-1.5 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => focusField(field.id)}
                            aria-current={isActive || undefined}
                            className="min-w-0 flex-1 cursor-pointer truncate rounded text-left text-xs text-gray-500 hover:text-gray-900"
                          >
                            {field.label}
                            <span className="text-gray-400"> · p{field.region.page + 1}</span>
                          </button>
                          <ConfidenceIndicator value={field.confidence} />
                        </div>
                        <AiSuggestion
                          label={field.label}
                          density="field"
                          showLabel={false}
                          {...review(field)}
                          {...handlers(field)}
                          onShowEvidence={() => focusField(field.id)}
                        />
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </aside>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {docStatusLabel[doc.status]}
      </p>
    </section>
  )
}

function Banner({ tone, icon, children }: { tone: 'warning' | 'neutral'; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 border-b px-3.5 py-2 text-[13px] [&>svg]:size-4 [&>svg]:shrink-0',
        tone === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-border bg-gray-50 text-gray-600'
      )}
    >
      {icon}
      <span>{children}</span>
    </p>
  )
}

function LoadingPage({ pages }: { pages: number }) {
  return (
    <div className="mx-auto flex w-full max-w-[880px] flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="indigo">
          <SparklesIcon />
          Processing
        </Badge>
        <span className="text-xs text-gray-500">Classifying and extracting {pages} pages</span>
      </div>
      <div className="aspect-[8.5/11] w-full bg-white p-[8%] shadow-[0_1px_3px_rgba(12,38,77,0.12)]">
        <Skeleton className="mb-6 h-6 w-1/2" />
        {Array.from({ length: 14 }, (_, i) => (
          <Skeleton key={i} className="mb-3 h-2.5" style={{ width: `${65 + ((i * 29) % 35)}%` }} />
        ))}
      </div>
    </div>
  )
}
