import { CheckIcon, FileSearchIcon, PencilIcon, SparklesIcon, Undo2Icon, XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { AiWorking } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ConfidenceIndicator } from './ConfidenceIndicator'

/*
 * An AI-proposed value or action that a human must decide on
 * ("humans decide, AI prepares"). Works in a table cell, a form field, or a
 * card via `density`. Fully controlled; use `useAiSuggestion` for local state.
 */

export type AiSuggestionState = 'pending' | 'accepted' | 'modified' | 'rejected' | 'loading'

export type AiSuggestionProps = {
  /** Accessible name of the thing being suggested, e.g. "Monthly income". */
  label: string
  /** Current value: the AI's value, or the human's edit when modified. */
  value: string
  /** The AI's original value, shown struck through when modified. */
  originalValue?: string
  state: AiSuggestionState
  confidence?: number
  rejectReason?: string
  onAccept?: () => void
  onModify?: (value: string) => void
  onReject?: (reason?: string) => void
  /** Return to pending (undo a decision). */
  onReset?: () => void
  /** "Why?" link: open the document and focus the source region. */
  onShowEvidence?: () => void
  density?: 'cell' | 'field' | 'card'
  /** Show the label inside the component (field and card densities). */
  showLabel?: boolean
  /** Increment to open inline edit from outside (e.g. an "E" shortcut). */
  editSignal?: number
  className?: string
}

const announce: Record<AiSuggestionState, string> = {
  pending: 'waiting for review',
  accepted: 'accepted',
  modified: 'modified',
  rejected: 'rejected',
  loading: 'AI is extracting',
}

export function AiSuggestion({
  label,
  value,
  originalValue,
  state,
  confidence,
  rejectReason,
  onAccept,
  onModify,
  onReject,
  onReset,
  onShowEvidence,
  density = 'field',
  showLabel = density !== 'cell',
  editSignal,
  className,
}: AiSuggestionProps) {
  const [editing, setEditing] = React.useState(false)
  const [draft, setDraft] = React.useState(value)
  const [message, setMessage] = React.useState('')
  const prevState = React.useRef(state)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (prevState.current !== state) setMessage(`${label}: ${announce[state]}`)
    prevState.current = state
  }, [state, label])

  React.useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  React.useEffect(() => {
    if (editSignal && state === 'pending') {
      setDraft(value)
      setEditing(true)
    }
    // Only react to new signals.
  }, [editSignal])

  const cell = density === 'cell'

  function startEdit() {
    setDraft(value)
    setEditing(true)
  }
  function save() {
    setEditing(false)
    if (draft.trim() && draft !== value) onModify?.(draft.trim())
  }

  const live = (
    <span aria-live="polite" className="sr-only">
      {message}
    </span>
  )

  if (state === 'loading') {
    return (
      <div
        data-slot="ai-suggestion"
        data-state={state}
        aria-busy
        className={cn('flex flex-col gap-1.5', density === 'card' && 'rounded-xl border border-border bg-white p-3.5', className)}
      >
        {showLabel && <span className="text-xs text-gray-500">{label}</span>}
        <AiWorking className="text-xs">Extracting…</AiWorking>
        <Skeleton className={cn('h-3', cell ? 'w-20' : 'w-32')} />
        {live}
      </div>
    )
  }

  const valueNode = editing ? (
    <div className="flex items-center gap-1.5">
      <Input
        ref={inputRef}
        aria-label={`Edit ${label}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') {
            e.stopPropagation()
            setEditing(false)
          }
        }}
        className={cn('h-8 rounded-lg', cell ? 'w-32 text-[13px]' : 'max-w-64')}
      />
      {cell ? (
        <>
          <IconButton label="Save" onClick={save}>
            <CheckIcon />
          </IconButton>
          <IconButton label="Cancel" onClick={() => setEditing(false)}>
            <XIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Button size="sm" variant="secondary" onClick={save}>
            Save
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        </>
      )}
    </div>
  ) : (
    // Keyed on state so each decision crossfades in.
    <span key={state} className="inline-flex min-w-0 animate-fade-in">
      <ValueDisplay value={value} originalValue={originalValue} state={state} rejectReason={rejectReason} density={density} />
    </span>
  )

  const rejectButton = onReject && (
    <RejectPopover label={label} onReject={onReject}>
      {cell ? (
        <IconButton label={`Reject ${label}`}>
          <XIcon />
        </IconButton>
      ) : (
        <Button size="xs" variant="ghost">
          <XIcon />
          Reject
        </Button>
      )}
    </RejectPopover>
  )

  const why = onShowEvidence &&
    (cell ? (
      <IconButton label={`Show evidence for ${label}`} onClick={onShowEvidence}>
        <FileSearchIcon />
      </IconButton>
    ) : (
      <button type="button" onClick={onShowEvidence} className="cursor-pointer text-xs font-medium text-link hover:text-link-hover hover:underline">
        Why?
      </button>
    ))

  const actions =
    !editing &&
    (state === 'pending' ? (
      cell ? (
        <span className="flex items-center">
          {onAccept && (
            <IconButton label={`Accept ${label}`} onClick={onAccept}>
              <CheckIcon />
            </IconButton>
          )}
          {onModify && (
            <IconButton label={`Modify ${label}`} onClick={startEdit}>
              <PencilIcon />
            </IconButton>
          )}
          {rejectButton}
          {why}
        </span>
      ) : (
        <span className="flex flex-wrap items-center gap-1.5">
          {onAccept && (
            <Button size="xs" variant="secondary" onClick={onAccept}>
              <CheckIcon />
              Accept
            </Button>
          )}
          {onModify && (
            <Button size="xs" variant="ghost" onClick={startEdit}>
              <PencilIcon />
              Modify
            </Button>
          )}
          {rejectButton}
          {why && <span className="ml-1">{why}</span>}
        </span>
      )
    ) : (
      <span className="flex items-center gap-1.5">
        {onReset &&
          (cell ? (
            <IconButton label={`Undo decision for ${label}`} onClick={onReset}>
              <Undo2Icon />
            </IconButton>
          ) : (
            <Button size="xs" variant="ghost" onClick={onReset}>
              <Undo2Icon />
              Undo
            </Button>
          ))}
        {why}
      </span>
    ))

  if (cell) {
    return (
      <div data-slot="ai-suggestion" data-state={state} className={cn('flex items-center gap-1', className)}>
        {valueNode}
        {confidence !== undefined && !editing && <ConfidenceIndicator value={confidence} variant="compact" />}
        {actions}
        {live}
      </div>
    )
  }

  return (
    <div
      data-slot="ai-suggestion"
      data-state={state}
      className={cn(
        'flex flex-col gap-1.5',
        density === 'card' && 'rounded-xl border p-3.5',
        density === 'card' && (state === 'pending' ? 'border-ai-border bg-ai-soft/50' : 'border-border bg-white'),
        className
      )}
    >
      {(showLabel || confidence !== undefined) && (
        <div className="flex items-center justify-between gap-2">
          {showLabel && <span className="text-xs text-gray-500">{label}</span>}
          {confidence !== undefined && <ConfidenceIndicator value={confidence} />}
        </div>
      )}
      <div className={cn(density === 'card' && 'text-base')}>{valueNode}</div>
      {actions}
      {live}
    </div>
  )
}

function ValueDisplay({
  value,
  originalValue,
  state,
  rejectReason,
  density,
}: {
  value: string
  originalValue?: string
  state: AiSuggestionState
  rejectReason?: string
  density: 'cell' | 'field' | 'card'
}) {
  const cell = density === 'cell'
  if (state === 'pending') {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <SparklesIcon aria-hidden className="size-3.5 shrink-0 text-ai" />
        <span className="truncate font-medium text-gray-900 underline decoration-indigo-300 decoration-dashed underline-offset-4">
          {value}
        </span>
        <span className="sr-only">(AI suggestion, not yet reviewed)</span>
      </span>
    )
  }
  if (state === 'accepted') {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5">
        <CheckIcon aria-hidden className="size-3.5 shrink-0 text-emerald-600" />
        <span className="truncate font-medium text-gray-900">{value}</span>
        {cell ? <span className="sr-only">(accepted)</span> : <span className="text-xs text-gray-400">Accepted</span>}
      </span>
    )
  }
  if (state === 'modified') {
    const original = originalValue && (
      <span className="text-gray-400 line-through decoration-gray-400">
        <span className="sr-only">AI suggested </span>
        {originalValue}
      </span>
    )
    return (
      <span className="inline-flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
        <PencilIcon aria-hidden className="size-3.5 shrink-0 text-gray-500" />
        <span className="truncate font-medium text-gray-900">{value}</span>
        {cell ? (
          originalValue && (
            <Tooltip content={<>AI suggested: {originalValue}</>}>
              <span tabIndex={0} className="text-xs text-gray-400 underline decoration-dotted underline-offset-2">
                edited
              </span>
            </Tooltip>
          )
        ) : (
          <span className="text-xs">
            {original} <span className="text-gray-400">· Edited</span>
          </span>
        )}
      </span>
    )
  }
  // rejected
  return (
    <span className="inline-flex min-w-0 flex-col gap-0.5">
      <span className="inline-flex items-center gap-1.5">
        <XIcon aria-hidden className="size-3.5 shrink-0 text-gray-400" />
        <span className="truncate text-gray-400 line-through">{value}</span>
        {cell ? <span className="sr-only">(rejected{rejectReason ? `: ${rejectReason}` : ''})</span> : <span className="text-xs text-gray-400">Rejected</span>}
      </span>
      {!cell && rejectReason && <span className="text-xs text-gray-500">“{rejectReason}”</span>}
    </span>
  )
}

function RejectPopover({ label, onReject, children }: { label: string; onReject: (reason?: string) => void; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState('')
  const id = React.useId()
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="end">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onReject(reason.trim() || undefined)
            setReason('')
            setOpen(false)
          }}
          className="flex flex-col gap-2"
        >
          <label htmlFor={id} className="text-[13px] font-medium text-gray-900">
            Reject {label.toLowerCase()}?
          </label>
          <Textarea
            id={id}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional). Helps the AI learn."
            className="min-h-16 text-[13px]"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" variant="destructive">
              Reject
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}

/** Local state for an AiSuggestion. Spread the result onto the component. */
export function useAiSuggestion(initial: { value: string; state?: AiSuggestionState; confidence?: number }) {
  const [state, setState] = React.useState<AiSuggestionState>(initial.state ?? 'pending')
  const [value, setValue] = React.useState(initial.value)
  const [rejectReason, setRejectReason] = React.useState<string>()
  return {
    value,
    state,
    confidence: initial.confidence,
    originalValue: state === 'modified' ? initial.value : undefined,
    rejectReason,
    onAccept: () => setState('accepted'),
    onModify: (next: string) => {
      setValue(next)
      setState('modified')
    },
    onReject: (reason?: string) => {
      setRejectReason(reason)
      setState('rejected')
    },
    onReset: () => {
      setValue(initial.value)
      setRejectReason(undefined)
      setState('pending')
    },
  } satisfies Partial<AiSuggestionProps>
}
