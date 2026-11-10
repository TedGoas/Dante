import { ArrowUpIcon } from 'lucide-react'
import * as React from 'react'

import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { FOLLOW_UPS } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { CitedText } from '@/features/brief/Citation'
import { cn } from '@/lib/utils'

export function BriefChat() {
  const { messages, askFollowUp } = useBrief()
  const [draft, setDraft] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const thinking = messages[messages.length - 1].role === 'user'
  const chips = FOLLOW_UPS.filter((f) => !messages.some((m) => m.text === f.prompt))

  React.useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages.length])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || thinking) return
    askFollowUp(text)
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col bg-muted">
      <div ref={scrollRef} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
        <ul aria-live="polite" className="flex flex-col gap-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                'max-w-[88%] rounded-lg px-3 py-2 text-body leading-relaxed',
                message.role === 'user'
                  ? 'self-end bg-slate-200 text-slate-900'
                  : 'self-start border border-border bg-background text-slate-800'
              )}
            >
              <CitedText text={message.text} origin="chat" />
            </li>
          ))}
          {thinking ? <li className="self-start px-3 text-body text-slate-600">Checking the sources…</li> : null}
        </ul>
      </div>

      <div className="flex flex-col gap-2 border-t border-border bg-background px-5 py-3">
        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {chips.map((chip) => (
              <button
                key={chip.prompt}
                type="button"
                disabled={thinking}
                onClick={() => askFollowUp(chip.prompt)}
                className="h-6.5 cursor-pointer rounded-full border border-border bg-background px-2.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-50"
              >
                {chip.prompt}
              </button>
            ))}
          </div>
        ) : null}
        <form onSubmit={submit} className="flex items-center gap-2">
          <Input
            aria-label="Ask a follow-up"
            placeholder="Ask a follow-up…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="h-8 text-body"
          />
          <IconButton label="Send" variant="default" size="icon" type="submit" disabled={!draft.trim() || thinking}>
            <ArrowUpIcon />
          </IconButton>
        </form>
        <p className="text-xs text-slate-600">Follow-ups on this brief are free.</p>
      </div>
    </div>
  )
}
