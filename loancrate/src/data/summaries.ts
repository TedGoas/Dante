import type { Evidence } from '@/data/conditions'

/*
 * AI loan-file summaries (beautifului.dev "Streaming text" + "Context
 * cards"). Segments are text or a citation number into `sources`.
 */

export type SummarySegment = string | { cite: number }
export type SummarySource = { evidence: Evidence; label: string }
export type LoanSummary = { segments: SummarySegment[]; sources: SummarySource[] }

export const summaries: Record<string, LoanSummary> = {
  'loan-0': {
    segments: [
      'Purchase of 1148 Larkspur Ln for $515,000 with a $412,000 conventional loan.',
      { cite: 1 },
      ' Income is steady at $9,240/mo from Northgate Logistics,',
      { cite: 2 },
      ' but the most recent paystub is 41 days old.',
      { cite: 3 },
      ' Three items need a person before underwriting: a $48,500 mobile deposit on Oct 14 has no documented source,',
      { cite: 4 },
      ' the credit report shows a $375/mo Lakeshore auto loan that isn’t on the 1003,',
      { cite: 5 },
      ' and the W-2 name reads “Avery M. Brenan”.',
      { cite: 6 },
      ' The rate lock expires in 2 days, so the deposit LOX is the critical path.',
    ],
    sources: [
      { evidence: { docId: 'doc-avery-contract', fieldId: 'doc-avery-contract-f0' }, label: 'Purchase price' },
      { evidence: { docId: 'doc-avery-paystub', fieldId: 'doc-avery-paystub-f4' }, label: 'Monthly income (calculated)' },
      { evidence: { docId: 'doc-avery-paystub', fieldId: 'doc-avery-paystub-f2' }, label: 'Pay date' },
      { evidence: { docId: 'doc-avery-bank-oct', fieldId: 'doc-avery-bank-oct-f3' }, label: 'Large deposit' },
      { evidence: { docId: 'doc-avery-credit', fieldId: 'doc-avery-credit-f3' }, label: 'Monthly debt payments' },
      { evidence: { docId: 'doc-avery-w2', fieldId: 'doc-avery-w2-f0' }, label: 'Employee name' },
    ],
  },
}
