import { currentDocumentsForLoan, type ExtractedField, type FieldKey } from '@/data/documents'
import { money2 } from '@/lib/seed'

/*
 * What the borrower stated on the 1003 (URLA), for the loans with full files.
 * The Data tab compares these against extracted values (see DOMAIN.md › The 1003).
 */

type StatedItem = {
  key: FieldKey
  label: string
  section: string
  stated: string
  /** Numbers compare with a tolerance; text compares case-insensitively. */
  numeric?: number
}

const stated: Record<string, StatedItem[]> = {
  'loan-0': [
    { key: 'borrowerName', label: 'Borrower name', section: '1. Borrower', stated: 'Avery Brennan' },
    { key: 'employer', label: 'Current employer', section: '1. Borrower', stated: 'Northgate Logistics' },
    { key: 'monthlyIncome', label: 'Monthly base income', section: '1. Borrower', stated: money2.format(9240), numeric: 9240 },
    { key: 'checkingBalance', label: 'Checking ••4417 balance', section: '2. Finances', stated: money2.format(31_200), numeric: 31_200 },
    { key: 'monthlyDebts', label: 'Monthly liabilities', section: '2. Finances', stated: money2.format(640), numeric: 640 },
  ],
  'loan-1': [
    { key: 'borrowerName', label: 'Borrower name', section: '1. Borrower', stated: 'Jordan Okafor' },
    { key: 'employer', label: 'Current employer', section: '1. Borrower', stated: 'Miami Valley Health' },
    { key: 'monthlyIncome', label: 'Monthly base income', section: '1. Borrower', stated: money2.format(6750), numeric: 6750 },
    { key: 'checkingBalance', label: 'Checking ••0918 balance', section: '2. Finances', stated: money2.format(24_000), numeric: 24_000 },
  ],
  'loan-2': [
    { key: 'borrowerName', label: 'Borrower name', section: '1. Borrower', stated: 'Maya Lindqvist' },
    { key: 'monthlyIncome', label: 'Monthly base income', section: '1. Borrower', stated: money2.format(7267), numeric: 7267 },
    { key: 'giftAmount', label: 'Gift (other assets and credits)', section: '2. Finances', stated: money2.format(25_000), numeric: 25_000 },
  ],
  'loan-3': [
    { key: 'borrowerName', label: 'Borrower name', section: '1. Borrower', stated: 'Elijah Patel' },
    { key: 'checkingBalance', label: 'Checking ••7702 balance', section: '2. Finances', stated: money2.format(112_000), numeric: 112_000 },
  ],
}

export type Comparison = {
  key: FieldKey
  label: string
  section: string
  stated: string
  extracted?: ExtractedField
  /** Where the extracted value came from, e.g. "Paystub · Oct 13". */
  sourceTitle?: string
  result: 'match' | 'mismatch' | 'missing'
}

const parseMoney = (value: string) => Number(value.replace(/[^0-9.-]/g, ''))

/** Stated 1003 values vs. the best extracted value for each (current documents only). */
export function compareApplication(loanId: string): Comparison[] {
  const docs = currentDocumentsForLoan(loanId)
  return (stated[loanId] ?? []).map((item) => {
    // Prefer a mismatching source so problems surface (exceptions first).
    const candidates = docs.flatMap((d) => d.fields.filter((f) => f.key === item.key).map((f) => ({ f, d })))
    const isMatch = (f: ExtractedField) =>
      item.numeric !== undefined
        ? Math.abs(parseMoney(f.value) - item.numeric) <= Math.max(5, item.numeric * 0.02)
        : f.value.trim().toLowerCase() === item.stated.trim().toLowerCase()
    const hit = candidates.find(({ f }) => !isMatch(f)) ?? candidates[0]
    if (!hit) return { ...item, result: 'missing' }
    return {
      ...item,
      extracted: hit.f,
      sourceTitle: hit.d.title,
      result: isMatch(hit.f) ? 'match' : 'mismatch',
    }
  })
}
