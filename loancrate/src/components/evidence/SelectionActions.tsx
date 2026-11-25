import { FilePlus2Icon, FlagIcon, SparklesIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

/*
 * Select text on a document page to act on it (beautifului.dev "Selection
 * actions"). A small toolbar fades in above the selection. Esc or clicking
 * elsewhere dismisses it. The toolbar is in the tab order while visible.
 */

export type SelectionAction = 'create-condition' | 'ask-ai' | 'flag'

export function SelectionActions({
  onAction,
  children,
  className,
}: {
  onAction: (action: SelectionAction, quote: string) => void
  children: React.ReactNode
  className?: string
}) {
  const rootRef = React.useRef<HTMLDivElement>(null)
  const [state, setState] = React.useState<{ quote: string; x: number; y: number } | null>(null)

  const read = React.useCallback(() => {
    const root = rootRef.current
    const sel = window.getSelection()
    if (!root || !sel || sel.isCollapsed || sel.rangeCount === 0) return setState(null)
    const range = sel.getRangeAt(0)
    if (!root.contains(range.commonAncestorContainer)) return setState(null)
    const quote = sel.toString().replace(/\s+/g, ' ').trim()
    if (quote.length < 2) return setState(null)
    const r = range.getBoundingClientRect()
    const b = root.getBoundingClientRect()
    setState({ quote, x: r.left - b.left + r.width / 2, y: r.top - b.top })
  }, [])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setState(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const run = (action: SelectionAction) => {
    if (!state) return
    onAction(action, state.quote)
    window.getSelection()?.removeAllRanges()
    setState(null)
  }

  return (
    <div
      ref={rootRef}
      onMouseUp={() => window.setTimeout(read, 0)}
      onKeyUp={(e) => e.shiftKey && read()}
      onMouseDown={(e) => {
        if (!(e.target as HTMLElement).closest('[data-selection-toolbar]')) setState(null)
      }}
      className={cn('relative', className)}
    >
      {children}
      {state && (
        <div
          data-selection-toolbar
          role="toolbar"
          aria-label={`Actions for selected text: ${state.quote.slice(0, 40)}`}
          style={{ left: state.x, top: state.y }}
          className="absolute z-20 flex origin-bottom -translate-x-1/2 -translate-y-[calc(100%+8px)] animate-pop-in items-center gap-0.5 rounded-lg border border-gray-800 bg-gray-900 p-0.5 text-xs font-medium text-white shadow-menu"
        >
          <ToolbarButton onClick={() => run('create-condition')} icon={<FilePlus2Icon />}>
            Create condition
          </ToolbarButton>
          <ToolbarButton onClick={() => run('ask-ai')} icon={<SparklesIcon />}>
            Ask AI
          </ToolbarButton>
          <ToolbarButton onClick={() => run('flag')} icon={<FlagIcon />}>
            Flag
          </ToolbarButton>
        </div>
      )}
    </div>
  )
}

function ToolbarButton({ onClick, icon, children }: { onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-md px-2 whitespace-nowrap hover:bg-white/10 focus-visible:outline-white [&_svg]:size-3.5"
    >
      {icon}
      {children}
    </button>
  )
}
