import {
  ArrowUpRightIcon,
  BookmarkIcon,
  BuildingIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  FlagIcon,
  FlaskConicalIcon,
  GlobeIcon,
  Loader2Icon,
  MapPinIcon,
  Share2Icon,
  TagIcon,
  UsersIcon,
} from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ORG, TABS, type TabName } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { BriefTab } from '@/features/brief/BriefTab'
import { OverviewTab } from '@/features/org/OverviewTab'
import { cn } from '@/lib/utils'

const tabId = (tab: TabName) => `org-tab-${tab.replace(/\s/g, '-').toLowerCase()}`

const META_ICON = 'size-3.5 shrink-0 text-slate-500'

function MetaRow() {
  return (
    <ul className="mt-2 flex items-center gap-4 text-xs whitespace-nowrap text-slate-500">
      <li className="flex items-center gap-1">
        <FlaskConicalIcon aria-hidden className={META_ICON} />
        {ORG.industry}
      </li>
      <li className="flex items-center gap-1">
        <UsersIcon aria-hidden className={META_ICON} />
        {ORG.headcount} headcount
      </li>
      <li className="flex items-center gap-1">
        <MapPinIcon aria-hidden className={META_ICON} />
        HQ in {ORG.hq}
      </li>
      <li className="flex items-center gap-1">
        <CalendarIcon aria-hidden className={META_ICON} />
        Founded {ORG.founded}
      </li>
      <li>
        <button type="button" className="flex cursor-pointer items-center gap-1 rounded-sm hover:text-slate-900">
          <BuildingIcon aria-hidden className={META_ICON} />
          Parent of {ORG.parentOf} orgs
          <ChevronDownIcon aria-hidden className="size-3" />
        </button>
      </li>
      <li className="flex items-center gap-1">
        <GlobeIcon aria-hidden className={META_ICON} />
        <a href="#" className="inline-flex items-center gap-0.5 rounded-sm text-green-700 hover:underline">
          {ORG.domain}
          <ArrowUpRightIcon aria-hidden className="size-3" />
        </a>
        <span>+{ORG.domainMore}</span>
      </li>
      <li className="flex items-center gap-1">
        <TagIcon aria-hidden className={META_ICON} />
        {ORG.tag} <span>+{ORG.tagMore}</span>
      </li>
    </ul>
  )
}

function BriefTabStatus() {
  const { status } = useBrief()
  if (status === 'generating') {
    return (
      <>
        <Loader2Icon aria-hidden className="size-3 text-slate-600 motion-safe:animate-spin" />
        <span className="sr-only">, generating</span>
      </>
    )
  }
  if (status === 'ready') {
    return (
      <>
        <span aria-hidden className="size-1.5 animate-pop-in rounded-full bg-green-600" />
        <span className="sr-only">, ready</span>
      </>
    )
  }
  return null
}

export function OrgPage() {
  const { tab: activeTab, setTab, status } = useBrief()
  const tabRefs = React.useRef(new Map<TabName, HTMLButtonElement>())
  const [underline, setUnderline] = React.useState({ left: 0, width: 0, glide: false })

  // Re-measures on status too, because the Brief tab's indicator changes tab widths.
  React.useLayoutEffect(() => {
    const element = tabRefs.current.get(activeTab)
    if (!element) return
    const { offsetLeft: left, offsetWidth: width } = element
    setUnderline((current) => ({ left, width, glide: current.width > 0 }))
  }, [activeTab, status])

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
      <header className="px-6 pt-2">
        <div className="flex h-7 items-center">
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
          <div className="ml-auto flex items-center gap-1">
            <Button size="xs" variant="ghost">
              <Share2Icon />
              Share this view
            </Button>
            <Button size="xs" variant="ghost">
              <FlagIcon />
              Report data issue
            </Button>
            <Button size="xs" variant="ghost">
              <BookmarkIcon />
              Saved views
              <ChevronDownIcon />
            </Button>
          </div>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{ORG.name}</h1>
          <Badge variant="green" className="ml-1 tabular-nums">
            {ORG.icp.score} {ORG.icp.label}
          </Badge>
          <a href="#" className="rounded-sm text-xs font-medium text-green-700 underline-offset-4 hover:underline">
            Learn more
          </a>
          <Badge variant="outline" className="ml-auto">
            Sample data
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-body text-slate-600">{ORG.description}</p>
        <MetaRow />
      </header>

      <div role="tablist" aria-label="Organization sections" className="relative mt-4 flex gap-5 border-b border-border px-6">
        <span
          aria-hidden
          style={{ transform: `translateX(${underline.left}px)`, width: underline.width }}
          className={cn(
            'absolute -bottom-px left-0 h-0.5 bg-green-700',
            underline.glide && 'transition-[transform,width] duration-200 ease-quint'
          )}
        />
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
              'flex cursor-pointer items-center gap-1.5 pb-2.5 text-body font-medium whitespace-nowrap transition-colors duration-150',
              tab === activeTab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            )}
          >
            {tab}
            {tab === 'Brief' ? <BriefTabStatus /> : null}
          </button>
        ))}
      </div>

      <div
        id="org-tabpanel"
        role="tabpanel"
        aria-labelledby={tabId(activeTab)}
        className={cn('min-h-0 flex-1 bg-app', fillsPanel ? 'overflow-hidden bg-page' : 'overflow-y-auto')}
      >
        {activeTab === 'Overview' ? <OverviewTab /> : null}
        {activeTab === 'Brief' ? <BriefTab /> : null}
        {activeTab !== 'Overview' && activeTab !== 'Brief' ? (
          <p className="p-6 text-body text-slate-600">{activeTab} isn't part of this prototype.</p>
        ) : null}
      </div>
    </div>
  )
}
