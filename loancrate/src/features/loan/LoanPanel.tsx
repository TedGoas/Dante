import { CircleCheckIcon, CircleHelpIcon, FileSearchIcon, TriangleAlertIcon } from 'lucide-react'
import * as React from 'react'

import { ActivityLog } from '@/components/ai/ActivityLog'
import { AiConditionCard } from '@/components/ai/AiConditionCard'
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator'
import { Chip } from '@/components/ui/chip'
import { EmptyState } from '@/components/ui/empty-state'
import { IconButton } from '@/components/ui/icon-button'
import { Tab, TabList, TabPanel, Tabs } from '@/components/ui/tabs'
import type { Comparison } from '@/data/application'
import { OUTSTANDING, activityForLoan, type Condition, type ConditionStatus, type Evidence } from '@/data/conditions'
import type { ExtractedField } from '@/data/documents'
import { cn } from '@/lib/utils'

/* Exceptions first: what needs a human floats to the top. */
const statusOrder: ConditionStatus[] = ['rejected', 'under-review', 'received', 'open', 'requested', 'cleared', 'waived']

export function sortConditions(list: Condition[]) {
  return [...list].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status) || a.dueDate.getTime() - b.dueDate.getTime()
  )
}

/**
 * Right-hand panel: Conditions / Data (1003 vs. documents) / Activity.
 * Stateless; the screen owns conditions and review state.
 */
export function LoanPanel({
  conditions,
  comparisons,
  onConditionChange,
  onShowEvidence,
  reviewedValue,
  tab,
  onTabChange,
}: {
  conditions: Condition[]
  comparisons: Comparison[]
  onConditionChange: (next: Condition) => void
  onShowEvidence: (evidence: Evidence) => void
  /** Current (possibly human-edited) value of an extracted field. */
  reviewedValue?: (field: ExtractedField) => string
  tab?: string
  onTabChange?: (tab: string) => void
}) {
  const [showAll, setShowAll] = React.useState(false)
  const [actorFilter, setActorFilter] = React.useState<'all' | 'ai' | 'human'>('all')
  const outstanding = conditions.filter((c) => OUTSTANDING.includes(c.status))
  const shown = sortConditions(showAll ? conditions : outstanding)
  const mismatches = comparisons.filter((c) => c.result !== 'match').length
  const activity = activityForLoan(conditions).filter((e) => actorFilter === 'all' || e.actor.kind === actorFilter)

  return (
    <Tabs defaultValue="conditions" value={tab} onValueChange={onTabChange} className="h-full">
      <TabList label="Loan details" className="px-3">
        <Tab value="conditions" count={outstanding.length}>
          Conditions
        </Tab>
        <Tab value="data" count={mismatches}>
          Data
        </Tab>
        <Tab value="activity">Activity</Tab>
      </TabList>

      <TabPanel value="conditions" className="overflow-y-auto">
        <div className="flex items-center gap-1.5 px-3 pt-3">
          <Chip pressed={!showAll} onClick={() => setShowAll(false)} className="h-6 px-2.5 text-xs">
            Outstanding {outstanding.length}
          </Chip>
          <Chip pressed={showAll} onClick={() => setShowAll(true)} className="h-6 px-2.5 text-xs">
            All {conditions.length}
          </Chip>
        </div>
        <div className="flex flex-col gap-2.5 p-3">
          {shown.length === 0 ? (
            <EmptyState icon={<CircleCheckIcon />} title="No outstanding conditions" body="Everything required is cleared or waived." />
          ) : (
            shown.map((c) => (
              <AiConditionCard
                key={c.id}
                condition={c}
                onChange={onConditionChange}
                onShowEvidence={onShowEvidence}
                defaultExpanded={c.status !== 'cleared' && c.status !== 'waived'}
              />
            ))
          )}
        </div>
      </TabPanel>

      <TabPanel value="data" className="overflow-y-auto">
        <p className="px-3.5 pt-3 text-xs text-gray-500">What the borrower stated on the 1003, compared with values extracted from current documents.</p>
        <ul className="flex flex-col gap-2 p-3">
          {[...comparisons]
            .sort((a, b) => Number(a.result === 'match') - Number(b.result === 'match'))
            .map((c) => (
              <ComparisonRow key={c.key + c.label} comparison={c} onShowEvidence={onShowEvidence} reviewedValue={reviewedValue} />
            ))}
          {comparisons.length === 0 && <EmptyState title="No application data" body="This loan has no 1003 values to compare yet." />}
        </ul>
      </TabPanel>

      <TabPanel value="activity" className="overflow-y-auto">
        <div role="group" aria-label="Show activity from" className="flex items-center gap-1.5 px-3 pt-3">
          {(['all', 'ai', 'human'] as const).map((f) => (
            <Chip key={f} pressed={actorFilter === f} onClick={() => setActorFilter(f)} className="h-6 px-2.5 text-xs">
              {f === 'all' ? 'All' : f === 'ai' ? 'AI' : 'People'}
            </Chip>
          ))}
        </div>
        <ActivityLog entries={activity} className="p-3.5" />
      </TabPanel>
    </Tabs>
  )
}

function ComparisonRow({
  comparison: c,
  onShowEvidence,
  reviewedValue,
}: {
  comparison: Comparison
  onShowEvidence: (evidence: Evidence) => void
  reviewedValue?: (field: ExtractedField) => string
}) {
  const result = {
    match: { icon: CircleCheckIcon, text: 'Match', className: 'text-emerald-700' },
    mismatch: { icon: TriangleAlertIcon, text: 'Mismatch', className: 'text-amber-700' },
    missing: { icon: CircleHelpIcon, text: 'Not found in documents', className: 'text-gray-500' },
  }[c.result]
  const Icon = result.icon
  const extracted = c.extracted && (reviewedValue ? reviewedValue(c.extracted) : c.extracted.value)
  return (
    <li className={cn('rounded-xl border p-3 text-[13px]', c.result === 'mismatch' ? 'border-amber-200 bg-amber-50/40' : 'border-border bg-white')}>
      <div className="flex items-center gap-2">
        <span className="min-w-0 flex-1 truncate font-medium text-gray-900">{c.label}</span>
        <span className={cn('inline-flex items-center gap-1 text-xs font-medium', result.className)}>
          <Icon aria-hidden className="size-3.5" />
          {result.text}
        </span>
      </div>
      <dl className="mt-2 grid grid-cols-[64px_1fr] gap-x-2 gap-y-1">
        <dt className="text-gray-400">1003</dt>
        <dd className="text-gray-900 tabular-nums">{c.stated}</dd>
        <dt className="text-gray-400">Docs</dt>
        <dd className="flex min-w-0 items-center gap-1.5">
          {c.extracted ? (
            <>
              <span className="truncate text-gray-900 tabular-nums">{extracted}</span>
              <ConfidenceIndicator value={c.extracted.confidence} variant="compact" />
              <IconButton
                label={`Show ${c.label} in ${c.sourceTitle}`}
                className="ml-auto size-7"
                onClick={() => onShowEvidence({ docId: c.extracted!.docId, fieldId: c.extracted!.id })}
              >
                <FileSearchIcon />
              </IconButton>
            </>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </dd>
      </dl>
      {c.sourceTitle && <p className="mt-1 text-xs text-gray-400">From {c.sourceTitle} · {c.section}</p>}
    </li>
  )
}
