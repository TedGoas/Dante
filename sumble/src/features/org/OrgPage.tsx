import { ChevronRightIcon } from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { ORG, TABS, type TabName } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { BriefTab } from '@/features/brief/BriefTab'
import { cn } from '@/lib/utils'

const tabId = (tab: TabName) => `org-tab-${tab.replace(/\s/g, '-').toLowerCase()}`

export function OrgPage() {
  const { tab: activeTab, setTab, status } = useBrief()
  const tabRefs = React.useRef(new Map<TabName, HTMLButtonElement>())

  function onTabKeyDown(event: React.KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: (index + 1) % TABS.length,
      ArrowLeft: (index - 1 + TABS.length) % TABS.length,
      Home: 0,
      End: TABS.length - 1,
    }
    const nextIndex = moves[event.key]
    if (nextIndex === undefined) return
    event.preventDefault()
    setTab(TABS[nextIndex])
    tabRefs.current.get(TABS[nextIndex])?.focus()
  }

  const fillsPanel = activeTab === 'Brief' && status === 'ready'

  return (
    <div className="flex h-full flex-col">
      <header className="px-6 pt-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-xs text-slate-600">
            <li>
              <a href="#" className="hover:text-slate-900">
                Organizations
              </a>
            </li>
            <li aria-hidden>
              <ChevronRightIcon className="size-3" />
            </li>
            <li aria-current="page" className="text-slate-900">
              {ORG.name}
            </li>
          </ol>
        </nav>
        <div className="mt-1.5 flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{ORG.name}</h1>
          <Badge variant="outline" className="ml-auto">
            Sample data
          </Badge>
        </div>
        <p className="mt-0.5 text-body text-slate-600">{ORG.description}</p>
        <p className="mt-1 text-xs text-slate-600">
          {ORG.headcount} headcount · HQ {ORG.hq} · {ORG.domain}
        </p>
      </header>

      <div role="tablist" aria-label="Organization sections" className="mt-3 flex gap-4 border-b border-border px-6">
        {TABS.map((tab, index) => (
          <button
            key={tab}
            id={tabId(tab)}
            ref={(element) => {
              if (element) tabRefs.current.set(tab, element)
            }}
            type="button"
            role="tab"
            aria-selected={tab === activeTab}
            aria-controls="org-tabpanel"
            tabIndex={tab === activeTab ? 0 : -1}
            onClick={() => setTab(tab)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
            className={cn(
              '-mb-px cursor-pointer border-b-2 pb-2 text-body font-medium whitespace-nowrap transition-colors',
              tab === activeTab
                ? 'border-green-700 text-slate-900'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        id="org-tabpanel"
        role="tabpanel"
        aria-labelledby={tabId(activeTab)}
        className={cn('min-h-0 flex-1', fillsPanel ? 'overflow-hidden' : 'overflow-y-auto')}
      >
        {activeTab === 'Brief' ? (
          <BriefTab />
        ) : (
          <p className="p-6 text-body text-slate-600">{activeTab} isn't part of this prototype.</p>
        )}
      </div>
    </div>
  )
}
