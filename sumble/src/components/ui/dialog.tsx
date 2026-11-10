import { XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** Native <dialog>: the browser handles the focus trap, Esc, and top layer. */
function Dialog({
  open,
  onClose,
  title,
  badge,
  placement = 'center',
  footer,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  badge?: React.ReactNode
  placement?: 'center' | 'right'
  footer?: React.ReactNode
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDialogElement>(null)
  const titleId = React.useId()

  React.useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className={cn(
        'flex-col bg-background p-0 text-foreground shadow-menu backdrop:bg-slate-900/40 open:flex',
        placement === 'right'
          ? 'my-0 mr-0 ml-auto h-dvh max-h-dvh w-[480px] max-w-none'
          : 'm-auto max-h-[80dvh] w-[680px] max-w-none rounded-xl'
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <h2 id={titleId} className="text-base font-semibold text-slate-900">
          {title}
        </h2>
        {badge}
        {/* No tooltip here: this button takes focus on open, and a tooltip would swallow Esc. */}
        <Button aria-label="Close" variant="ghost" size="icon-sm" className="ml-auto" onClick={onClose}>
          <XIcon />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      {footer ? <div className="flex items-center gap-2 border-t border-border px-5 py-3">{footer}</div> : null}
    </dialog>
  )
}

export { Dialog }
