import * as React from 'react'

import { cn } from '@/lib/utils'

/*
 * Accessible tabs without a dependency: WAI-ARIA tablist with roving
 * tabindex. Arrow keys move and select, Home/End jump. Controlled or not.
 */

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
  baseId: string
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabs() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tab components must be inside <Tabs>')
  return ctx
}

function Tabs({
  value: controlled,
  defaultValue,
  onValueChange,
  className,
  children,
}: {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}) {
  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? '')
  const value = controlled ?? uncontrolled
  const baseId = React.useId()
  const setValue = React.useCallback(
    (next: string) => {
      if (controlled === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange]
  )
  return (
    <TabsContext.Provider value={{ value, setValue, baseId }}>
      <div data-slot="tabs" className={cn('flex min-h-0 flex-col', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

function TabList({ className, label, children }: { className?: string; label: string; children: React.ReactNode }) {
  const listRef = React.useRef<HTMLDivElement>(null)
  const { setValue } = useTabs()

  function onKeyDown(event: React.KeyboardEvent) {
    const tabs = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? [])
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement)
    if (index < 0) return
    let next = -1
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    if (next < 0) return
    event.preventDefault()
    tabs[next].focus()
    setValue(tabs[next].dataset.value!)
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn('flex shrink-0 items-center gap-1 border-b border-border', className)}
    >
      {children}
    </div>
  )
}

function Tab({
  value,
  count,
  disabled,
  children,
}: {
  value: string
  /** Optional count shown as a small pill (e.g. outstanding conditions). */
  count?: number
  disabled?: boolean
  children: React.ReactNode
}) {
  const ctx = useTabs()
  const selected = ctx.value === value
  return (
    <button
      type="button"
      role="tab"
      id={`${ctx.baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${ctx.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      data-value={value}
      onClick={() => ctx.setValue(value)}
      className={cn(
        '-mb-px inline-flex h-10 cursor-pointer items-center gap-1.5 border-b-2 px-2.5 text-[13px] font-medium transition-colors focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        selected ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            'min-w-5 rounded-full px-1.5 text-center text-[11px] leading-[18px] tabular-nums',
            selected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
          )}
        >
          {count}
        </span>
      )}
    </button>
  )
}

function TabPanel({ value, className, children }: { value: string; className?: string; children: React.ReactNode }) {
  const ctx = useTabs()
  if (ctx.value !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${ctx.baseId}-panel-${value}`}
      aria-labelledby={`${ctx.baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('min-h-0 flex-1 focus-visible:-outline-offset-2', className)}
    >
      {children}
    </div>
  )
}

export { Tabs, TabList, Tab, TabPanel }
