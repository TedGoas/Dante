import {
  BanIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  FileSearchIcon,
  InboxIcon,
  MoreHorizontalIcon,
  RotateCcwIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserRoundIcon,
  XIcon,
} from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Field } from '@/components/ui/field'
import { IconButton } from '@/components/ui/icon-button'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip } from '@/components/ui/tooltip'
import {
  CURRENT_USER,
  conditionCategoryLabel,
  conditionStatusBadge,
  conditionStatusLabel,
  type Actor,
  type Condition,
  type ConditionStatus,
  type Evidence,
} from '@/data/conditions'
import { FIXED_NOW, daysUntil, relativeTime, shortDate } from '@/lib/seed'
import { cn } from '@/lib/utils'

/*
 * A condition card. AI-created conditions show why they fired (trigger, rule,
 * guideline, evidence). Works for AUS / underwriter conditions too, without
 * the "why" block. The parent owns state: every action calls `onChange` with
 * the updated condition, including a new history entry.
 */

type ReasonKind = 'waive' | 'dismiss' | 'reject'

const reasonCopy: Record<ReasonKind, { title: string; description: string; label: string; placeholder: string; submit: string; status: ConditionStatus; action: string }> = {
  waive: {
    title: 'Waive condition',
    description: 'Waived conditions are recorded with your name as approver and appear in the audit trail.',
    label: 'Justification',
    placeholder: 'e.g. Deposit is a transfer between verified accounts.',
    submit: 'Waive condition',
    status: 'waived',
    action: 'Waived',
  },
  dismiss: {
    title: 'Dismiss as not applicable',
    description: 'Use when the AI rule doesn’t apply to this loan. Your reason helps tune the rule.',
    label: 'Why it doesn’t apply',
    placeholder: 'e.g. Refinance: deposit sourcing isn’t required.',
    submit: 'Dismiss condition',
    status: 'waived',
    action: 'Dismissed as not applicable',
  },
  reject: {
    title: 'Reject what was received',
    description: 'The condition goes back to requested and the borrower sees your reason.',
    label: 'Reason',
    placeholder: 'e.g. LOX is unsigned. Needs signature and date.',
    submit: 'Reject and re-request',
    status: 'requested',
    action: 'Rejected',
  },
}

export function AiConditionCard({
  condition,
  onChange,
  onShowEvidence,
  actor = CURRENT_USER,
  defaultExpanded = true,
  className,
  ...rest
}: {
  condition: Condition
  onChange?: (next: Condition) => void
  onShowEvidence?: (evidence: Evidence) => void
  actor?: Actor
  defaultExpanded?: boolean
  className?: string
  /** e.g. data-flip-key for list reordering. */
  [dataAttr: `data-${string}`]: string | undefined
}) {
  const [reasonKind, setReasonKind] = React.useState<ReasonKind | null>(null)
  const ai = condition.source === 'AI'
  const last = condition.history[condition.history.length - 1]
  const due = daysUntil(condition.dueDate)
  const done = condition.status === 'cleared' || condition.status === 'waived'

  function apply(status: ConditionStatus, action: string, note?: string) {
    const entries = [{ id: `h-${Date.now()}`, actor, action, at: new Date(FIXED_NOW.getTime() + 60_000), note }]
    if (action === 'Rejected') {
      entries.push({ id: `h-${Date.now()}-r`, actor, action: 'Re-requested from borrower', at: new Date(FIXED_NOW.getTime() + 61_000), note: undefined })
    }
    onChange?.({ ...condition, status, history: [...condition.history, ...entries] })
  }

  const primary: Record<ConditionStatus, { label: string; icon: React.ReactNode; run: () => void } | null> = {
    open: { label: 'Request from borrower', icon: <SendIcon />, run: () => apply('requested', 'Requested from borrower') },
    requested: { label: 'Mark received', icon: <InboxIcon />, run: () => apply('received', 'Marked received') },
    received: { label: 'Clear', icon: <CheckIcon />, run: () => apply('cleared', 'Cleared') },
    'under-review': { label: 'Clear', icon: <CheckIcon />, run: () => apply('cleared', 'Cleared') },
    rejected: { label: 'Re-request', icon: <SendIcon />, run: () => apply('requested', 'Re-requested from borrower') },
    cleared: null,
    waived: null,
  }
  const main = primary[condition.status]
  const canReject = condition.status === 'received' || condition.status === 'under-review'

  return (
    <article
      {...rest}
      data-slot="condition-card"
      aria-labelledby={`${condition.id}-title`}
      className={cn('rounded-xl border border-border bg-white', done && 'bg-gray-50/60', className)}
    >
      <div className="flex flex-col gap-2 p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {ai ? (
            <Badge variant="indigo">
              <SparklesIcon />
              AI
            </Badge>
          ) : (
            <Badge variant="outline">{condition.source}</Badge>
          )}
          <Tooltip content={conditionCategoryLabel[condition.category]}>
            <span tabIndex={0} className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-semibold text-gray-600">
              {condition.category}
              <span className="sr-only"> ({conditionCategoryLabel[condition.category]})</span>
            </span>
          </Tooltip>
          <Badge key={condition.status} variant={conditionStatusBadge[condition.status]} dot className="ml-auto animate-fade-in">
            {conditionStatusLabel[condition.status]}
          </Badge>
        </div>

        <h3 id={`${condition.id}-title`} className={cn('text-sm leading-5 font-medium tracking-normal', done && 'text-gray-500')}>
          {condition.title}
        </h3>

        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <UserRoundIcon aria-hidden className="size-3.5" />
            {condition.ownerRole}
          </span>
          {!done && (
            <span className={cn('inline-flex items-center gap-1', due <= 1 && 'font-medium text-red-600', due === 2 && 'font-medium text-amber-700')}>
              <CalendarIcon aria-hidden className="size-3.5" />
              {due < 0 ? `Overdue by ${-due}d` : due === 0 ? 'Due today' : due === 1 ? 'Due tomorrow' : `Due ${shortDate.format(condition.dueDate)}`}
            </span>
          )}
        </p>

        {condition.why && (
          <details open={defaultExpanded} className="group rounded-lg border border-ai-border bg-ai-soft/60 text-[13px]">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 font-medium text-ai [&::-webkit-details-marker]:hidden">
              <SparklesIcon aria-hidden className="size-3.5" />
              Why AI created this
              <ChevronDownIcon aria-hidden className="ml-auto size-4 transition-transform group-open:rotate-180" />
            </summary>
            <dl className="grid grid-cols-[72px_1fr] gap-x-3 gap-y-1.5 px-3 pb-3 text-gray-700">
              <dt className="text-gray-500">Trigger</dt>
              <dd className="font-medium text-gray-900">{condition.why.trigger}</dd>
              <dt className="text-gray-500">Rule</dt>
              <dd>
                {condition.why.rule}
                {condition.why.guideline && <span className="mt-0.5 block text-xs text-gray-500">{condition.why.guideline}</span>}
              </dd>
              <dt className="text-gray-500">Clears with</dt>
              <dd>{condition.why.satisfiedBy}</dd>
            </dl>
            {onShowEvidence && condition.why.evidence.fieldId && (
              <div className="px-3 pb-3">
                <Button size="xs" variant="outline" onClick={() => onShowEvidence(condition.why!.evidence)}>
                  <FileSearchIcon />
                  View evidence
                </Button>
              </div>
            )}
          </details>
        )}

        {last && (
          <p className="text-xs text-gray-500">
            <span className="font-medium text-gray-700">{last.action}</span> by {last.actor.name} · {relativeTime(last.at)}
            {last.note && <span className="mt-0.5 block text-gray-500">“{last.note}”</span>}
          </p>
        )}
      </div>

      {onChange && (
        <div className="flex items-center gap-1.5 border-t border-gray-100 px-3.5 py-2.5">
          {main && (
            <Button size="sm" variant="secondary" onClick={main.run}>
              {main.icon}
              {main.label}
            </Button>
          )}
          {canReject && (
            <Button size="sm" variant="ghost" onClick={() => setReasonKind('reject')}>
              <XIcon />
              Reject
            </Button>
          )}
          {done ? (
            <Button size="sm" variant="ghost" onClick={() => apply('open', 'Reopened')}>
              <RotateCcwIcon />
              Reopen
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton label={`More actions for ${condition.title}`} className="ml-auto">
                  <MoreHorizontalIcon />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {condition.status !== 'received' && condition.status !== 'under-review' && (
                  <DropdownMenuItem onSelect={() => apply('cleared', 'Cleared')}>
                    <CheckIcon />
                    Clear
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onSelect={() => setReasonKind('waive')}>
                  <ShieldCheckIcon />
                  Waive with justification…
                </DropdownMenuItem>
                {ai && (
                  <DropdownMenuItem onSelect={() => setReasonKind('dismiss')}>
                    <BanIcon />
                    Dismiss as not applicable…
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      )}

      {reasonKind && (
        <ReasonDialog
          kind={reasonKind}
          conditionTitle={condition.title}
          onClose={() => setReasonKind(null)}
          onSubmit={(note) => {
            const copy = reasonCopy[reasonKind]
            apply(copy.status, copy.action, note)
            setReasonKind(null)
          }}
        />
      )}
    </article>
  )
}

function ReasonDialog({
  kind,
  conditionTitle,
  onClose,
  onSubmit,
}: {
  kind: ReasonKind
  conditionTitle: string
  onClose: () => void
  onSubmit: (note: string) => void
}) {
  const copy = reasonCopy[kind]
  const [note, setNote] = React.useState('')
  const [error, setError] = React.useState<string>()
  const formId = React.useId()
  const fieldId = React.useId()
  return (
    <Dialog
      open
      onClose={onClose}
      title={copy.title}
      description={copy.description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId} variant={kind === 'reject' ? 'destructive' : 'default'}>
            {copy.submit}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        onSubmit={(e) => {
          e.preventDefault()
          if (!note.trim()) {
            setError(`${copy.label} is required.`)
            return
          }
          onSubmit(note.trim())
        }}
        className="flex flex-col gap-3"
      >
        <p className="text-[13px] text-gray-600">
          <span className="text-gray-500">Condition:</span> <span className="font-medium text-gray-900">{conditionTitle}</span>
        </p>
        <Field label={copy.label} htmlFor={fieldId} error={error}>
          <Textarea
            id={fieldId}
            autoFocus
            value={note}
            onChange={(e) => {
              setNote(e.target.value)
              setError(undefined)
            }}
            placeholder={copy.placeholder}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-hint` : undefined}
          />
        </Field>
      </form>
    </Dialog>
  )
}
