import * as React from 'react'

import { ToastProvider } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'
import { DEMO_LOAN_ID } from '@/data/loans'
import { StyleGuide } from '@/features/kit/StyleGuide'
import { LoanDetail } from '@/features/loan/LoanDetail'
import { PipelinePage } from '@/features/pipeline/PipelinePage'
import { cn } from '@/lib/utils'

/*
 * Hash routes, no router package:
 *   #/kit[/section]   style guide
 *   #/pipeline        loan pipeline
 *   #/loan/{id}       loan detail
 */
type Route = { view: 'kit'; section?: string } | { view: 'pipeline' } | { view: 'loan'; loanId: string }

function parse(hash: string): Route {
  const [, view, arg] = hash.replace(/^#/, '').split('/')
  if (view === 'pipeline') return { view: 'pipeline' }
  if (view === 'loan') return { view: 'loan', loanId: arg || DEMO_LOAN_ID }
  return { view: 'kit', section: arg }
}

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
        </header>

        {route.view === 'kit' && <StyleGuide section={route.section} />}
        {route.view === 'pipeline' && <PipelinePage />}
        {route.view === 'loan' && <LoanDetail key={route.loanId} loanId={route.loanId} />}
      </ToastProvider>
    </TooltipProvider>
  )
}
