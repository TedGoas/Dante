import { FileTextIcon, FolderOpenIcon, LayoutGridIcon, ListChecksIcon, SearchIcon, TableIcon } from 'lucide-react'
import * as React from 'react'

import { CommandPalette, type CommandItem } from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { ToastProvider } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { conditions } from '@/data/conditions'
import { documents } from '@/data/documents'
import { DEMO_LOAN_ID, getLoan, loans } from '@/data/loans'
import { StyleGuide } from '@/features/kit/StyleGuide'
import { LoanDetail } from '@/features/loan/LoanDetail'
import { PipelinePage } from '@/features/pipeline/PipelinePage'
import { cn } from '@/lib/utils'

/*
 * Hash routes, no router package:
 *   #/kit[/section]   style guide
 *   #/pipeline        loan pipeline
 *   #/loan/{id}       loan detail (?doc={docId} or ?condition={conditionId})
 */
type Route =
  | { view: 'kit'; section?: string }
  | { view: 'pipeline' }
  | { view: 'loan'; loanId: string; doc?: string; condition?: string }

function parse(hash: string): Route {
  const [path, query = ''] = hash.replace(/^#/, '').split('?')
  const [, view, arg] = path.split('/')
  const params = new URLSearchParams(query)
  if (view === 'pipeline') return { view: 'pipeline' }
  if (view === 'loan') return { view: 'loan', loanId: arg || DEMO_LOAN_ID, doc: params.get('doc') ?? undefined, condition: params.get('condition') ?? undefined }
  return { view: 'kit', section: arg }
}

const go = (hash: string) => {
  window.location.hash = hash
}

/** Everything ⌘K can find. Built once from seed data. */
const commandItems: CommandItem[] = [
  { id: 'nav-kit', group: 'Go to', label: 'Style guide', icon: <LayoutGridIcon />, onSelect: () => go('#/kit') },
  { id: 'nav-pipeline', group: 'Go to', label: 'Pipeline', icon: <TableIcon />, onSelect: () => go('#/pipeline') },
  ...loans.map((l) => ({
    id: `loan-${l.id}`,
    group: 'Loans',
    label: `${l.borrower} · #${l.number}`,
    hint: `${l.program} ${l.purpose.toLowerCase()} · ${l.stage}`,
    keywords: `${l.coBorrower ?? ''} ${l.propertyAddress} ${l.processor}`,
    icon: <FolderOpenIcon />,
    onSelect: () => go(`#/loan/${l.id}`),
  })),
  ...documents
    .filter((d) => !d.superseded)
    .map((d) => ({
      id: `doc-${d.id}`,
      group: 'Documents',
      label: d.title,
      hint: `${getLoan(d.loanId)?.borrower} · #${getLoan(d.loanId)?.number}`,
      keywords: `${d.type} ${d.fileName}`,
      icon: <FileTextIcon />,
      onSelect: () => go(`#/loan/${d.loanId}?doc=${d.id}`),
    })),
  ...conditions.map((c) => ({
    id: `cond-${c.id}`,
    group: 'Conditions',
    label: c.title,
    hint: `${c.category} · #${getLoan(c.loanId)?.number}`,
    keywords: `${c.source} ${c.status}`,
    icon: <ListChecksIcon />,
    onSelect: () => go(`#/loan/${c.loanId}?condition=${c.id}`),
  })),
]

function useHashRoute(): Route {
  const [route, setRoute] = React.useState(() => parse(window.location.hash))
  React.useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

const nav = [
  { view: 'kit', label: 'Style guide', href: '#/kit' },
  { view: 'pipeline', label: 'Pipeline', href: '#/pipeline' },
  { view: 'loan', label: 'Loan detail', href: `#/loan/${DEMO_LOAN_ID}` },
] as const

export default function App() {
  const route = useHashRoute()
  const [commandOpen, setCommandOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCommandOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  React.useEffect(() => {
    if (route.view !== 'kit') window.scrollTo({ top: 0 })
  }, [route.view])

  return (
    <TooltipProvider delayDuration={300}>
      <ToastProvider>
        <header className="sticky top-0 z-40 flex h-[49px] items-center gap-6 border-b border-border bg-white/90 px-5 backdrop-blur">
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <span aria-hidden className="grid size-6 place-items-center rounded-md bg-primary text-xs text-white">
              L
            </span>
            LoanCrate prototype
          </span>
          <nav aria-label="Views">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.view}>
                  <a
                    href={item.href}
                    aria-current={route.view === item.view ? 'page' : undefined}
                    className={cn(
                      'block rounded-lg px-2.5 py-1.5 text-[13px] font-medium',
                      route.view === item.view ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="ml-auto flex h-8 w-64 cursor-pointer items-center gap-2 rounded-lg border border-border bg-white px-2.5 text-[13px] text-gray-400 hover:border-gray-300"
          >
            <SearchIcon aria-hidden className="size-4" />
            Search…
            <span className="ml-auto flex gap-0.5" aria-hidden>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </span>
            <span className="sr-only">(Command K)</span>
          </button>
        </header>
        <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} items={commandItems} />

        {route.view === 'kit' && <StyleGuide section={route.section} />}
        {route.view === 'pipeline' && <PipelinePage />}
        {route.view === 'loan' && (
          <LoanDetail key={route.loanId} loanId={route.loanId} docParam={route.doc} conditionParam={route.condition} />
        )}
      </ToastProvider>
    </TooltipProvider>
  )
}
