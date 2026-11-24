import { loans } from '@/data/loans'
import { PipelineTable } from './PipelineTable'

export function PipelinePage() {
  const outstanding = loans.reduce((sum, l) => sum + l.openConditions, 0)
  const flags = loans.reduce((sum, l) => sum + l.aiFlags, 0)
  return (
    <main className="mx-auto flex max-w-7xl flex-col gap-5 px-8 py-8">
      <header>
        <h1 className="text-2xl">Pipeline</h1>
        <p className="mt-1 text-gray-500">
          {loans.length} loans · {outstanding} outstanding conditions · {flags} AI review flags. Open a loan to see its file.
        </p>
      </header>
      <PipelineTable onOpenLoan={(id) => (window.location.hash = `#/loan/${id}`)} />
    </main>
  )
}
