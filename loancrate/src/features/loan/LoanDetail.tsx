import { ChevronDownIcon, ListChecksIcon } from 'lucide-react'
import * as React from 'react'

import { AiSummary } from '@/components/ai/AiSummary'
import { AiTrace } from '@/components/ai/AiTrace'
import { DiffTable } from '@/components/ai/DiffTable'
import { ReviewQueue, reviewOrder } from '@/components/ai/ReviewQueue'
import { TaskRows, useSimulatedTasks } from '@/components/ai/TaskRows'
import { ToolChips } from '@/components/ai/ToolChips'
import { DocumentViewer, type DocumentViewerHandle } from '@/components/evidence/DocumentViewer'
import { useFieldReviews } from '@/components/evidence/reviews'
import type { SelectionAction } from '@/components/evidence/SelectionActions'
import { Button } from '@/components/ui/button'
import { Dialog, Sheet } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/toast'
import { compareApplication } from '@/data/application'
import { automations } from '@/data/automations'
import {
  CURRENT_USER,
  conditionCategories,
  conditionStatusLabel,
  conditionsForLoan,
  type Condition,
  type ConditionCategory,
  type Evidence,
} from '@/data/conditions'
import { currentDocumentsForLoan, getDocument, type Document } from '@/data/documents'
import { getLoan } from '@/data/loans'
import { proposals } from '@/data/proposals'
import { summaries } from '@/data/summaries'
import { traceFor } from '@/data/traces'
import { uploadQueue } from '@/data/uploads'
import { FIXED_NOW, daysFromNow } from '@/lib/seed'
import { DocumentList, DocumentPicker } from './DocumentList'
import { LoanDetailShell } from './LoanDetailShell'
import { LoanHeader } from './LoanHeader'
import { LoanPanel } from './LoanPanel'

/*
 * Example composition of the toolkit for one loan. Not a flow: it wires the
 * shell, list, viewer, panel, and AI patterns with local state so everything
 * is live. Copy this file as the starting point for an exercise screen.
 */
export function LoanDetail({ loanId, docParam, conditionParam }: { loanId: string; docParam?: string; conditionParam?: string }) {
  const loan = getLoan(loanId)
  const { toast } = useToast()
  const reviews = useFieldReviews()
  const viewerRef = React.useRef<DocumentViewerHandle>(null)

  const docs = React.useMemo(() => currentDocumentsForLoan(loanId), [loanId])
  const firstToReview = docs.find((d) => d.status === 'needs-review') ?? docs[0]
  const [docId, setDocId] = React.useState<string | undefined>(firstToReview?.id)
  const [activeFieldId, setActiveFieldId] = React.useState<string | null>(null)
  const [conditions, setConditions] = React.useState<Condition[]>(() => conditionsForLoan(loanId))
  const [tab, setTab] = React.useState('conditions')
  const [queueOpen, setQueueOpen] = React.useState(false)
  const [newCondition, setNewCondition] = React.useState<string | null>(null)
  const uploads = useSimulatedTasks(uploadQueue[loanId] ?? [])

  // Deep links from ⌘K: #/loan/{id}?doc=… or ?condition=…
  React.useEffect(() => {
    if (docParam && getDocument(docParam)) selectDoc(docParam)
    if (conditionParam) {
      const c = conditionsForLoan(loanId).find((x) => x.id === conditionParam)
      setTab('conditions')
      if (c?.why?.evidence.fieldId) showEvidence(c.why.evidence)
      else if (c?.docIds[0]) selectDoc(c.docIds[0])
    }
  }, [docParam, conditionParam])

  if (!loan) {
    return <EmptyState title="Loan not found" body={<a className="text-link hover:underline" href="#/pipeline">Back to pipeline</a>} className="py-24" />
  }

  const doc: Document | undefined = docId ? getDocument(docId) : undefined
  const allFields = docs.flatMap((d) => d.fields)
  const pendingFields = allFields.filter((f) => reviews.get(f).state === 'pending')

  function selectDoc(id: string) {
    setDocId(id)
    setActiveFieldId(null)
  }

  function showEvidence(evidence: Evidence) {
    setDocId(evidence.docId)
    if (!evidence.fieldId) return
    setActiveFieldId(evidence.fieldId)
    // Re-pulse even if the same field is already active.
    requestAnimationFrame(() => viewerRef.current?.focusField(evidence.fieldId))
  }

  function changeCondition(next: Condition) {
    const previous = conditions.find((c) => c.id === next.id)
    setConditions((list) => (previous ? list.map((c) => (c.id === next.id ? next : c)) : [next, ...list]))
    const last = next.history[next.history.length - 1]
    toast({
      tone: 'success',
      title: `${last?.action ?? 'Updated'}: ${next.title}`,
      body: `Status is now ${conditionStatusLabel[next.status].toLowerCase()}.`,
      action: {
        label: 'Undo',
        onClick: () => setConditions((list) => (previous ? list.map((c) => (c.id === next.id ? previous : c)) : list.filter((c) => c.id !== next.id))),
      },
    })
  }

  function onSelectionAction(action: SelectionAction, quote: string) {
    if (action === 'create-condition') setNewCondition(quote)
    else if (action === 'ask-ai') toast({ tone: 'info', title: 'Asking AI about the selection', body: `“${quote.slice(0, 80)}”` })
    else toast({ tone: 'success', title: 'Flagged for underwriter', body: `“${quote.slice(0, 80)}” on ${doc?.title}` })
  }

  const pendingCount = (d: Document) => d.fields.filter((f) => reviews.get(f).state === 'pending').length
  const runningUploads = uploads.tasks.filter((t) => t.status !== 'done').length

  return (
    <>
      <LoanDetailShell
        header={
          <LoanHeader
            loan={loan}
            actions={
              pendingFields.length > 0 && (
                <Button size="sm" onClick={() => setQueueOpen(true)}>
                  <ListChecksIcon />
                  Review {pendingFields.length} fields
                </Button>
              )
            }
          />
        }
        documents={
          <DocumentList
            documents={docs}
            selectedId={docId ?? ''}
            onSelect={selectDoc}
            pendingCount={pendingCount}
            processing={
              uploads.tasks.length > 0 && (
                <details open className="group border-b border-border px-3 py-2">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[13px] font-medium text-gray-900 [&::-webkit-details-marker]:hidden">
                    Processing
                    <span className="text-xs font-normal text-gray-400 tabular-nums">{runningUploads ? `${runningUploads} left` : 'Done'}</span>
                    <ChevronDownIcon aria-hidden className="ml-auto size-4 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <TaskRows tasks={uploads.tasks} onRetry={uploads.retry} compact />
                </details>
              )
            }
          />
        }
        documentsCompact={<DocumentPicker documents={docs} selectedId={docId ?? ''} onSelect={selectDoc} />}
        viewer={
          doc ? (
            <DocumentViewer
              ref={viewerRef}
              document={doc}
              className="flex-1"
              activeFieldId={activeFieldId}
              onActiveFieldChange={setActiveFieldId}
              onVersionChange={selectDoc}
              onRetry={() => toast({ tone: 'info', title: 'Retrying extraction', body: 'We’ll notify you when it finishes.' })}
              getReview={reviews.get}
              reviewHandlers={reviews.handlersFor}
              onSelectionAction={onSelectionAction}
              asideFooter={<AiTrace key={doc.id} steps={traceFor(doc)} onShowEvidence={showEvidence} />}
            />
          ) : (
            <EmptyState title="No documents yet" body="Uploads for this loan will appear here." className="flex-1 rounded-xl border border-border bg-white" />
          )
        }
        panel={
          <LoanPanel
            conditions={conditions}
            comparisons={compareApplication(loanId)}
            onConditionChange={changeCondition}
            onShowEvidence={showEvidence}
            reviewedValue={(f) => reviews.get(f).value}
            tab={tab}
            onTabChange={setTab}
            conditionsHeader={summaries[loanId] && <AiSummary summary={summaries[loanId]} onShowEvidence={showEvidence} showSources={false} />}
            dataHeader={proposals[loanId] && <DiffTable rows={proposals[loanId]} onShowEvidence={showEvidence} />}
            activityHeader={automations[loanId] && <ToolChips items={automations[loanId]} max={2} />}
          />
        }
      />

      <Sheet open={queueOpen} onClose={() => setQueueOpen(false)} title="Review AI suggestions" description="Lowest confidence first. Decisions sync with the document viewer.">
        {queueOpen && (
          <ReviewQueue
            fields={reviewOrder(allFields, (f) => reviews.get(f).state === 'pending')}
            getReview={reviews.get}
            handlersFor={reviews.handlersFor}
            onShowInViewer={(f) => {
              setQueueOpen(false)
              showEvidence({ docId: f.docId, fieldId: f.id })
            }}
          />
        )}
      </Sheet>

      {newCondition !== null && (
        <NewConditionDialog
          quote={newCondition}
          docId={docId}
          loanId={loanId}
          onClose={() => setNewCondition(null)}
          onCreate={(c) => {
            setNewCondition(null)
            setTab('conditions')
            changeCondition(c)
          }}
        />
      )}
    </>
  )
}

/** Create a manual condition from selected document text. */
function NewConditionDialog({
  quote,
  docId,
  loanId,
  onClose,
  onCreate,
}: {
  quote: string
  docId?: string
  loanId: string
  onClose: () => void
  onCreate: (condition: Condition) => void
}) {
  const formId = React.useId()
  const [title, setTitle] = React.useState(`Explain: “${quote.slice(0, 60)}”`)
  const [category, setCategory] = React.useState<ConditionCategory>('PTD')
  const [note, setNote] = React.useState('')
  return (
    <Dialog
      open
      onClose={onClose}
      title="Create condition"
      description={<>From selected text: “{quote.slice(0, 120)}”</>}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form={formId}>
            Create condition
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          onCreate({
            id: `cond-new-${Date.now()}`,
            loanId,
            title: title.trim() || 'New condition',
            category,
            status: 'open',
            source: 'Processor',
            ownerRole: 'Processor',
            dueDate: daysFromNow(3),
            docIds: docId ? [docId] : [],
            history: [{ id: `h-new-${Date.now()}`, actor: CURRENT_USER, action: 'Created condition from selected text', at: FIXED_NOW, note: note.trim() || undefined }],
          })
        }}
      >
        <Field label="Title" htmlFor={`${formId}-title`}>
          <Input id={`${formId}-title`} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </Field>
        <Field label="Timing" htmlFor={`${formId}-cat`}>
          <Select id={`${formId}-cat`} value={category} onChange={(e) => setCategory(e.target.value as ConditionCategory)}>
            {conditionCategories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>
        <Field label="Note" htmlFor={`${formId}-note`} optional>
          <Textarea id={`${formId}-note`} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      </form>
    </Dialog>
  )
}
