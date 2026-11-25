import { CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { MOTION, prefersReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/utils'

/*
 * Toasts: <ToastProvider> once at the root, then `const { toast } = useToast()`.
 * Announced via aria-live (errors assertively). Auto-dismiss pauses on hover
 * or focus. Every tone has an icon, not just a color.
 */

export type ToastTone = 'success' | 'info' | 'error'

export type ToastOptions = {
  tone?: ToastTone
  title: string
  body?: string
  /** e.g. { label: 'Undo', onClick: revert } */
  action?: { label: string; onClick: () => void }
  durationMs?: number
}

type ToastItem = ToastOptions & { id: number }

const ToastContext = React.createContext<{ toast: (options: ToastOptions) => number; dismiss: (id: number) => void } | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

const toneIcon = {
  success: <CheckCircle2Icon className="text-emerald-600" aria-hidden />,
  info: <InfoIcon className="text-blue-600" aria-hidden />,
  error: <XCircleIcon className="text-red-600" aria-hidden />,
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([])
  const nextId = React.useRef(1)

  const dismiss = React.useCallback((id: number) => setItems((list) => list.filter((t) => t.id !== id)), [])
  const toast = React.useCallback((options: ToastOptions) => {
    const id = nextId.current++
    setItems((list) => [...list.slice(-3), { tone: 'info', ...options, id }])
    return id
  }, [])

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <section
        aria-label="Notifications"
        className="pointer-events-none fixed right-4 bottom-4 z-[60] flex w-[360px] max-w-[calc(100vw-2rem)] flex-col gap-2"
      >
        {/* Polite region for success/info, assertive for errors. Both always mounted so screen readers pick them up. */}
        <div aria-live="polite" className="flex flex-col gap-2">
          {items.filter((t) => t.tone !== 'error').map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
        <div aria-live="assertive" className="flex flex-col gap-2">
          {items.filter((t) => t.tone === 'error').map((t) => (
            <ToastCard key={t.id} item={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
      </section>
    </ToastContext.Provider>
  )
}

function ToastCard({ item, onDismiss: remove }: { item: ToastItem; onDismiss: () => void }) {
  const [paused, setPaused] = React.useState(false)
  const [leaving, setLeaving] = React.useState(false)
  const duration = item.durationMs ?? (item.action ? 8000 : 5000)

  // Soft exit: fade + drop, then unmount. Exits are faster than enters.
  const onDismiss = React.useCallback(() => {
    if (prefersReducedMotion()) return remove()
    setLeaving(true)
    window.setTimeout(remove, MOTION.exit)
  }, [remove])

  React.useEffect(() => {
    if (paused || leaving) return
    const timer = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timer)
  }, [paused, leaving, duration, onDismiss])

  return (
    <div
      role={item.tone === 'error' ? 'alert' : 'status'}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        'pointer-events-auto flex items-start gap-3 rounded-xl border bg-white py-3 pr-2 pl-3.5 shadow-menu transition-[opacity,transform] duration-[140ms] ease-quint [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0',
        leaving ? 'translate-y-1 opacity-0' : 'animate-toast-in',
        item.tone === 'error' ? 'border-red-200' : 'border-border'
      )}
    >
      {toneIcon[item.tone ?? 'info']}
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-gray-900">{item.title}</p>
        {item.body && <p className="mt-0.5 text-[13px] text-gray-500">{item.body}</p>}
      </div>
      {item.action && (
        <Button
          size="xs"
          variant="secondary"
          onClick={() => {
            item.action!.onClick()
            onDismiss()
          }}
        >
          {item.action.label}
        </Button>
      )}
      <Button aria-label="Dismiss notification" size="icon-sm" variant="ghost" className="-my-1 size-7" onClick={onDismiss}>
        <XIcon />
      </Button>
    </div>
  )
}
