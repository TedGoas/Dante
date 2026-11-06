import { BellIcon, ChevronRightIcon, PlusIcon, SearchIcon } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { IconButton } from '@/components/ui/icon-button'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AccountsTable } from '@/features/accounts/AccountsTable'
import { cn } from '@/lib/utils'

const navItems = ['Accounts', 'People', 'Technologies', 'Lists']
const tabs = ['All accounts', 'My territory', 'Recently viewed']

export default function App() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="min-h-dvh">
        <header className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-[94.5rem] items-center gap-8 px-4 md:px-9">
            <a href="#" className="flex items-center gap-2.5" aria-label="Prototype home">
              <span
                aria-hidden
                className="grid size-6.5 place-items-center rounded-md bg-green-700 text-sm font-bold text-white"
              >
                S
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-slate-900">
                Sumble
              </span>
            </a>
            <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
              {navItems.map((item, i) => (
                <a
                  key={item}
                  href="#"
                  aria-current={i === 0 ? 'page' : undefined}
                  className={cn(
                    'text-sm leading-4 font-medium transition-colors hover:text-green-700',
                    i === 0 ? 'text-slate-900' : 'text-slate-500'
                  )}
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1.5">
              <IconButton label="Search" size="icon">
                <SearchIcon />
              </IconButton>
              <IconButton label="Notifications" size="icon">
                <BellIcon />
              </IconButton>
              <Avatar className="ml-1.5">
                <AvatarFallback>TG</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="mx-auto flex max-w-[94.5rem] flex-col gap-5 px-4 py-6 md:px-9">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-[13px] text-slate-500">
              <li data-slot="breadcrumb-link">
                <a href="#" className="hover:text-slate-900">
                  Workspace
                </a>
              </li>
              <li aria-hidden>
                <ChevronRightIcon className="size-3.5" />
              </li>
              <li data-slot="breadcrumb-page" aria-current="page" className="text-slate-900">
                Accounts
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Accounts</h1>
              <p className="mt-1 text-sm text-slate-500">
                Companies ranked by buying signal from hiring, tech stack, and initiatives.
              </p>
            </div>
            <Button>
              <PlusIcon />
              New list
            </Button>
          </div>

          <div role="tablist" aria-label="Account views" className="flex gap-5 border-b border-border">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={i === 0}
                className={cn(
                  '-mb-px cursor-pointer border-b-2 pb-2.5 text-sm font-medium transition-colors',
                  i === 0
                    ? 'border-green-700 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <AccountsTable />
        </main>
      </div>
    </TooltipProvider>
  )
}
