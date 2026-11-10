import * as React from 'react'

import {
  ANGLES,
  CHAT_FALLBACK,
  CONTACTS,
  CREDITS,
  FOLLOW_UPS,
  INITIAL_CHAT,
  TIMING,
  type ChatMessage,
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
  const [angleId, setAngleId] = React.useState(ANGLES[0].id)
  const [hoveredSource, setHoveredSource] = React.useState<number | null>(null)
  const [pinnedSource, setPinnedSource] = React.useState<number | null>(null)
  const [outreachContact, setOutreachContact] = React.useState<Contact | null>(null)
  const [toastVisible, setToastVisible] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_CHAT)
  const [flagged, setFlagged] = React.useState<Set<number>>(new Set())
  const [addedSources, setAddedSources] = React.useState<Source[]>([])

  const tabRef = React.useRef(tab)
  const replyTimer = React.useRef<number | undefined>(undefined)
  const pinTimer = React.useRef<number | undefined>(undefined)
  const headingFocusPending = React.useRef(false)

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

  function resetBrief() {
    window.clearTimeout(replyTimer.current)
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

  function openBrief() {
    setToastVisible(false)
    headingFocusPending.current = true
    setTab('Brief')
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
    setStatus(next.status)
    setTab(next.tab)
  }

  function askFollowUp(text: string) {
    setMessages((current) => [...current, { id: `user-${current.length}`, role: 'user', text }])
    const answer = FOLLOW_UPS.find((f) => f.prompt === text)?.answer ?? CHAT_FALLBACK
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [...current, { id: `sumble-${current.length}`, role: 'sumble', text: answer }])
    }, TIMING.chatReplyMs)
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
