import * as React from 'react'

/*
 * Motion beats for the whole prototype. Follows .cursor/skills/motion:
 * ease-out only, chrome under ~300ms, exits faster than enters, stagger
 * 40–80ms, never delay keyboard paths, reduced motion = final frame.
 * CSS keyframes in index.css use the same numbers.
 */
export const MOTION = {
  fast: 120,
  base: 180,
  enter: 220,
  exit: 140,
  stagger: 50,
  streamWordMs: 28,
  sweepCellMs: 90,
  traceStepMs: 520,
  ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
} as const

const REDUCED = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(prefersReducedMotion)
  React.useEffect(() => {
    const mql = window.matchMedia(REDUCED)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * One indicator that glides between items (tabs underline, list hover pill,
 * segmented control). Snaps into place on first appearance, glides after.
 * The indicator and items must share an offsetParent (make the container
 * `relative`). Pass `instant` for keyboard moves so arrows are never delayed.
 */
export function useGlide() {
  const reduced = usePrefersReducedMotion()
  const [rect, setRect] = React.useState({ x: 0, y: 0, w: 0, h: 0, visible: false, glide: false })

  const moveTo = React.useCallback(
    (el: HTMLElement | null | undefined, options: { instant?: boolean } = {}) => {
      if (!el) {
        setRect((r) => ({ ...r, visible: false, glide: false }))
        return
      }
      const next = { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight }
      setRect((r) =>
        r.visible && r.x === next.x && r.y === next.y && r.w === next.w && r.h === next.h
          ? r
          : { ...next, visible: true, glide: r.visible && !options.instant && !reduced }
      )
    },
    [reduced]
  )

  const style: React.CSSProperties = {
    transform: `translate(${rect.x}px, ${rect.y}px)`,
    width: rect.w,
    height: rect.h,
  }
  const className = [
    'pointer-events-none absolute top-0 left-0',
    rect.glide ? 'transition-[transform,width,height,opacity] duration-200 ease-quint' : '',
    rect.visible ? 'opacity-100' : 'opacity-0',
  ].join(' ')

  return { moveTo, style, className, visible: rect.visible, rect }
}

/**
 * FLIP: children with `data-flip-key` slide from their previous position to
 * the new one when `deps` change (sort, filter, status). New children fade
 * up. Uses the Web Animations API; no-op under reduced motion.
 */
export function useFlip(ref: React.RefObject<HTMLElement | null>, deps: React.DependencyList) {
  const positions = React.useRef(new Map<string, { x: number; y: number }>())
  React.useLayoutEffect(() => {
    const container = ref.current
    if (!container) return
    const reduced = prefersReducedMotion()
    const children = Array.from(container.querySelectorAll<HTMLElement>(':scope > [data-flip-key]'))
    const hadPrevious = positions.current.size > 0
    const next = new Map<string, { x: number; y: number }>()
    for (const child of children) {
      const key = child.dataset.flipKey!
      const pos = { x: child.offsetLeft, y: child.offsetTop }
      const prev = positions.current.get(key)
      next.set(key, pos)
      if (reduced) continue
      if (prev) {
        const dx = prev.x - pos.x
        const dy = prev.y - pos.y
        if (dx || dy) {
          child.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
            duration: MOTION.enter,
            easing: MOTION.ease,
          })
        }
      } else if (hadPrevious) {
        child.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], {
          duration: MOTION.base,
          easing: MOTION.ease,
        })
      }
    }
    positions.current = next
  }, deps)
}

/** Whole seconds since `running` became true (real clock). Stops when false. */
export function useElapsed(running: boolean): number {
  const [seconds, setSeconds] = React.useState(0)
  React.useEffect(() => {
    if (!running) return
    const start = Date.now()
    setSeconds(0)
    const timer = window.setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 250)
    return () => window.clearInterval(timer)
  }, [running])
  return seconds
}

/**
 * Reveal `total` items one at a time (stream words, trace steps, sweep
 * cells). Under reduced motion everything is revealed immediately.
 * Change `runKey` to replay.
 */
export function useReveal(total: number, { stepMs, running = true, runKey }: { stepMs: number; running?: boolean; runKey?: unknown }) {
  const [count, setCount] = React.useState(() => (prefersReducedMotion() || !running ? total : 0))

  React.useEffect(() => {
    if (!running) return
    if (prefersReducedMotion()) {
      setCount(total)
      return
    }
    setCount(0)
    let n = 0
    const timer = window.setInterval(() => {
      n += 1
      setCount(n)
      if (n >= total) window.clearInterval(timer)
    }, stepMs)
    return () => window.clearInterval(timer)
  }, [total, stepMs, running, runKey])

  return { count, done: count >= total, skip: () => setCount(total) }
}
