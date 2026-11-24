import type { Evidence } from '@/data/conditions'
import { getDocument, type Document } from '@/data/documents'

/*
 * What the AI did with each document, step by step (beautifului.dev's
 * "Thinking" pattern). Shown by components/ai/AiTrace.
 */

export type TraceStepKind = 'classify' | 'rename' | 'replace' | 'extract' | 'check' | 'create' | 'request'
export type TraceStepStatus = 'done' | 'warning' | 'failed'

export type TraceStep = {
  id: string
  kind: TraceStepKind
  label: string
  detail?: string
  status: TraceStepStatus
  ms: number
  evidence?: Evidence
}

const ev = (docId: string, n: number): Evidence => ({ docId, fieldId: `${docId}-f${n}` })

const seeded: Record<string, Omit<TraceStep, 'id'>[]> = {
  'doc-avery-bank-oct': [
    { kind: 'classify', label: 'Classified as Bank statement', detail: 'Ridgeline FCU · Checking ••4417 · 2 pages', status: 'done', ms: 380 },
    { kind: 'replace', label: 'Replaced v1 with this upload', detail: 'Statement_Oct_p1.pdf was missing pages. v1 is kept for the audit trail.', status: 'done', ms: 120 },
    { kind: 'extract', label: 'Extracted 4 fields', detail: 'Account holder, statement period, ending balance, large deposit', status: 'done', ms: 1240, evidence: ev('doc-avery-bank-oct', 2) },
    { kind: 'check', label: 'Matched account holder to the 1003', detail: '“Avery Brennan” matches Borrower name', status: 'done', ms: 90, evidence: ev('doc-avery-bank-oct', 0) },
    { kind: 'check', label: 'Checked deposits against B3-4.2-02', detail: 'Purchase. Qualifying income $9,240/mo, so the threshold is $4,620. 1 deposit is over: $48,500 on Oct 14, no source printed.', status: 'warning', ms: 410, evidence: ev('doc-avery-bank-oct', 3) },
    { kind: 'create', label: 'Created condition: LOX for $48,500 deposit', detail: 'PTD · Processor · due in 2 days', status: 'done', ms: 60 },
  ],
  'doc-avery-w2': [
    { kind: 'classify', label: 'Classified as W-2 (2025)', detail: 'Northgate Logistics · 1 page', status: 'done', ms: 290 },
    { kind: 'extract', label: 'Extracted 3 fields', detail: 'Employee name, employer, wages', status: 'done', ms: 860, evidence: ev('doc-avery-w2', 2) },
    { kind: 'check', label: 'Compared employee name to the 1003', detail: '“Avery M. Brenan” vs. “Avery Brennan”. Middle initial added and one letter different.', status: 'warning', ms: 70, evidence: ev('doc-avery-w2', 0) },
    { kind: 'create', label: 'Created condition: Name on W-2 doesn’t match', detail: 'PTC · Underwriter', status: 'done', ms: 50 },
  ],
  'doc-avery-lox': [
    { kind: 'classify', label: 'Classified as LOX (handwritten)', detail: 'Photo upload, 1 page', status: 'done', ms: 520 },
    { kind: 'rename', label: 'Renamed IMG_2304.HEIC', detail: 'Now “LOX · credit inquiry”', status: 'done', ms: 40 },
    { kind: 'extract', label: 'Read handwriting', detail: 'Handwriting confidence 68%. Verify before accepting.', status: 'warning', ms: 1890, evidence: ev('doc-avery-lox', 1) },
    { kind: 'check', label: 'Checked for signature and date', detail: 'Date found. Signature line is blank.', status: 'failed', ms: 140 },
    { kind: 'create', label: 'Attached to condition: LOX for credit inquiry', detail: 'Flagged for underwriter: unsigned', status: 'done', ms: 30 },
  ],
  'doc-jordan-tax': [
    { kind: 'classify', label: 'Classified as Tax return (Form 1040)', detail: '9 pages', status: 'done', ms: 610 },
    { kind: 'extract', label: 'Couldn’t extract fields', detail: 'Pages out of order. Pages 4 and 7 are upside down.', status: 'failed', ms: 2310 },
    { kind: 'request', label: 'Requested a re-upload from the borrower', detail: 'Auto-request is on for unreadable uploads', status: 'done', ms: 80 },
  ],
}

/** Trace for a document: seeded if available, otherwise a plain classify + extract. */
export function traceFor(doc: Document): TraceStep[] {
  const steps =
    seeded[doc.id] ??
    (doc.status === 'processing'
      ? [{ kind: 'classify' as const, label: `Classified as ${doc.type}`, detail: `${doc.pages.length} pages`, status: 'done' as const, ms: 340 }]
      : [
          { kind: 'classify' as const, label: `Classified as ${doc.type}`, detail: `${doc.pages.length} page${doc.pages.length === 1 ? '' : 's'}`, status: 'done' as const, ms: 340 },
          {
            kind: 'extract' as const,
            label: doc.fields.length ? `Extracted ${doc.fields.length} fields` : 'No fields to extract for this type',
            detail: doc.fields.map((f) => f.label).join(', ') || undefined,
            status: doc.fields.some((f) => f.confidence < 0.7) ? ('warning' as const) : ('done' as const),
            ms: 700 + doc.fields.length * 120,
          },
        ])
  return steps.map((s, i) => ({ ...s, id: `${doc.id}-t${i}` }))
}

export function traceForId(docId: string): TraceStep[] {
  const doc = getDocument(docId)
  return doc ? traceFor(doc) : []
}
