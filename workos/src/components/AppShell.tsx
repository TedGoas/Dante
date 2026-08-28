import type { ReactNode } from 'react'

import { NyseLogo } from '@/components/NyseLogo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home', active: false },
  { label: 'Broker Configuration', active: true },
  { label: 'Audit Logs', active: false },
  { label: 'Settings', active: false },
] as const

export function AppShell({
  children,
  footer,
  drawer,
  drawerOpen = false,
}: {
  children: ReactNode
  footer?: ReactNode
  drawer?: ReactNode
  drawerOpen?: boolean
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-nyse-nav py-workos pr-workos">
        <div className="mb-12 pl-workos">
          <NyseLogo className="h-8 w-auto" />
        </div>
        <nav aria-label="Broker settings">
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.active ? (
                  <a
                    href="/workos/"
                    aria-current="page"
                    className="block border-l-4 border-ice-blue pl-5 text-sm font-bold text-foreground"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      'block border-l-4 border-transparent pl-5 text-sm font-normal text-muted-foreground'
                    )}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {footer ? (
          <div className="mt-auto flex flex-col gap-3 border-t border-border pl-workos pt-workos">
            {footer}
          </div>
        ) : null}
      </aside>
      <div className="flex min-w-0 flex-1">
        <main className="min-w-0 flex-1 overflow-auto p-workos transition-[width] duration-300 ease-out">
          {children}
        </main>
        {drawer ? (
          <div
            className={cn(
              'shrink-0 overflow-hidden border-border bg-background transition-[width,border-color] duration-300 ease-out',
              drawerOpen
                ? 'w-[var(--drawer-width)] border-l'
                : 'w-0 border-l-0'
            )}
            aria-hidden={!drawerOpen}
          >
            <div className="h-full w-[var(--drawer-width)]">{drawer}</div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
