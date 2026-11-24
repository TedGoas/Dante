import type { Evidence } from '@/data/conditions'

/*
 * AI-proposed edits to the 1003 (beautifului.dev "Diff table"). Rows without
 * `proposed` are unchanged context. A human accepts or rejects each change.
 */

export type DiffRow = {
  id: string
  label: string
  section: string
  current: string
  proposed?: string
  reason?: string
  evidence?: Evidence
}

export const proposals: Record<string, DiffRow[]> = {
  'loan-0': [
    { id: 'p-name', label: 'Borrower name', section: '1. Borrower', current: 'Avery Brennan' },
    { id: 'p-income', label: 'Monthly base income', section: '1. Borrower', current: '$9,240.00' },
    {
      id: 'p-auto',
      label: 'Lakeshore Auto Finance',
      section: '2. Finances · Liabilities',
      current: 'Not listed',
      proposed: '$375.00/mo · installment',
      reason: 'On the credit report but missing from the 1003.',
      evidence: { docId: 'doc-avery-credit', fieldId: 'doc-avery-credit-f3' },
    },
    {
      id: 'p-debts',
      label: 'Total monthly liabilities',
      section: '2. Finances · Liabilities',
      current: '$640.00',
      proposed: '$1,015.00',
      reason: 'Sum of credit report tradelines.',
      evidence: { docId: 'doc-avery-credit', fieldId: 'doc-avery-credit-f3' },
    },
    {
      id: 'p-checking',
      label: 'Checking ••4417 balance',
      section: '2. Finances · Assets',
      current: '$31,200.00',
      proposed: '$76,890.05',
      reason: 'Oct ending balance. Includes the unsourced $48,500 deposit, which comes out of verified assets if it isn’t documented.',
      evidence: { docId: 'doc-avery-bank-oct', fieldId: 'doc-avery-bank-oct-f2' },
    },
    {
      id: 'p-dti',
      label: 'Back-end DTI',
      section: 'Qualifying',
      current: '36.9%',
      proposed: '41.0%',
      reason: 'Recalculated with the added auto loan ($2,770 housing + $1,015 debts on $9,240 income).',
    },
  ],
}
