import {
  CircleCheckIcon,
  CircleDashedIcon,
  FileTextIcon,
  LoaderIcon,
  OctagonAlertIcon,
  SearchIcon,
  TagIcon,
} from 'lucide-react'
import * as React from 'react'

import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { docStatusLabel, docTypes, type DocStatus, type Document } from '@/data/documents'
import { cn } from '@/lib/utils'

const statusStyle: Record<DocStatus, { icon: React.ElementType; className: string }> = {
  processing: { icon: LoaderIcon, className: 'text-indigo-600' },
  classified: { icon: TagIcon, className: 'text-gray-500' },
  'needs-review': { icon: CircleDashedIcon, className: 'text-amber-700' },
  verified: { icon: CircleCheckIcon, className: 'text-emerald-700' },
  failed: { icon: OctagonAlertIcon, className: 'text-red-600' },
}

type Filter = 'all' | 'review' | 'issues'

/**
 * Current documents grouped by type, with status, version, and how many
 * fields still need a human. Arrow keys move between documents.
 */
export function DocumentList({
  documents,
  selectedId,
  onSelect,
  pendingCount,
}: {
  documents: Document[]
  selectedId: string
  onSelect: (docId: string) => void
  /** Fields awaiting review per doc. Defaults to seed review state. */
  pendingCount?: (doc: Document) => number
}) {
  const [filter, setFilter] = React.useState<Filter>('all')
  const [query, setQuery] = React.useState('')
  const listRef = React.useRef<HTMLDivElement>(null)
  const count = pendingCount ?? ((d: Document) => d.fields.filter((f) => f.review === 'pending').length)

  const needsReview = (d: Document) => d.status === 'needs-review' || count(d) > 0
  const issues = (d: Document) => d.status === 'failed' || d.quality === 'low'

  const visible = documents.filter((d) => {
    if (filter === 'review' && !needsReview(d)) return false
    if (filter === 'issues' && !issues(d)) return false
    const q = query.trim().toLowerCase()
    return !q || `${d.title} ${d.type} ${d.fileName}`.toLowerCase().includes(q)
  })
  const groups = docTypes.map((type) => ({ type, docs: visible.filter((d) => d.type === type) })).filter((g) => g.docs.length)

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    const items = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[data-doc-item]') ?? [])
    const index = items.indexOf(document.activeElement as HTMLButtonElement)
    if (index < 0) return
    event.preventDefault()
    items[Math.max(0, Math.min(items.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)))]?.focus()
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex flex-col gap-2 border-b border-border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[13px] font-medium tracking-normal">Documents</h2>
          <span className="text-xs text-gray-400 tabular-nums">{documents.length}</span>
        </div>
        <div className="relative">
          <SearchIcon aria-hidden className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            aria-label="Filter documents"
            placeholder="Filter documents"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 rounded-lg pl-7.5 text-[13px]"
          />
        </div>
        <div role="group" aria-label="Show" className="flex flex-wrap gap-1.5">
          <Chip pressed={filter === 'all'} onClick={() => setFilter('all')} className="h-6 px-2.5 text-xs">
            All
          </Chip>
          <Chip pressed={filter === 'review'} onClick={() => setFilter('review')} className="h-6 px-2.5 text-xs">
            Needs review {documents.filter(needsReview).length}
          </Chip>
          <Chip pressed={filter === 'issues'} onClick={() => setFilter('issues')} className="h-6 px-2.5 text-xs">
            Issues {documents.filter(issues).length}
          </Chip>
        </div>
      </div>
      <div ref={listRef} onKeyDown={onKeyDown} className="min-h-0 flex-1 overflow-y-auto p-2">
        {groups.length === 0 && <p className="px-2 py-6 text-center text-[13px] text-gray-500">No documents match.</p>}
        {groups.map((group) => (
          <section key={group.type} aria-label={group.type} className="mb-2">
            <h3 className="px-2 pt-1.5 pb-1 text-[11px] font-medium tracking-normal text-gray-400">{group.type}</h3>
            <ul>
              {group.docs.map((doc) => {
                const { icon: Icon, className } = statusStyle[doc.status]
                const pending = count(doc)
                const selected = doc.id === selectedId
                return (
                  <li key={doc.id}>
                    <button
                      type="button"
                      data-doc-item
                      aria-current={selected || undefined}
                      onClick={() => onSelect(doc.id)}
                      className={cn(
                        'flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-left',
                        selected ? 'bg-gray-100' : 'hover:bg-gray-50'
                      )}
                    >
                      <FileTextIcon aria-hidden className="mt-0.5 size-4 shrink-0 text-gray-400" />
                      <span className="min-w-0 flex-1">
                        <span className={cn('block truncate text-[13px]', selected ? 'font-medium text-gray-900' : 'text-gray-700')}>
                          {doc.title}
                        </span>
                        <span className={cn('mt-0.5 flex flex-wrap items-center gap-x-1 text-[11px] whitespace-nowrap', className)}>
                          <Icon aria-hidden className={cn('size-3', doc.status === 'processing' && 'animate-spin')} />
                          {docStatusLabel[doc.status]}
                          <span className="text-gray-400">
                            · v{doc.version} · {doc.pages.length}p
                          </span>
                          {doc.quality === 'low' && <span className="basis-full pl-4 text-amber-700">Low-quality scan</span>}
                        </span>
                      </span>
                      {pending > 0 && (
                        <span className="mt-0.5 rounded-full bg-ai-soft px-1.5 text-[11px] leading-[18px] font-medium text-ai tabular-nums">
                          {pending}
                          <span className="sr-only"> fields to review</span>
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

/** Small-screen document picker. */
export function DocumentPicker({ documents, selectedId, onSelect }: { documents: Document[]; selectedId: string; onSelect: (id: string) => void }) {
  return (
    <Select aria-label="Document" value={selectedId} onChange={(e) => onSelect(e.target.value)} className="[&_select]:h-8 [&_select]:rounded-lg [&_select]:text-[13px]">
      {documents.map((d) => (
        <option key={d.id} value={d.id}>
          {d.title} · {docStatusLabel[d.status]}
        </option>
      ))}
    </Select>
  )
}
