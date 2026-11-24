import * as React from 'react'

import { DocumentViewer, type DocumentViewerHandle } from '@/components/evidence/DocumentViewer'
import { useFieldReviews } from '@/components/evidence/reviews'
import { EmptyState } from '@/components/ui/empty-state'
import { useToast } from '@/components/ui/toast'
import { compareApplication } from '@/data/application'
import { conditionStatusLabel, conditionsForLoan, type Condition, type Evidence } from '@/data/conditions'
import { currentDocumentsForLoan, getDocument, type Document } from '@/data/documents'
import { getLoan } from '@/data/loans'
import { DocumentList, DocumentPicker } from './DocumentList'
import { LoanDetailShell } from './LoanDetailShell'
import { LoanHeader } from './LoanHeader'
import { LoanPanel } from './LoanPanel'

/*
 * Example composition of the toolkit for one loan. Not a flow: it wires the
 * shell, list, viewer, and panel with local state so everything is live.
 * Copy this file as the starting point for an exercise screen.
 */
export function LoanDetail({ loanId }: { loanId: string }) {
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

  React.useEffect(() => {
    setDocId(firstToReview?.id)
    setConditions(conditionsForLoan(loanId))
    setActiveFieldId(null)
  }, [loanId, firstToReview?.id])

  if (!loan) {
    return <EmptyState title="Loan not found" body={<a className="text-link hover:underline" href="#/pipeline">Back to pipeline</a>} className="py-24" />
  }

  const doc: Document | undefined = docId ? getDocument(docId) : undefined

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
    setConditions((list) => list.map((c) => (c.id === next.id ? next : c)))
    const last = next.history[next.history.length - 1]
    toast({
      tone: 'success',
      title: `${last?.action ?? 'Updated'}: ${next.title}`,
      body: `Status is now ${conditionStatusLabel[next.status].toLowerCase()}.`,
      action: previous ? { label: 'Undo', onClick: () => setConditions((list) => list.map((c) => (c.id === next.id ? previous : c))) } : undefined,
    })
  }

  const pendingCount = (d: Document) => d.fields.filter((f) => reviews.get(f).state === 'pending').length

  return (
    <LoanDetailShell
      header={<LoanHeader loan={loan} />}
      documents={<DocumentList documents={docs} selectedId={docId ?? ''} onSelect={selectDoc} pendingCount={pendingCount} />}
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
        />
      }
    />
  )
}
