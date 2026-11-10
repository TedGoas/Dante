import { ArrowUpIcon } from 'lucide-react'
import * as React from 'react'

import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { FOLLOW_UPS, TIMING, type ChatMessage } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { CitedText } from '@/features/brief/Citation'
import { cn } from '@/lib/utils'

/** Splits after each sentence, keeping any citations with the sentence they follow. */
function toPhrases(text: string) {
  return text.replace(/\s+(?=\[\d+\])/g, '').split(/(?<=[.?!"](?:\[\d+\])*\s)/)
}

function MessageText({ message }: { message: ChatMessage }) {
  const isNew = message.createdAt !== undefined && Date.now() - message.createdAt < TIMING.streamWindowMs
  if (!isNew) return <CitedText text={message.text} origin="chat" />
  return (
    <>
      {toPhrases(message.text).map((phrase, i) => (
        <span key={i} className="animate-stream-in" style={{ animationDelay: `${i * TIMING.streamPhraseMs}ms` }}>
          <CitedText text={phrase} origin="chat" />
        </span>
      ))}
    </>
  )
}

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
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <ul aria-live="polite" className="flex flex-col gap-5">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                'text-body leading-relaxed text-slate-900',
                message.role === 'user' ? 'max-w-[85%] self-end rounded-lg bg-slate-200 px-3 py-2' : 'self-start'
              )}
            >
              <MessageText message={message} />
            </li>
          ))}
          {thinking ? (
            <li className="self-start text-body">
              <span className="shimmer-text">Checking the sources…</span>
            </li>
          ) : null}
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-background px-6 py-4">
        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.prompt}
                type="button"
                disabled={thinking}
                onClick={() => askFollowUp(chip.prompt)}
                className="h-7 cursor-pointer rounded-full border border-border bg-background px-3 text-xs font-medium text-slate-600 transition duration-150 ease-quint hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
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
        <p className="text-xs text-slate-500">Follow-ups on this brief are free.</p>
      </div>
    </div>
  )
}
