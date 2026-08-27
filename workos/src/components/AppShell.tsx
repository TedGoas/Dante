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
      <aside className="flex w-60 shrink-0 flex-col border-r border-border px-6 py-8">
        <div className="mb-10">
          <NyseLogo className="h-9 w-auto" />
        </div>
        <nav aria-label="Broker settings">
          <ul className="flex flex-col gap-5">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.active ? (
                  <a
                    href="/workos/"
                    aria-current="page"
                    className="text-sm font-bold text-foreground"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span
                    className={cn('text-sm font-normal text-muted-foreground')}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
