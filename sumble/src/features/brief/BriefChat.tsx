import { ArrowUpIcon } from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { CHAT_THINK, FOLLOW_UPS, SOURCES, TIMING, type ChatMessage, type ChatThink } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { CitedText } from '@/features/brief/Citation'
import { cn } from '@/lib/utils'

function ThinkTrace({ think }: { think: ChatThink }) {
  if (think.collapsed) {
    return <p className="animate-fade-up text-xs text-slate-500">{CHAT_THINK.done}</p>
  }

  const sources = think.sourcesVisible
    ? think.sourceIds.flatMap((id) => SOURCES.filter((source) => source.id === id))
    : []

  return (
    <div>
      <ol className="flex flex-col gap-1">
        {think.lines.slice(0, think.shown).map((line, index) => (
          <li
            key={line}
            className={cn('animate-fade-up text-xs text-slate-500', index === think.shown - 1 && 'shimmer-text')}
          >
            {line}
          </li>
        ))}
      </ol>
      {sources.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Sources found">
          {sources.map((source, index) => (
            <Badge
              key={source.id}
              variant="outline"
              title={source.title}
              className="max-w-full animate-fade-up"
              style={{ animationDelay: `${index * TIMING.sectionStaggerMs}ms` }}
            >
              {source.title}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ReplyText({ message }: { message: ChatMessage }) {
  const showCaret = message.streaming && message.think?.collapsed
  if (!message.text && !showCaret) return null
  return (
    <p className={cn(message.think && 'mt-2')}>
      {message.text ? <CitedText text={message.text} origin="chat" /> : null}
      {showCaret ? <span className="stream-caret" aria-hidden="true" /> : null}
    </p>
  )
}

function liveAnnouncement(messages: ChatMessage[]) {
  const streaming = [...messages].reverse().find((message) => message.streaming)
  if (streaming?.think) {
    if (streaming.think.collapsed) return CHAT_THINK.done
    return streaming.think.lines[streaming.think.shown - 1] ?? ''
  }
  const newest = [...messages].reverse().find((message) => message.role === 'sumble' && message.id.startsWith('sumble-'))
  return newest?.text ?? ''
}

export function BriefChat() {
  const { messages, askFollowUp } = useBrief()
  const [draft, setDraft] = React.useState('')
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const replying = messages.some((message) => message.streaming)
  const chips = FOLLOW_UPS.filter((followUp) => !messages.some((message) => message.text === followUp.prompt))

  React.useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages])

  function submit(event: React.FormEvent) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || replying) return
    askFollowUp(text)
    setDraft('')
  }

  return (
    <div className="flex h-full flex-col bg-muted">
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
        <span className="sr-only" aria-live="polite">
          {liveAnnouncement(messages)}
        </span>
        <ul className="flex flex-col gap-5">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                'text-body leading-relaxed text-slate-900',
                message.role === 'user' ? 'max-w-[85%] self-end rounded-lg bg-slate-200 px-3 py-2' : 'self-start'
              )}
            >
              {message.role === 'user' ? (
                message.text
              ) : (
                <>
                  {message.think ? <ThinkTrace think={message.think} /> : null}
                  <ReplyText message={message} />
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-background px-6 py-4">
        {chips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.prompt}
                type="button"
                disabled={replying}
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
          <IconButton label="Send" variant="default" size="icon" type="submit" disabled={!draft.trim() || replying}>
            <ArrowUpIcon />
          </IconButton>
        </form>
        <p className="text-xs text-slate-500">Follow-ups on this brief are free.</p>
      </div>
    </div>
  )
}
