import { CheckIcon, CopyIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { draftEmail, TIMING, type Angle, type Contact } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'

function DraftForm({ contact, angle }: { contact: Contact; angle: Angle | null }) {
  const draft = draftEmail(contact, angle)
  const [subject, setSubject] = React.useState(draft.subject)
  const [body, setBody] = React.useState(draft.body)
  const [copied, setCopied] = React.useState(false)

  function copy() {
    void navigator.clipboard?.writeText(`${subject}\n\n${body}`).catch(() => {})
    setCopied(true)
    window.setTimeout(() => setCopied(false), TIMING.copiedMs)
  }

  return (
    <div className="flex h-full flex-col gap-4 p-5 text-body">
      <dl className="flex flex-col gap-1">
        <div className="flex gap-2">
          <dt className="w-14 text-slate-500">To</dt>
          <dd className="font-medium text-slate-900">
            {contact.name} <span className="font-normal text-slate-600">· {contact.title}</span>
          </dd>
        </div>
        {angle ? (
          <div className="flex gap-2">
            <dt className="w-14 shrink-0 text-slate-500">Angle</dt>
            <dd className="text-slate-700">{angle.line}</dd>
          </div>
        ) : null}
      </dl>
      <label className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-600">Subject</span>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} className="h-8 text-body" />
      </label>
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-600">Message</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="min-h-72 flex-1 resize-none rounded-md border border-border bg-background p-3 leading-relaxed text-slate-900"
        />
      </label>
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

  return (
    <Dialog
      open={outreachContact !== null}
      onClose={closeOutreach}
      title={outreachContact ? `Draft outreach to ${outreachContact.name.split(' ')[0]}` : 'Draft outreach'}
      placement="right"
    >
      {outreachContact ? (
        <DraftForm key={`${outreachContact.id}-${angle?.id ?? 'none'}`} contact={outreachContact} angle={angle} />
      ) : null}
    </Dialog>
  )
}
