import type { ReactNode } from 'react'

import { NyseLogo } from '@/components/NyseLogo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home', active: false },
  { label: 'Broker Configuration', active: true },
  { label: 'Audit Logs', active: false },
  { label: 'Settings', active: false },
] as const

/** Shared inset for logo, nav, and footer — aside stays flush; padding lives on items. */
const sidebarInset =
  'border-l-4 border-transparent pl-5 pr-5'

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
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-nyse-nav py-workos">
        <div className={cn('mb-12', sidebarInset)}>
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
                    className={cn(
                      sidebarInset,
                      'block border-ice-blue text-sm font-bold text-foreground'
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn(
                      sidebarInset,
                      'block text-sm font-normal text-muted-foreground'
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
          <div className="mt-auto border-t border-border pt-workos">
            <div className={sidebarInset}>{footer}</div>
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
