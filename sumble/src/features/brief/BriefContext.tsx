import * as React from 'react'

import {
  ANGLES,
  CHAT_FALLBACK,
  CHAT_THINK,
  citedIds,
  CONTACTS,
  CREDITS,
  FOLLOW_UPS,
  INITIAL_CHAT,
  TIMING,
  type ChatMessage,
  type ChatThink,
  type Contact,
  type Source,
  type TabName,
} from '@/data/clio'

export type BriefStatus = 'idle' | 'generating' | 'ready'
export type GeneratedAge = 'now' | 'days'
export type DemoPreset = 'before' | 'zero' | 'during' | 'tile' | 'stale' | 'brief'

const PRESETS: Record<DemoPreset, { status: BriefStatus; credits: number; tab: TabName; generated: GeneratedAge }> = {
  before: { status: 'idle', credits: CREDITS.start, tab: 'Overview', generated: 'now' },
  zero: { status: 'idle', credits: 0, tab: 'Overview', generated: 'now' },
  during: { status: 'generating', credits: CREDITS.start - 1, tab: 'Overview', generated: 'now' },
  tile: { status: 'ready', credits: CREDITS.start - 1, tab: 'Overview', generated: 'now' },
  stale: { status: 'ready', credits: CREDITS.start - 1, tab: 'Overview', generated: 'days' },
  brief: { status: 'ready', credits: CREDITS.start - 1, tab: 'Brief', generated: 'now' },
}

function useBriefState() {
  const [status, setStatus] = React.useState<BriefStatus>('idle')
  const [step, setStep] = React.useState(0)
  const [credits, setCredits] = React.useState(CREDITS.start)
  const [tab, setTab] = React.useState<TabName>('Overview')
  const [generated, setGenerated] = React.useState<GeneratedAge>('now')
  /** When generation last finished. The ready tile's reveal only plays right after this. */
  const [finishedAt, setFinishedAt] = React.useState(0)
  const [angleId, setAngleId] = React.useState(ANGLES[0].id)
  const [hoveredSource, setHoveredSource] = React.useState<number | null>(null)
  const [pinnedSource, setPinnedSource] = React.useState<number | null>(null)
  const [outreachContact, setOutreachContact] = React.useState<Contact | null>(null)
  const [toastVisible, setToastVisible] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_CHAT)
  const [flagged, setFlagged] = React.useState<Set<number>>(new Set())
  const [addedSources, setAddedSources] = React.useState<Source[]>([])

  const tabRef = React.useRef(tab)
  const chatTimers = React.useRef<number[]>([])
  const pinTimer = React.useRef<number | undefined>(undefined)
  const headingFocusPending = React.useRef(false)

  function clearChatTimers() {
    for (const id of chatTimers.current) window.clearTimeout(id)
    chatTimers.current = []
    window.clearTimeout(pinTimer.current)
  }

  function later(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms)
    chatTimers.current.push(id)
  }

  function updateMessage(id: string, update: (message: ChatMessage) => ChatMessage) {
    setMessages((current) => current.map((message) => (message.id === id ? update(message) : message)))
  }

  function updateThink(id: string, think: Partial<ChatThink>) {
    updateMessage(id, (message) => (message.think ? { ...message, think: { ...message.think, ...think } } : message))
  }

  React.useEffect(() => {
    tabRef.current = tab
  }, [tab])

  // Lives above the tabs, so generation keeps running while someone browses.
  React.useEffect(() => {
    if (status !== 'generating') return
    const timer = window.setTimeout(() => {
      if (step < TIMING.stepMs.length - 1) {
        setStep(step + 1)
        return
      }
      setFinishedAt(Date.now())
      setStatus('ready')
      if (tabRef.current !== 'Brief') setToastVisible(true)
    }, TIMING.stepMs[step])
    return () => window.clearTimeout(timer)
  }, [status, step])

  React.useEffect(() => {
    if (!toastVisible) return
    const timer = window.setTimeout(() => setToastVisible(false), TIMING.toastMs)
    return () => window.clearTimeout(timer)
  }, [toastVisible])

  React.useEffect(() => clearChatTimers, [])

  function resetBrief() {
    clearChatTimers()
    setStep(0)
    setToastVisible(false)
    setAngleId(ANGLES[0].id)
    setMessages(INITIAL_CHAT)
    setFlagged(new Set())
    setAddedSources([])
  }

  function generate() {
    if (credits < 1) return
    resetBrief()
    setCredits(credits - 1)
    setGenerated('now')
    setStatus('generating')
  }

  /** Lands on the recommended angle unless told otherwise. A prompt is asked in the chat on arrival. */
  function openBrief({ angleId: nextAngleId, prompt }: { angleId?: string; prompt?: string } = {}) {
    setToastVisible(false)
    setAngleId(nextAngleId ?? ANGLES[0].id)
    headingFocusPending.current = true
    setTab('Brief')
    const alreadyAsked = messages.some((m) => m.text === prompt)
    const waitingOnReply = messages.some((message) => message.streaming)
    if (prompt && !alreadyAsked && !waitingOnReply) askFollowUp(prompt)
  }

  /** True once after openBrief, so normal tab switching never moves focus. */
  function consumeHeadingFocus() {
    const pending = headingFocusPending.current
    headingFocusPending.current = false
    return pending
  }

  function jumpTo(preset: DemoPreset) {
    const next = PRESETS[preset]
    resetBrief()
    setCredits(next.credits)
    setGenerated(next.generated)
    // "Ready tile" replays the reveal, so it can be recorded without a full run.
    setFinishedAt(preset === 'tile' ? Date.now() : 0)
    setStatus(next.status)
    setTab(next.tab)
  }

  function streamAnswer(id: string, answer: string) {
    const parts = answer.split(/(\s+|\[\d+\])/).filter((part) => part.length > 0)
    let built = ''
    let index = 0

    function tick() {
      if (index >= parts.length) {
        updateMessage(id, (message) => ({ ...message, text: answer, streaming: false }))
        return
      }
      const part = parts[index]
      built += part
      const cite = part.match(/^\[(\d+)\]$/)
      if (cite) pinSource(Number(cite[1]))
      const next = built
      updateMessage(id, (message) => ({ ...message, text: next }))
      index += 1
      later(tick, /^\s+$/.test(part) ? TIMING.streamSpaceMs : TIMING.streamWordMs)
    }

    tick()
  }

  function askFollowUp(text: string) {
    clearChatTimers()
    const followUp = FOLLOW_UPS.find((item) => item.prompt === text)
    const answer = followUp?.answer ?? CHAT_FALLBACK
    const lines = followUp?.think ?? CHAT_THINK.fallback
    const sourceIds = citedIds([answer])
    const messageId = `sumble-${Date.now()}`
    const think: ChatThink = { lines, shown: 1, sourceIds, sourcesVisible: false, collapsed: false }

    setMessages((current) => [
      ...current,
      { id: `user-${current.length}`, role: 'user', text },
      { id: messageId, role: 'sumble', text: '', streaming: true, think },
    ])

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateMessage(messageId, (message) => ({
        ...message,
        text: answer,
        streaming: false,
        think: message.think
          ? { ...message.think, shown: lines.length, sourcesVisible: true, collapsed: true }
          : message.think,
      }))
      return
    }

    lines.forEach((_, lineIndex) => {
      if (lineIndex === 0) return
      later(() => {
        updateThink(messageId, {
          shown: lineIndex + 1,
          sourcesVisible: lineIndex + 1 === lines.length,
        })
      }, lineIndex * TIMING.thinkStepMs)
    })

    later(() => {
      updateThink(messageId, { collapsed: true })
      streamAnswer(messageId, answer)
    }, lines.length * TIMING.thinkStepMs)
  }

  function pinSource(id: number) {
    window.clearTimeout(pinTimer.current)
    setPinnedSource(id)
    pinTimer.current = window.setTimeout(() => setPinnedSource(null), TIMING.citationPinMs)
  }

  function toggleFlag(id: number) {
    setFlagged((current) => {
      const next = new Set(current)
      if (!next.delete(id)) next.add(id)
      return next
    })
  }

  function addSource(title: string, nextId: number) {
    setAddedSources((current) => [...current, { id: nextId, type: 'Added by you', title, age: 'just now' }])
  }

  return {
    status,
    step,
    credits,
    tab,
    setTab,
    angle: ANGLES.find((a) => a.id === angleId) ?? ANGLES[0],
    setAngleId,
    activeSource: hoveredSource ?? pinnedSource,
    setHoveredSource,
    pinSource,
    outreachContact,
    openOutreach: setOutreachContact,
    closeOutreach: () => setOutreachContact(null),
    toastVisible,
    dismissToast: () => setToastVisible(false),
    messages,
    askFollowUp,
    flagged,
    toggleFlag,
    addedSources,
    addSource,
    generated,
    finishedAt,
    generate,
    openBrief,
    consumeHeadingFocus,
    jumpTo,
  }
}

type BriefContextValue = ReturnType<typeof useBriefState>

const BriefContext = React.createContext<BriefContextValue | null>(null)

export function BriefProvider({ children }: { children: React.ReactNode }) {
  const value = useBriefState()
  return <BriefContext.Provider value={value}>{children}</BriefContext.Provider>
}

export function useBrief() {
  const value = React.useContext(BriefContext)
  if (!value) throw new Error('useBrief must be used inside BriefProvider')
  return value
}

export function currentPreset(
  status: BriefStatus,
  credits: number,
  tab: TabName,
  generated: GeneratedAge
): DemoPreset {
  if (status === 'generating') return 'during'
  if (status === 'ready') {
    if (tab === 'Brief') return 'brief'
    return generated === 'days' ? 'stale' : 'tile'
  }
  return credits === 0 ? 'zero' : 'before'
}

export function contactFor(id: string) {
  return CONTACTS[id]
}
