import { XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { ORG } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'

export function Toast() {
  const { toastVisible, dismissToast, openBrief } = useBrief()
  const openRef = React.useRef<HTMLButtonElement>(null)
  const hadFocus = React.useRef(false)

  React.useEffect(() => {
    if (toastVisible) {
      // Only take focus if the rep hasn't moved on to something else.
      const active = document.activeElement
      if (active === document.body || active?.closest('[data-brief-tile]')) openRef.current?.focus()
      return
    }
    if (hadFocus.current && document.activeElement === document.body) {
      document.querySelector<HTMLButtonElement>('[data-brief-tile] button')?.focus()
    }
    hadFocus.current = false
  }, [toastVisible])

  return (
    <div role="status" className="fixed right-3 bottom-14 z-40">
      {toastVisible ? (
        <div
          onFocus={() => (hadFocus.current = true)}
          className="flex items-center gap-3 rounded-card border border-border bg-background py-2 pr-2 pl-3 text-body shadow-menu motion-safe:animate-fade-in"
        >
          <span className="font-medium text-slate-900">Brief ready for {ORG.name}</span>
          <Button ref={openRef} size="xs" onClick={openBrief}>
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
