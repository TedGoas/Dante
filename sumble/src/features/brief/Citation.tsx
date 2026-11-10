import * as React from 'react'

import { SOURCES } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'

function revealSource(id: number) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  document
    .getElementById(`source-${id}`)
    ?.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' })
}

/** A quiet raised [n]. Hover or focus highlights the source. Chat citations also scroll it into view. */
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
      className="ml-px cursor-pointer rounded-sm align-[0.3em] text-[11px] leading-none font-medium text-slate-500 tabular-nums transition-colors duration-150 hover:text-green-700 focus-visible:text-green-700"
    >
      [{id}]
    </button>
  )
}

/** Renders text, turning each [n] into a Citation. Citations never wrap away from the word before them. */
export function CitedText({ text, origin }: { text: string; origin: 'chat' | 'doc' }) {
  return (
    <>
      {text
        .replace(/\s+(?=\[\d+\])/g, '')
        .split(/(\S*(?:\[\d+\])+)/)
        .map((chunk, i) =>
          /\[\d+\]/.test(chunk) ? (
            <span key={i} className="whitespace-nowrap">
              {chunk.split(/(\[\d+\])/).map((part, j) => {
                const match = part.match(/^\[(\d+)\]$/)
                return match ? (
                  <Citation key={j} id={Number(match[1])} origin={origin} />
                ) : (
                  <React.Fragment key={j}>{part}</React.Fragment>
                )
              })}
            </span>
          ) : (
            <React.Fragment key={i}>{chunk}</React.Fragment>
          )
        )}
    </>
  )
}
