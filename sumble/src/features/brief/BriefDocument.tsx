import { CheckIcon, CopyIcon, FlagIcon, RefreshCwIcon, Share2Icon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { ScoreBadge } from '@/components/ui/score-badge'
import { citedIds, ORG, SOURCES, TIMING } from '@/data/clio'
import { AngleCards } from '@/features/brief/AngleCards'
import { contactFor, useBrief } from '@/features/brief/BriefContext'
import { CitedText } from '@/features/brief/Citation'
import { cn } from '@/lib/utils'

function Section({
  title,
  limitedSources,
  children,
}: {
  title: string
  limitedSources?: number
  children: React.ReactNode
}) {
  const headingId = React.useId()
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <h3 id={headingId} className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
          {title}
        </h3>
        {limitedSources !== undefined ? (
          <span className="text-xs text-slate-600">
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
      <ol className="flex flex-col">
        {allSources.map((source) => (
          <li
            key={source.id}
            id={`source-${source.id}`}
            className={cn(
              'flex h-8 scroll-mt-16 scroll-mb-3 items-center gap-2 rounded-md px-2 text-body text-slate-700 transition-colors',
              activeSource === source.id && 'bg-green-100'
            )}
          >
            <span className="w-6 shrink-0 font-medium text-slate-600 tabular-nums">[{source.id}]</span>
            <span className="min-w-0 flex-1 truncate">
              <span className="font-medium text-slate-900">{source.type}</span> · {source.title} ·{' '}
              <span className="text-slate-600">{source.age}</span>
            </span>
            <Button
              size="xs"
              variant="ghost"
              aria-pressed={flagged.has(source.id)}
              aria-label={`${flagged.has(source.id) ? 'Remove flag from' : 'Flag'} source ${source.id}`}
              onClick={() => toggleFlag(source.id)}
            >
              <FlagIcon />
              {flagged.has(source.id) ? 'Flagged' : 'Flag'}
            </Button>
          </li>
        ))}
      </ol>
      {adding ? (
        <form onSubmit={submit} className="flex items-center gap-2 px-2">
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
        <div className="px-2">
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="cursor-pointer text-body font-medium text-green-700 underline-offset-4 hover:underline"
          >
            Add a source Sumble missed
          </button>
        </div>
      )}
    </>
  )
}

export function BriefDocument() {
  const { angle, credits, generate, openOutreach } = useBrief()

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
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-border bg-page px-6 py-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-slate-900">Intelligence brief · {ORG.name}</h2>
          <p className="text-xs text-slate-600">Generated today by you · free to reopen</p>
        </div>
        <Button size="sm" variant="outline" disabled={credits < 1} onClick={generate}>
          <RefreshCwIcon />
          Refresh · 1 credit
        </Button>
        <CopiedIconButton label="Copy brief" icon={<CopyIcon />} getText={briefAsText} />
        <CopiedIconButton label="Share brief" icon={<Share2Icon />} getText={() => window.location.href} />
      </header>

      <div className="flex flex-col gap-6 px-6 py-4 pb-16">
        <Section title="Angles">
          <AngleCards />
          <p className="text-body text-slate-700">
            <CitedText text={angle.proof} origin="doc" />
          </p>
        </Section>

        <Section
          title="Who to contact first"
          limitedSources={angle.contactsLimited ? citedIds(angle.contacts.map((c) => c.reason)).length : undefined}
        >
          <ul className="flex flex-col divide-y divide-slate-100">
            {angle.contacts.map(({ id, reason }) => {
              const contact = contactFor(id)
              return (
                <li key={id} className="flex items-center gap-3 py-2">
                  <ScoreBadge score={contact.score} />
                  <div className="min-w-0 flex-1 text-body">
                    <p className="truncate">
                      <a href="#" className="font-semibold text-slate-900 underline-offset-2 hover:underline">
                        {contact.name}
                      </a>
                      <span className="text-slate-600"> · {contact.title}</span>
                    </p>
                    <p className="text-slate-700">
                      <CitedText text={reason} origin="doc" />
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openOutreach(contact)}>
                    Draft outreach
                  </Button>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section title="Why now" limitedSources={angle.whyNowLimited ? citedIds(angle.whyNow).length : undefined}>
          <ul className="flex list-disc flex-col gap-1 pl-4 text-body text-slate-700 marker:text-slate-400">
            {angle.whyNow.map((item) => (
              <li key={item}>
                <CitedText text={item} origin="doc" />
              </li>
            ))}
          </ul>
        </Section>

        <Section
          title="Best-fit teams"
          limitedSources={angle.teamsLimited ? citedIds(angle.teams.map((t) => t.reason)).length : undefined}
        >
          <ul className="flex flex-col divide-y divide-slate-100">
            {angle.teams.map((team) => (
              <li key={team.name} className="flex h-9 items-center gap-3 text-body">
                <span className="w-40 shrink-0 font-semibold text-slate-900">{team.name}</span>
                <span className="w-40 shrink-0 text-slate-600 tabular-nums">
                  {team.headcount} people · {team.openRoles} open
                </span>
                <span className="min-w-0 flex-1 truncate text-slate-700">
                  <CitedText text={team.reason} origin="doc" />
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Sources">
          <SourcesList />
        </Section>
      </div>
    </div>
  )
}
