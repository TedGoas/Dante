import { ArrowRightIcon } from 'lucide-react'
import * as React from 'react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { angleSourceIds, initials, TIMING, type Angle } from '@/data/clio'
import { EvidenceMeter } from '@/features/brief/AngleCards'
import { contactFor, useBrief } from '@/features/brief/BriefContext'
import { cn } from '@/lib/utils'

const VISIBLE_FACES = 3

function useCountUp(target: number, enabled: boolean, delayMs: number) {
  const [value, setValue] = React.useState(enabled ? 0 : target)

  React.useEffect(() => {
    if (!enabled || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target)
      return
    }
    let frame = 0
    const start = performance.now() + delayMs
    const tick = (now: number) => {
      const progress = Math.min(Math.max(now - start, 0) / TIMING.countUpMs, 1)
      setValue(target * (1 - (1 - progress) ** 5))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, enabled, delayMs])

  return value
}

/** One whole card is the button. It opens the Brief tab with this angle selected. */
export function AngleLaunchCard({
  angle,
  index,
  recommended,
  reveal,
}: {
  angle: Angle
  index: number
  recommended: boolean
  reveal: boolean
}) {
  const { openBrief } = useBrief()
  const delayMs = TIMING.revealFirstCardMs + index * TIMING.revealCardStaggerMs
  const value = useCountUp(angle.stat.value, reveal, delayMs)
  const contacts = angle.contacts.map((c) => contactFor(c.id))
  const faces = contacts.slice(0, VISIBLE_FACES)
  const extra = contacts.length - faces.length
  const weak = angle.evidence === 'Weak'
  const contactNames = contacts.map((c) => c.name.split(' ')[0]).join(', ')

  return (
    <button
      type="button"
      onClick={() => openBrief({ angleId: angle.id })}
      style={reveal ? { animationDelay: `${delayMs}ms` } : undefined}
      className={cn(
        'group flex min-w-0 cursor-pointer flex-col rounded-card border p-3 text-left transition duration-150 ease-quint active:scale-[0.99]',
        recommended ? 'border-green-700 bg-selected hover:bg-green-100/60' : 'border-border bg-background hover:border-slate-400',
        reveal && 'animate-fade-up'
      )}
    >
      <span className="flex h-5 items-center justify-between gap-2">
        <span className="truncate text-sm font-semibold text-slate-900">{angle.short}</span>
        {recommended ? <Badge variant="green">Recommended</Badge> : null}
      </span>
      <span className="mt-2 flex items-baseline gap-1.5">
        <span className={cn('text-xl tabular-nums', weak ? 'font-medium text-slate-500' : 'font-semibold text-slate-900')}>
          {angle.stat.prefix}
          {value.toFixed(angle.stat.decimals)}
          {angle.stat.suffix}
        </span>
        <span className="truncate text-xs text-slate-500">{angle.stat.label}</span>
      </span>
      <span className="mt-1 text-body text-slate-600">{angle.summary}</span>
      <span className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
        <EvidenceMeter evidence={angle.evidence} animated={reveal} delayMs={delayMs} />
        <span aria-hidden>·</span>
        {angleSourceIds(angle).length} sources
      </span>
      <span className="mt-auto flex items-center pt-2">
        <span className="sr-only">Contacts: {contactNames}</span>
        <span aria-hidden className="flex items-center">
          {faces.map((contact, i) => (
            <Avatar
              key={contact.id}
              style={reveal ? { animationDelay: `${delayMs + 120 + i * 50}ms` } : undefined}
              className={cn('-ml-1 size-7 ring-2 ring-white first:ml-0', reveal && 'animate-pop-in')}
            >
              <AvatarFallback className="text-[10px]">{initials(contact.name)}</AvatarFallback>
            </Avatar>
          ))}
          {extra > 0 ? <span className="ml-1.5 text-xs text-slate-500">+{extra}</span> : null}
        </span>
        <ArrowRightIcon
          aria-hidden
          className="ml-auto size-4 text-slate-500 transition duration-150 ease-quint group-hover:translate-x-0.5 group-hover:text-slate-900"
        />
      </span>
    </button>
  )
}
