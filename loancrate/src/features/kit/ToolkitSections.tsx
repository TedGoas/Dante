import { FileTextIcon, InboxIcon, PanelRightOpenIcon, RefreshCwIcon, SearchXIcon, SparklesIcon } from 'lucide-react'
import * as React from 'react'

import { ActivityLog } from '@/components/ai/ActivityLog'
import { AiConditionCard } from '@/components/ai/AiConditionCard'
import { AiSuggestion, type AiSuggestionState } from '@/components/ai/AiSuggestion'
import { ConfidenceIndicator } from '@/components/ai/ConfidenceIndicator'
import { CONFIDENCE } from '@/components/ai/confidence'
import { DocumentViewer } from '@/components/evidence/DocumentViewer'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Dialog, Sheet } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Kbd } from '@/components/ui/kbd'
import { AiWorking, Progress, Spinner } from '@/components/ui/progress'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tab, TabList, TabPanel, Tabs } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { activityForLoan, conditions as allConditions, conditionsForLoan, type Condition } from '@/data/conditions'
import { getDocument } from '@/data/documents'
import { Deadline } from '@/features/loan/LoanHeader'
import { daysFromNow } from '@/lib/seed'
import { Section, Specimen, StateCell } from './layout'

/** Style-guide sections for the exercise toolkit: every component, every state. */
export function ToolkitSections() {
  return (
    <>
      <Overlays />
      <TabsDemo />
      <ToastDemo />
      <Feedback />
      <Confidence />
      <Suggestions />
      <ConditionCards />
      <Activity />
      <Viewer />
    </>
  )
}

function Overlays() {
  const [dialog, setDialog] = React.useState(false)
  const [sheet, setSheet] = React.useState(false)
  return (
    <Section id="overlays" title="Dialog & sheet" description="Native <dialog>: focus trap, Esc, and inert background for free. Focus returns to the opener.">
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setDialog(true)}>
          Open dialog
        </Button>
        <Button variant="secondary" onClick={() => setSheet(true)}>
          <PanelRightOpenIcon />
          Open sheet
        </Button>
      </div>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        title="Request documents"
        description="The borrower gets a portal task with these items."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialog(false)}>Send request</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Field label="Document" htmlFor="dlg-doc">
            <Select id="dlg-doc" defaultValue="Paystub">
              <option>Paystub</option>
              <option>Bank statement</option>
              <option>LOX</option>
            </Select>
          </Field>
          <Field label="Message to borrower" htmlFor="dlg-msg" optional>
            <Textarea id="dlg-msg" defaultValue="Please upload your most recent paystub, dated within the last 30 days." />
          </Field>
        </div>
      </Dialog>
      <Sheet open={sheet} onClose={() => setSheet(false)} title="Activity · Loan #4821" description="Everything that happened on this file.">
        <ActivityLog entries={activityForLoan(conditionsForLoan('loan-0'))} />
      </Sheet>
    </Section>
  )
}

function TabsDemo() {
  return (
    <Section id="tabs" title="Tabs" description="Roving tabindex: Tab into the list, then arrows, Home, and End. Optional counts.">
      <div className="max-w-md rounded-xl border border-border bg-white">
        <Tabs defaultValue="conditions">
          <TabList label="Demo tabs" className="px-3">
            <Tab value="conditions" count={5}>
              Conditions
            </Tab>
            <Tab value="data" count={2}>
              Data
            </Tab>
            <Tab value="activity">Activity</Tab>
            <Tab value="closing" disabled>
              Closing
            </Tab>
          </TabList>
          <TabPanel value="conditions" className="p-4 text-[13px]">
            5 outstanding conditions.
          </TabPanel>
          <TabPanel value="data" className="p-4 text-[13px]">
            2 mismatches between the 1003 and documents.
          </TabPanel>
          <TabPanel value="activity" className="p-4 text-[13px]">
            Audit trail.
          </TabPanel>
        </Tabs>
      </div>
    </Section>
  )
}

function ToastDemo() {
  const { toast } = useToast()
  return (
    <Section id="toast" title="Toast" description="Announced via aria-live (errors assertively). Pauses on hover or focus. Optional Undo.">
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => toast({ tone: 'success', title: 'Condition cleared', body: 'Fully executed purchase contract.' })}>
          Success
        </Button>
        <Button variant="secondary" onClick={() => toast({ tone: 'info', title: 'AI is reviewing 3 new uploads', body: 'You’ll see results in about a minute.' })}>
          Info
        </Button>
        <Button variant="secondary" onClick={() => toast({ tone: 'error', title: 'Couldn’t send request', body: 'Borrower portal is unavailable. Try again.' })}>
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={() =>
            toast({
              tone: 'success',
              title: 'Waived: LOX for $60,000 deposit',
              action: { label: 'Undo', onClick: () => toast({ tone: 'info', title: 'Waive undone' }) },
            })
          }
        >
          With undo
        </Button>
      </div>
    </Section>
  )
}

function Feedback() {
  return (
    <Section id="feedback" title="Loading & empty" description="Skeleton, spinner, progress, AI working, empty states, and keyboard hints.">
      <Specimen label="Skeleton">
        <div className="flex max-w-sm flex-col gap-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      </Specimen>
      <Specimen label="Progress">
        <div className="flex max-w-sm flex-col gap-3">
          <div className="flex items-center gap-3">
            <Spinner label="Loading pipeline" />
            <span className="text-[13px]">Spinner</span>
          </div>
          <Progress value={64} label="Upload progress" />
          <Progress label="Extraction progress" tone="ai" />
          <AiWorking>Reading page 2 of 3…</AiWorking>
        </div>
      </Specimen>
      <Specimen label="Empty state">
        <div className="grid max-w-2xl grid-cols-2 gap-3">
          <div className="rounded-xl border border-border">
            <EmptyState icon={<SearchXIcon />} title="No loans match" body="Try removing a filter." action={<Button size="sm" variant="secondary">Clear filters</Button>} />
          </div>
          <div className="rounded-xl border border-border">
            <EmptyState
              tone="danger"
              icon={<FileTextIcon />}
              title="Couldn’t read this document"
              body="Pages out of order."
              action={
                <Button size="sm" variant="secondary">
                  <RefreshCwIcon />
                  Retry
                </Button>
              }
            />
          </div>
        </div>
      </Specimen>
      <Specimen label="Kbd">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
          <span className="inline-flex items-center gap-1.5">
            <Kbd>A</Kbd> Accept
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>E</Kbd> Modify
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>J</Kbd>
            <Kbd>K</Kbd> Next / previous field
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd> Search loans
          </span>
        </p>
      </Specimen>
      <Specimen label="Deadline">
        <p className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-medium">
          <Deadline date={daysFromNow(1)} noun="Expires" />
          <Deadline date={daysFromNow(3)} noun="Closes" />
          <Deadline date={daysFromNow(12)} noun="Closes" />
        </p>
      </Specimen>
    </Section>
  )
}

function Confidence() {
  return (
    <Section
      id="confidence"
      title="Confidence"
      description={
        <>
          Icon + text, never color alone. Thresholds live in <code className="text-[13px]">components/ai/confidence.ts</code>: high ≥ {CONFIDENCE.high}, medium ≥{' '}
          {CONFIDENCE.medium}.
        </>
      }
    >
      <Specimen label="Full">
        <div className="flex flex-wrap gap-5">
          <ConfidenceIndicator value={0.97} />
          <ConfidenceIndicator value={0.78} />
          <ConfidenceIndicator value={0.42} />
        </div>
      </Specimen>
      <Specimen label="Compact">
        <div className="flex flex-wrap gap-5">
          <ConfidenceIndicator value={0.97} variant="compact" />
          <ConfidenceIndicator value={0.78} variant="compact" />
          <ConfidenceIndicator value={0.42} variant="compact" />
        </div>
      </Specimen>
    </Section>
  )
}

const states: AiSuggestionState[] = ['pending', 'accepted', 'modified', 'rejected', 'loading']

/** A live AiSuggestion starting in `initial` state. */
function DemoSuggestion({
  initial,
  density,
  label,
  aiValue,
  editedValue,
  confidence,
}: {
  initial: AiSuggestionState
  density: 'cell' | 'field' | 'card'
  label: string
  aiValue: string
  editedValue: string
  confidence: number
}) {
  const { toast } = useToast()
  const [state, setState] = React.useState(initial)
  const [value, setValue] = React.useState(initial === 'modified' ? editedValue : aiValue)
  const [reason, setReason] = React.useState(initial === 'rejected' ? 'Wrong account. This is savings ••4425.' : undefined)
  return (
    <AiSuggestion
      label={label}
      density={density}
      state={state}
      value={value}
      originalValue={state === 'modified' ? aiValue : undefined}
      confidence={confidence}
      rejectReason={reason}
      onAccept={() => setState('accepted')}
      onModify={(v) => {
        setValue(v)
        setState('modified')
      }}
      onReject={(r) => {
        setReason(r)
        setState('rejected')
      }}
      onReset={() => {
        setValue(aiValue)
        setReason(undefined)
        setState('pending')
      }}
      onShowEvidence={() => toast({ tone: 'info', title: `Evidence for ${label}`, body: 'Opens the document at the source region.' })}
    />
  )
}

function Suggestions() {
  const demo = { label: 'Monthly income', aiValue: '$9,240.01', editedValue: '$9,240.00', confidence: 0.93 }
  return (
    <Section
      id="ai-suggestion"
      title="AI suggestion"
      description="Humans decide, AI prepares. Accept, Modify (Enter saves, Esc cancels), or Reject with an optional reason. “Why?” opens the evidence. Every state is live."
    >
      <Specimen label="In a table cell">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-[13px]">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="px-3 py-2 font-medium">State</th>
                <th className="px-3 py-2 font-medium">Monthly income</th>
              </tr>
            </thead>
            <tbody>
              {states.map((s) => (
                <tr key={s} className="border-t border-gray-100">
                  <td className="w-28 px-3 py-2 text-gray-500 capitalize">{s}</td>
                  <td className="px-3 py-1.5">
                    <DemoSuggestion initial={s} density="cell" {...demo} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Specimen>
      <Specimen label="In a form field">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
          {states.map((s) => (
            <StateCell key={s} label={s[0].toUpperCase() + s.slice(1)}>
              <DemoSuggestion initial={s} density="field" {...demo} />
            </StateCell>
          ))}
          <StateCell label="Next to a normal field">
            <Field label="Employer" htmlFor="sg-employer">
              <Input id="sg-employer" defaultValue="Northgate Logistics" />
            </Field>
          </StateCell>
        </div>
      </Specimen>
      <Specimen label="In a card">
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
          {states.map((s) => (
            <DemoSuggestion key={s} initial={s} density="card" {...demo} />
          ))}
        </div>
      </Specimen>
    </Section>
  )
}

function ConditionCards() {
  const { toast } = useToast()
  const pick = (id: string) => allConditions.find((c) => c.id === id)!
  const [list, setList] = React.useState<Condition[]>(() => [
    pick('cond-avery-deposit'),
    pick('cond-avery-inquiry'),
    pick('cond-elijah-deposit'),
    pick('cond-avery-voe'),
  ])
  const labels = ['AI · requested', 'AI · rejected, then re-requested', 'AI · waived with justification', 'AUS · no “why” block']
  return (
    <Section
      id="conditions"
      title="Condition card"
      description="AI conditions show the trigger, the rule, and the evidence. Waive and dismiss require a reason. Each action appends to the history."
    >
      <div className="grid grid-cols-2 items-start gap-4">
        {list.map((c, i) => (
          <StateCell key={c.id} label={labels[i]}>
            <AiConditionCard
              condition={c}
              onChange={(next) => setList((all) => all.map((x) => (x.id === next.id ? next : x)))}
              onShowEvidence={(ev) => toast({ tone: 'info', title: 'Show evidence', body: `${getDocument(ev.docId)?.title}` })}
            />
          </StateCell>
        ))}
      </div>
    </Section>
  )
}

function Activity() {
  const [filter, setFilter] = React.useState<'all' | 'ai' | 'human'>('all')
  const entries = activityForLoan(conditionsForLoan('loan-0'))
    .filter((e) => filter === 'all' || e.actor.kind === filter)
    .slice(0, 7)
  return (
    <Section id="activity" title="Activity log" description="Audit trail. AI and people are distinguished by avatar shape, an “AI” label, and the name.">
      <div className="flex max-w-xl flex-col gap-3">
        <div role="group" aria-label="Show activity from" className="flex gap-1.5">
          {(['all', 'ai', 'human'] as const).map((f) => (
            <Chip key={f} pressed={filter === f} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'ai' ? 'AI' : 'People'}
            </Chip>
          ))}
        </div>
        <ActivityLog entries={entries} />
      </div>
    </Section>
  )
}

const viewerDemos = [
  { id: 'doc-avery-bank-oct', label: 'Ready (large deposit)' },
  { id: 'doc-avery-bank-sep', label: 'Low-quality scan' },
  { id: 'doc-avery-w2', label: 'Name mismatch' },
  { id: 'doc-avery-lox', label: 'Handwritten LOX' },
  { id: 'doc-avery-appraisal', label: 'Processing' },
  { id: 'doc-jordan-tax', label: 'Failed' },
]

function Viewer() {
  const { toast } = useToast()
  const [docId, setDocId] = React.useState(viewerDemos[0].id)
  const doc = getDocument(docId)!
  return (
    <Section
      id="viewer"
      title="Document viewer"
      description="Fake pages rendered in HTML. Click a field or a highlight to focus it. Zoom, pages, and versions in the toolbar (Oct statement has v1 and v2)."
    >
      <div className="flex flex-col gap-3">
        <div role="group" aria-label="Demo document" className="flex flex-wrap gap-1.5">
          {viewerDemos.map((d) => (
            <Chip key={d.id} pressed={docId === d.id || getDocument(docId)?.versionGroup === getDocument(d.id)?.versionGroup} onClick={() => setDocId(d.id)}>
              {d.label}
            </Chip>
          ))}
        </div>
        <DocumentViewer
          document={doc}
          className="h-[680px]"
          onVersionChange={setDocId}
          onRetry={() => toast({ tone: 'info', title: 'Retrying extraction' })}
        />
        <p className="flex items-center gap-1.5 text-xs text-gray-500">
          <SparklesIcon aria-hidden className="size-3.5 text-ai" />
          Dashed amber highlights are low confidence.
          <InboxIcon aria-hidden className="ml-3 size-3.5" />
          Review decisions are local to this demo.
        </p>
      </div>
    </Section>
  )
}
