import { XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type DialogProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: React.ReactNode
  badge?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
  /** Tailwind width class for centered dialogs. */
  width?: string
  className?: string
}

/**
 * Native <dialog>: the browser handles the focus trap, Esc, inert background
 * and top layer. Ported from sumble/. Focus returns to the opener on close.
 */
function DialogBase({
  open,
  onClose,
  title,
  description,
  badge,
  footer,
  children,
  placement,
  width,
  className,
}: DialogProps & { placement: 'center' | 'right' }) {
  const ref = React.useRef<HTMLDialogElement>(null)
  const titleId = React.useId()
  const descId = React.useId()
  const opener = React.useRef<Element | null>(null)

  React.useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      opener.current = document.activeElement
      dialog.showModal()
    }
    if (!open && dialog.open) {
      dialog.close()
      if (opener.current instanceof HTMLElement) opener.current.focus()
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      data-placement={placement}
      onClose={() => open && onClose()}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
      className={cn(
        'dialog-motion flex-col bg-background p-0 text-foreground shadow-menu backdrop:bg-gray-900/40 open:flex',
        placement === 'right'
          ? 'my-0 mr-0 ml-auto h-dvh max-h-dvh w-[440px] max-w-[calc(100vw-2rem)]'
          : cn('m-auto max-h-[85dvh] max-w-[calc(100vw-2rem)] rounded-2xl', width ?? 'w-[520px]'),
        className
      )}
    >
      <div className="flex items-start gap-2 border-b border-border px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 id={titleId} className="text-base">
              {title}
            </h2>
            {badge}
          </div>
          {description && (
            <p id={descId} className="mt-1 text-[13px] text-gray-500">
              {description}
            </p>
          )}
        </div>
        {/* No tooltip: this button takes focus on open, and a tooltip would swallow Esc. */}
        <Button aria-label="Close" variant="ghost" size="icon-sm" className="-mt-1 -mr-2" onClick={onClose}>
          <XIcon />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
      {footer ? (
        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-3">{footer}</div>
      ) : null}
    </dialog>
  )
}

/** Centered modal. */
function Dialog(props: DialogProps) {
  return <DialogBase {...props} placement="center" />
}

/** Right-side panel. Same behavior as Dialog. */
function Sheet(props: DialogProps) {
  return <DialogBase {...props} placement="right" />
}

export { Dialog, Sheet }
