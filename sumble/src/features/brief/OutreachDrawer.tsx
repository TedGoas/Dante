import { BookOpenIcon, CheckIcon, CopyIcon, MessagesSquareIcon, SearchIcon, type LucideIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  draftEmail,
  DRAFT_ORIGINS,
  SOURCE_LINK_NOTE,
  TIMING,
  type Angle,
  type Contact,
  type DraftOrigin,
  type Source,
} from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { cn } from '@/lib/utils'

const ORIGIN_TINT: Record<DraftOrigin, string> = {
  sources: 'bg-green-100',
  playbook: 'bg-sky-100',
  history: 'bg-violet-100',
}

const ORIGIN_ICON: Record<DraftOrigin, string> = {
  sources: 'bg-green-100 text-green-900',
  playbook: 'bg-sky-100 text-sky-900',
  history: 'bg-violet-100 text-violet-900',
}

type DraftParts = ReturnType<typeof draftEmail>['parts']

/** Memoized so React never rewrites the text while someone is editing it. */
const DraftBody = React.memo(function DraftBody({
  parts,
  labelledBy,
  bodyRef,
}: {
  parts: DraftParts
  labelledBy: string
  bodyRef: React.Ref<HTMLDivElement>
}) {
  return (
    <div
      ref={bodyRef}
      role="textbox"
      aria-multiline
      aria-labelledby={labelledBy}
      contentEditable="plaintext-only"
      suppressContentEditableWarning
      className="min-h-56 flex-1 overflow-y-auto rounded-md border border-border bg-background p-3 leading-relaxed whitespace-pre-wrap text-slate-900 outline-none focus-visible:border-green-600 focus-visible:ring-3 focus-visible:ring-green-600/15"
    >
      {parts.map((part, i) =>
        part.origin ? (
          <span key={i} className={cn('-mx-0.5 rounded-[3px] px-0.5 box-decoration-clone', ORIGIN_TINT[part.origin])}>
            {part.text}
          </span>
        ) : (
          <React.Fragment key={i}>{part.text}</React.Fragment>
        )
      )}
    </div>
  )
})

function OriginRow({
  origin,
  icon: Icon,
  title,
  children,
}: {
  origin: DraftOrigin
  icon: LucideIcon
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-2.5">
      <span aria-hidden className={cn('mt-0.5 grid size-5 shrink-0 place-items-center rounded-sm', ORIGIN_ICON[origin])}>
        <Icon className="size-3" />
      </span>
      <div className="min-w-0">
        <p className="font-medium text-slate-900">{title}</p>
        <div className="text-slate-600">{children}</div>
      </div>
    </li>
  )
}

function SourceLink({ source }: { source: Source }) {
  return (
    <a
      href="#"
      onClick={(event) => {
        event.preventDefault()
        window.alert(SOURCE_LINK_NOTE)
      }}
      className="rounded-sm text-green-700 underline-offset-4 hover:underline"
    >
      {source.title}
    </a>
  )
}

function DraftForm({ contact, angle }: { contact: Contact; angle: Angle | null }) {
  const draft = React.useMemo(() => draftEmail(contact, angle), [contact, angle])
  const [subject, setSubject] = React.useState(draft.subject)
  const [copied, setCopied] = React.useState(false)
  const bodyRef = React.useRef<HTMLDivElement>(null)
  const messageLabelId = React.useId()

  function copy() {
    void navigator.clipboard?.writeText(`${subject}\n\n${bodyRef.current?.innerText ?? ''}`).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), TIMING.copiedMs)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-5 text-body">
      <dl className="flex flex-col gap-1">
        <div className="flex gap-2">
          <dt className="w-14 text-slate-500">To</dt>
          <dd className="font-medium text-slate-900">
            {contact.name} <span className="font-normal text-slate-500">· {contact.title}</span>
          </dd>
        </div>
        {angle ? (
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-slate-500">Angle</dt>
            <dd className="text-slate-600">{angle.line}</dd>
          </div>
        ) : null}
      </dl>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-600">Subject</span>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-8 text-body" />
      </label>
      <div className="flex min-h-0 flex-1 flex-col gap-1.5">
        <span id={messageLabelId} className="text-xs font-medium text-slate-600">
          Message
        </span>
        <DraftBody parts={draft.parts} labelledBy={messageLabelId} bodyRef={bodyRef} />
      </div>
      <section aria-label="Where this language came from" className="flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-slate-900">Where this language came from</h3>
        <ul className="flex flex-col gap-2.5">
          <OriginRow origin="sources" icon={SearchIcon} title="Sources Sumble found">
            {draft.sources.map((source, i) => (
              <React.Fragment key={source.id}>
                {i > 0 ? ' · ' : ''}
                <SourceLink source={source} />
              </React.Fragment>
            ))}
          </OriginRow>
          <OriginRow origin="playbook" icon={BookOpenIcon} title={DRAFT_ORIGINS.playbook.title}>
            {DRAFT_ORIGINS.playbook.detail}
          </OriginRow>
          <OriginRow origin="history" icon={MessagesSquareIcon} title={DRAFT_ORIGINS.history.title}>
            {DRAFT_ORIGINS.history.detail}
          </OriginRow>
        </ul>
      </section>
      <div>
        <Button size="sm" onClick={copy}>
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? 'Copied' : 'Copy draft'}
        </Button>
      </div>
    </div>
  )
}

export function OutreachDrawer() {
  const { outreachContact, closeOutreach, angle: selectedAngle, status } = useBrief()
  // No angle exists until a brief has been generated.
  const angle = status === 'ready' ? selectedAngle : null

  // Keeps the content in place while the drawer animates out.
  const lastContact = React.useRef(outreachContact)
  if (outreachContact) lastContact.current = outreachContact
  const contact = outreachContact ?? lastContact.current

  return (
    <Dialog
      open={outreachContact !== null}
      onClose={closeOutreach}
      title={contact ? `Draft outreach to ${contact.name.split(' ')[0]}` : 'Draft outreach'}
      placement="right"
    >
      {contact ? <DraftForm key={`${contact.id}-${angle?.id ?? 'none'}`} contact={contact} angle={angle} /> : null}
    </Dialog>
  )
}
