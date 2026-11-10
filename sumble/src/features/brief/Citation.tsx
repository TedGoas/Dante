import * as React from 'react'

import { SOURCES } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'

function revealSource(id: number) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document
    .getElementById(`source-${id}`)
    ?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
}

/** A [n] marker. Hover or focus highlights the source. Chat citations also scroll it into view. */
export function Citation({ id, origin }: { id: number; origin: 'chat' | 'doc' }) {
  const { setHoveredSource, pinSource } = useBrief()
  const source = SOURCES.find((s) => s.id === id)

  function activate() {
    setHoveredSource(id)
    if (origin === 'chat') revealSource(id)
  }

  return (
    <button
      type="button"
      aria-label={source ? `Source ${id}: ${source.type}, ${source.title}` : `Source ${id}`}
      onMouseEnter={activate}
      onMouseLeave={() => setHoveredSource(null)}
      onFocus={activate}
      onBlur={() => setHoveredSource(null)}
      onClick={() => {
        pinSource(id)
        revealSource(id)
      }}
      className="cursor-pointer rounded-sm px-px font-medium text-green-700 tabular-nums hover:underline"
    >
      [{id}]
    </button>
  )
}

/** Renders text, turning each [n] into a Citation. */
export function CitedText({ text, origin }: { text: string; origin: 'chat' | 'doc' }) {
  return (
    <>
      {text.split(/(\[\d+\])/).map((part, i) => {
        const match = part.match(/^\[(\d+)\]$/)
        return match ? (
          <Citation key={i} id={Number(match[1])} origin={origin} />
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      })}
    </>
  )
}
