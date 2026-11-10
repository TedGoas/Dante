import * as React from 'react'

import { Button } from '@/components/ui/button'
import { currentPreset, useBrief, type DemoPreset } from '@/features/brief/BriefContext'
import { cn } from '@/lib/utils'

const PRESETS: { id: DemoPreset; label: string }[] = [
  { id: 'before', label: 'Before' },
  { id: 'zero', label: '0 credits' },
  { id: 'during', label: 'During' },
  { id: 'tile', label: 'Ready tile' },
  { id: 'stale', label: 'Generated 3 days ago' },
  { id: 'brief', label: 'Brief open' },
]

/** Demo-only state switcher. Hide it before recording. */
export function DevToolbar() {
  const { status, credits, tab, generated, jumpTo } = useBrief()
  const [hidden, setHidden] = React.useState(false)
  const active = currentPreset(status, credits, tab, generated)

  if (hidden) {
    return (
      <Button
        size="xs"
        variant="outline"
        className="fixed right-3 bottom-3 z-40"
        onClick={() => setHidden(false)}
      >
        Demo
      </Button>
    )
  }

  return (
    <div
      role="toolbar"
      aria-label="Demo states"
      className="fixed right-3 bottom-3 z-40 flex items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-menu"
    >
      {PRESETS.map((preset) => (
        <Button
          key={preset.id}
          size="xs"
          variant="ghost"
          aria-pressed={active === preset.id}
          className={cn(active === preset.id && 'bg-slate-200 text-slate-900')}
          onClick={() => jumpTo(preset.id)}
        >
          {preset.label}
        </Button>
      ))}
      <Button size="xs" variant="ghost" onClick={() => setHidden(true)}>
        Hide
      </Button>
    </div>
  )
}
