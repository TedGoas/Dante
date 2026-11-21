import { XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { ORG, TIMING } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { cn } from '@/lib/utils'

export function Toast() {
  const { toastVisible, dismissToast, openBrief } = useBrief()
  const [leaving, setLeaving] = React.useState(false)
  const wasVisible = React.useRef(false)
  const toastRef = React.useRef<HTMLDivElement>(null)
  const openRef = React.useRef<HTMLButtonElement>(null)
  const hadFocus = React.useRef(false)

  React.useEffect(() => {
    const active = document.activeElement
    if (toastVisible) {
      wasVisible.current = true
      setLeaving(false)
      // Only take focus if the rep hasn't moved on to something else.
      if (active === document.body || active?.closest('[data-brief-tile]')) openRef.current?.focus()
      return
    }
    if (!wasVisible.current) return
    wasVisible.current = false
    if (hadFocus.current && (active === document.body || toastRef.current?.contains(active))) {
      document.querySelector<HTMLButtonElement>('[data-brief-primary]')?.focus()
    }
    hadFocus.current = false
    setLeaving(true)
    const timer = window.setTimeout(() => setLeaving(false), TIMING.toastExitMs)
    return () => window.clearTimeout(timer)
  }, [toastVisible])

  return (
    <div role="status" className="fixed right-3 bottom-14 z-40">
      {toastVisible || leaving ? (
        <div
          ref={toastRef}
          onFocus={() => (hadFocus.current = true)}
          className={cn(
            'flex items-center gap-3 rounded-card border border-border bg-background py-2 pr-2 pl-3 text-body shadow-menu',
            toastVisible ? 'animate-fade-up' : 'translate-y-1 opacity-0 transition duration-100 ease-quint'
          )}
        >
          <span className="font-medium text-slate-900">Brief ready for {ORG.name}</span>
          <Button ref={openRef} size="xs" onClick={() => openBrief()}>
            Open
          </Button>
          {/* No tooltip here, to match the dialog close button. */}
          <Button aria-label="Dismiss" size="icon-sm" variant="ghost" onClick={dismissToast}>
            <XIcon />
          </Button>
        </div>
      ) : null}
    </div>
  )
}
