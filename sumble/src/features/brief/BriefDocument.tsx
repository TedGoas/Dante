import { CheckIcon, CopyIcon, FlagIcon, RefreshCwIcon, Share2Icon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { ScoreBadge } from '@/components/ui/score-badge'
import { citedIds, NEW_DATA_NOTE, ORG, SOURCE_LINK_NOTE, SOURCES, TEAMS_BY_ID, TIMING, type Angle } from '@/data/clio'
import { AngleCards } from '@/features/brief/AngleCards'
import { contactFor, useBrief } from '@/features/brief/BriefContext'
import { CitedText } from '@/features/brief/Citation'
import { cn } from '@/lib/utils'

const VISIBLE_CONTACTS = 3

function Section({
  title,
  limitedSources,
  order,
  children,
}: {
  title: string
  limitedSources?: number
  /** Position in the staggered fade when the angle changes. Omit to skip the fade. */
  order?: number
  children: React.ReactNode
}) {
  const headingId = React.useId()
  return (
    <section
      aria-labelledby={headingId}
      style={order === undefined ? undefined : { animationDelay: `${order * TIMING.sectionStaggerMs}ms` }}
      className={cn('flex flex-col gap-2', order !== undefined && 'animate-fade-up')}
    >
      <div className="flex items-baseline gap-2">
        <h3 id={headingId} className="text-base font-semibold text-slate-900">
          {title}
        </h3>
        {limitedSources !== undefined ? (
          <span className="text-xs text-slate-500">
            Limited data: {limitedSources} {limitedSources === 1 ? 'source' : 'sources'}
          </span>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function CopiedIconButton({
  label,
  icon,
  getText,
}: {
  label: string
  icon: React.ReactNode
  getText: () => string
}) {
  const [copied, setCopied] = React.useState(false)
  return (
    <IconButton
      label={copied ? 'Copied' : label}
      size="icon"
      onClick={() => {
        void navigator.clipboard?.writeText(getText()).catch(() => {})
        setCopied(true)
        window.setTimeout(() => setCopied(false), TIMING.copiedMs)
      }}
    >
      {copied ? <CheckIcon /> : icon}
    </IconButton>
  )
}

function ContactRow({ id, reason, prominent }: { id: string; reason: string; prominent: boolean }) {
  const { openOutreach } = useBrief()
  const contact = contactFor(id)
  return (
    <li className="flex items-center gap-3 border-t border-slate-100 py-3">
      <ScoreBadge score={contact.score} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body">
          <a href="#" className="text-sm font-semibold text-slate-900 underline-offset-2 hover:underline">
            {contact.name}
          </a>
          <span className="text-slate-500"> · {contact.title}</span>
        </p>
        <p className="mt-0.5 text-body text-slate-600">
          <CitedText text={reason} origin="doc" />
        </p>
      </div>
      <Button size="sm" variant={prominent ? 'outline' : 'ghost'} onClick={() => openOutreach(contact)}>
        Draft outreach
      </Button>
    </li>
  )
}

function ContactList({ angle }: { angle: Angle }) {
  const [expanded, setExpanded] = React.useState(false)
  const first = angle.contacts.slice(0, VISIBLE_CONTACTS)
  const rest = angle.contacts.slice(VISIBLE_CONTACTS)

  return (
    <div>
      <ul className="flex flex-col [&>li:first-child]:border-t-0">
        {first.map((c, i) => (
          <ContactRow key={c.id} id={c.id} reason={c.reason} prominent={i === 0} />
        ))}
      </ul>
      {rest.length > 0 ? (
        <>
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-200 ease-quint',
              expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            )}
          >
            <ul inert={!expanded} className="-mx-1 flex min-h-0 flex-col overflow-hidden px-1">
              {rest.map((c) => (
                <ContactRow key={c.id} id={c.id} reason={c.reason} prominent={false} />
              ))}
            </ul>
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            className="mt-1 cursor-pointer rounded-sm text-body font-medium text-green-700 underline-offset-4 hover:underline"
          >
            {expanded ? 'Show fewer' : `Show ${rest.length} more`}
          </button>
        </>
      ) : null}
    </div>
  )
}

function SourcesList() {
  const { activeSource, flagged, toggleFlag, addedSources, addSource } = useBrief()
  const [adding, setAdding] = React.useState(false)
  const [draft, setDraft] = React.useState('')
  const allSources = [...SOURCES, ...addedSources]

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return
    addSource(title, allSources.length + 1)
    setDraft('')
    setAdding(false)
  }

  return (
    <>
      <ol className="-mx-2 flex flex-col">
        {allSources.map((source) => {
          const isFlagged = flagged.has(source.id)
          return (
            <li
              key={source.id}
              id={`source-${source.id}`}
              className={cn(
                'group flex h-8 scroll-mt-20 scroll-mb-3 items-center gap-2 rounded-md px-2 text-body text-slate-600 transition-colors duration-150 ease-quint',
                activeSource === source.id && 'bg-green-100'
              )}
            >
              <span className="w-6 shrink-0 text-xs text-slate-500 tabular-nums">[{source.id}]</span>
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium text-slate-900">{source.type}</span> ·{' '}
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    window.alert(SOURCE_LINK_NOTE)
                  }}
                  className="rounded-sm text-green-700 underline-offset-4 hover:underline"
                >
                  {source.title}
                </a>{' '}
                · <span className="text-slate-500">{source.age}</span>
              </span>
              <Button
                size="xs"
                variant="ghost"
                aria-pressed={isFlagged}
                aria-label={`${isFlagged ? 'Remove flag from' : 'Flag'} source ${source.id}`}
                onClick={() => toggleFlag(source.id)}
                className={cn(!isFlagged && 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100')}
              >
                <FlagIcon />
                {isFlagged ? 'Flagged' : null}
              </Button>
            </li>
          )
        })}
      </ol>
      {adding ? (
        <form onSubmit={submit} className="flex items-center gap-2">
          <Input
            autoFocus
            aria-label="Source URL or description"
            placeholder="Paste a link or describe the source"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-8 text-body"
          />
          <Button size="sm" type="submit">
            Add
          </Button>
          <Button size="sm" variant="ghost" type="button" onClick={() => setAdding(false)}>
            Cancel
          </Button>
        </form>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="cursor-pointer rounded-sm text-body font-medium text-green-700 underline-offset-4 hover:underline"
          >
            Add a source Sumble missed
          </button>
        </div>
      )}
    </>
  )
}

export function BriefDocument() {
  const { angle, credits, generate, generated, consumeHeadingFocus } = useBrief()
  const headingRef = React.useRef<HTMLHeadingElement>(null)

  React.useEffect(() => {
    if (consumeHeadingFocus()) headingRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on open
  }, [])

  const briefAsText = () =>
    [
      `Intelligence brief: ${ORG.name}`,
      angle.line,
      '',
      'Who to contact first',
      ...angle.contacts.map((c) => `${contactFor(c.id).name}, ${contactFor(c.id).title}: ${c.reason}`),
      '',
      'Why now',
      ...angle.whyNow,
    ].join('\n')

  return (
    <div className="h-full overflow-y-auto">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-page px-8 py-3">
        <div className="min-w-0 flex-1">
          <h2 ref={headingRef} tabIndex={-1} className="text-sm font-semibold text-slate-900 outline-none">
            Intelligence brief · {ORG.name}
          </h2>
          <p className="text-xs text-slate-500">
            {generated === 'days' ? 'Generated 3 days ago' : 'Generated today by you'} · free to reopen
          </p>
        </div>
        {generated === 'days' ? <span className="text-xs text-slate-600">{NEW_DATA_NOTE}</span> : null}
        <Button size="sm" variant="outline" disabled={credits < 1} onClick={generate}>
          <RefreshCwIcon />
          Refresh · 1 credit
        </Button>
        <CopiedIconButton label="Copy brief" icon={<CopyIcon />} getText={briefAsText} />
        <CopiedIconButton label="Share brief" icon={<Share2Icon />} getText={() => window.location.href} />
      </header>

      <div className="flex flex-col gap-8 px-8 pt-5 pb-20">
        <div className="flex flex-col gap-4">
          <AngleCards />
          <div key={angle.id} aria-live="polite" className="animate-fade-up">
            <p className="text-xl font-semibold tracking-tight text-slate-900">{angle.line}</p>
            <p className="mt-1 text-body text-slate-600">
              <CitedText text={angle.proof} origin="doc" />
            </p>
          </div>
        </div>

        <div key={angle.id} className="flex flex-col gap-8">
          <Section
            title="Who to contact first"
            order={1}
            limitedSources={angle.contactsLimited ? citedIds(angle.contacts.map((c) => c.reason)).length : undefined}
          >
            <ContactList angle={angle} />
          </Section>

          <Section
            title="Why now"
            order={2}
            limitedSources={angle.whyNowLimited ? citedIds(angle.whyNow).length : undefined}
          >
            <ul className="flex list-disc flex-col gap-1.5 pl-4 text-body text-slate-900 marker:text-slate-400">
              {angle.whyNow.map((item) => (
                <li key={item}>
                  <CitedText text={item} origin="doc" />
                </li>
              ))}
            </ul>
          </Section>

          <Section
            title="Best-fit teams"
            order={3}
            limitedSources={angle.teamsLimited ? citedIds(angle.teams.map((t) => t.reason)).length : undefined}
          >
            <ul className="flex flex-col divide-y divide-slate-100">
              {angle.teams.map(({ id, reason }) => {
                const team = TEAMS_BY_ID[id]
                return (
                  <li key={id} className="flex h-11 items-center gap-3 text-body">
                    <span className="w-44 shrink-0 font-semibold text-slate-900">{team.name}</span>
                    <span className="w-32 shrink-0 text-xs text-slate-500 tabular-nums">
                      Score {team.score.toFixed(1)} · {team.jobs} {team.jobs === 1 ? 'job' : 'jobs'}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-slate-600">
                      <CitedText text={reason} origin="doc" />
                    </span>
                  </li>
                )
              })}
            </ul>
          </Section>
        </div>

        <Section title="Sources">
          <SourcesList />
        </Section>
      </div>
    </div>
  )
}
