import { FileTextIcon, FolderOpenIcon, PlayIcon, RotateCcwIcon, SearchIcon } from 'lucide-react'
import * as React from 'react'

import { AiSummary } from '@/components/ai/AiSummary'
import { AiTrace } from '@/components/ai/AiTrace'
import { DiffTable } from '@/components/ai/DiffTable'
import { ReviewQueue, reviewOrder } from '@/components/ai/ReviewQueue'
import { TaskRows, useSimulatedTasks } from '@/components/ai/TaskRows'
import { ToolChips } from '@/components/ai/ToolChips'
import { DocumentPage } from '@/components/evidence/DocumentPage'
import { useFieldReviews } from '@/components/evidence/reviews'
import { SelectionActions } from '@/components/evidence/SelectionActions'
import { Button } from '@/components/ui/button'
import { CommandPalette } from '@/components/ui/command'
import { Kbd } from '@/components/ui/kbd'
import { SegmentedControl } from '@/components/ui/segmented'
import { useToast } from '@/components/ui/toast'
import { automations } from '@/data/automations'
import type { Evidence } from '@/data/conditions'
import { currentDocumentsForLoan, getDocument } from '@/data/documents'
import { loans } from '@/data/loans'
import { proposals } from '@/data/proposals'
import { summaries } from '@/data/summaries'
import { traceForId } from '@/data/traces'
import { uploadQueue } from '@/data/uploads'
import { MOTION } from '@/lib/motion'
import { Section, Specimen, StateCell } from './layout'

/** Patterns inspired by beautifului.dev, plus the motion system. */
export function PatternSections() {
  const { toast } = useToast()
  const evidence = (ev: Evidence) =>
    toast({ tone: 'info', title: 'Show evidence', body: `Opens ${getDocument(ev.docId)?.title} at the source region.` })
  return (
    <>
      <MotionSection />
      <Section id="trace" title="AI trace" description="What the AI did with a document, step by step. Collapsed to one line by default; live mode reveals steps as they run.">
        <TraceDemo onShowEvidence={evidence} />
      </Section>
      <Section id="summary" title="Streamed summary" description="Streams word by word with a caret. Citations open the evidence; source cards appear when it finishes. Skip or regenerate anytime.">
        <AiSummary summary={summaries['loan-0']} onShowEvidence={evidence} className="max-w-2xl" />
      </Section>
      <Section id="review-queue" title="Review queue" description="One suggestion at a time, lowest confidence first. Click into the card, then A, E, R, J, K. Decisions are shared with the viewer through useFieldReviews.">
        <QueueDemo />
      </Section>
      <Section id="diff" title="Diff table" description="AI-proposed 1003 updates sweep through the table. Accept or reject per row, or all at once. Replay with the reset button.">
        <DiffTable rows={proposals['loan-0']} onShowEvidence={evidence} className="max-w-2xl" />
      </Section>
      <Section id="tasks" title="Task rows" description="Uploads moving through classification and extraction. Status is icon plus words; failed rows can retry.">
        <TasksDemo />
      </Section>
      <Section id="tool-chips" title="Tool chips" description="What the AI did automatically. Chips with details open a popover; overflow collapses to +N.">
        <div className="flex flex-col gap-4">
          <StateCell label="All chips">
            <ToolChips items={automations['loan-0']} max={10} />
          </StateCell>
          <StateCell label="Max 2 with overflow">
            <ToolChips items={automations['loan-0']} max={2} />
          </StateCell>
        </div>
      </Section>
      <Section id="selection" title="Selection actions" description="Select text on the page to create a condition, ask AI, or flag it. Esc dismisses.">
        <SelectionDemo />
      </Section>
      <Section id="command" title="Command search" description={<>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> anywhere, or use the demo below. Arrow keys and Enter; filtering is instant.</>}>
        <CommandDemo />
      </Section>
    </>
  )
}

function MotionSection() {
  const [zoom, setZoom] = React.useState<'fit' | '100' | '150'>('fit')
  const rows: [string, string][] = [
    ['Easing', `${MOTION.ease} (ease-out only)`],
    ['Chrome', `${MOTION.fast}–${MOTION.enter}ms; exits ${MOTION.exit}ms`],
    ['Stagger', `${MOTION.stagger}ms per item`],
    ['Stream', `${MOTION.streamWordMs}ms per word`],
    ['Sweep', `${MOTION.sweepCellMs * 3}ms per row`],
    ['Reduced motion', 'Final frame only: no glide, stream, sweep, stagger, or shimmer'],
  ]
  return (
    <Section id="motion" title="Motion" description="Beats live in lib/motion.ts and index.css. Opacity and transform only. Keyboard paths never wait on animation.">
      <Specimen label="Beats">
        <dl className="grid max-w-xl grid-cols-[120px_1fr] gap-x-4 gap-y-1.5 text-[13px]">
          {rows.map(([k, v]) => (
            <React.Fragment key={k}>
              <dt className="text-gray-500">{k}</dt>
              <dd className="text-gray-900">{v}</dd>
            </React.Fragment>
          ))}
        </dl>
      </Specimen>
      <Specimen label="Glide">
        <SegmentedControl
          label="Demo zoom"
          value={zoom}
          onChange={setZoom}
          options={[
            { value: 'fit', label: 'Fit' },
            { value: '100', label: '100%' },
            { value: '150', label: '150%' },
          ]}
        />
        <p className="mt-2 text-xs text-gray-500">Tabs, this control, and the document list hover all use useGlide().</p>
      </Specimen>
    </Section>
  )
}

function TraceDemo({ onShowEvidence }: { onShowEvidence: (ev: Evidence) => void }) {
  const [runKey, setRunKey] = React.useState(0)
  return (
    <div className="grid grid-cols-2 items-start gap-4">
      <StateCell label="Live (replayable)">
        <AiTrace key={runKey} steps={traceForId('doc-avery-bank-oct')} live runKey={runKey} onShowEvidence={onShowEvidence} title="Bank statement · Oct" />
        <Button size="xs" variant="outline" className="self-start" onClick={() => setRunKey((k) => k + 1)}>
          <PlayIcon />
          Replay
        </Button>
      </StateCell>
      <div className="flex flex-col gap-4">
        <StateCell label="Collapsed (default)">
          <AiTrace steps={traceForId('doc-avery-w2')} title="W-2 · 2025" onShowEvidence={onShowEvidence} />
        </StateCell>
        <StateCell label="With a failure">
          <AiTrace steps={traceForId('doc-jordan-tax')} title="Tax return · 2025" defaultOpen />
        </StateCell>
      </div>
    </div>
  )
}

function QueueDemo() {
  const reviews = useFieldReviews()
  const [runKey, setRunKey] = React.useState(0)
  const fields = currentDocumentsForLoan('loan-0').flatMap((d) => d.fields)
  return (
    <div className="flex max-w-md flex-col gap-2">
      <ReviewQueue
        key={runKey}
        fields={reviewOrder(fields, (f) => reviews.get(f).state === 'pending').slice(0, 6)}
        getReview={reviews.get}
        handlersFor={reviews.handlersFor}
      />
      <Button size="xs" variant="ghost" className="self-start" onClick={() => setRunKey((k) => k + 1)}>
        <RotateCcwIcon />
        Restart with remaining
      </Button>
    </div>
  )
}

function TasksDemo() {
  const { tasks, retry, reset } = useSimulatedTasks(uploadQueue['loan-0'])
  return (
    <div className="flex max-w-lg flex-col gap-2">
      <div className="rounded-xl border border-border bg-white px-3.5">
        <TaskRows tasks={tasks} onRetry={retry} />
      </div>
      <Button size="xs" variant="ghost" className="self-start" onClick={reset}>
        <RotateCcwIcon />
        Reset
      </Button>
    </div>
  )
}

function SelectionDemo() {
  const { toast } = useToast()
  const doc = getDocument('doc-avery-credit')!
  return (
    <div className="max-w-xl rounded-xl bg-viewer p-5">
      <SelectionActions
        onAction={(action, quote) =>
          toast({
            tone: action === 'flag' ? 'success' : 'info',
            title: action === 'create-condition' ? 'Create condition' : action === 'ask-ai' ? 'Ask AI' : 'Flagged for underwriter',
            body: `“${quote.slice(0, 80)}”`,
          })
        }
      >
        <DocumentPage page={doc.pages[0]} />
      </SelectionActions>
    </div>
  )
}

function CommandDemo() {
  const [open, setOpen] = React.useState(false)
  const { toast } = useToast()
  const items = [
    ...loans.slice(0, 6).map((l) => ({
      id: l.id,
      group: 'Loans',
      label: `${l.borrower} · #${l.number}`,
      hint: l.stage,
      icon: <FolderOpenIcon />,
      onSelect: () => toast({ tone: 'info', title: `Open loan #${l.number}` }),
    })),
    ...currentDocumentsForLoan('loan-0').map((d) => ({
      id: d.id,
      group: 'Documents',
      label: d.title,
      hint: d.fileName,
      icon: <FileTextIcon />,
      onSelect: () => toast({ tone: 'info', title: `Open ${d.title}` }),
    })),
  ]
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <SearchIcon />
        Open command search
      </Button>
      <CommandPalette open={open} onClose={() => setOpen(false)} items={items} placeholder="Try “brennan” or “statement”" />
    </>
  )
}
