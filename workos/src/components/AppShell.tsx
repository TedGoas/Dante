import type { ReactNode } from 'react'

import { NyseLogo } from '@/components/NyseLogo'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { label: 'Home', active: false },
  { label: 'Broker Configuration', active: true },
  { label: 'Audit Logs', active: false },
  { label: 'Settings', active: false },
] as const

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-nyse-nav py-8 pr-6">
        <div className="mb-12 pl-6">
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
      </aside>
      <main className="min-w-0 flex-1 overflow-auto px-8 py-10 sm:px-10">
        {children}
      </main>
    </div>
  )
}
