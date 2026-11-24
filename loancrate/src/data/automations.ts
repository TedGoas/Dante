/*
 * Things the AI did on its own for a loan (beautifului.dev "Tool chips").
 */

export type AutomationKind = 'classify' | 'rename' | 'replace' | 'create' | 'link' | 'request'
export type Automation = { id: string; kind: AutomationKind; label: string; count?: number; details?: string[] }

export const automations: Record<string, Automation[]> = {
  'loan-0': [
    { id: 'a1', kind: 'classify', label: 'Classified uploads', count: 10 },
    {
      id: 'a2',
      kind: 'rename',
      label: 'Renamed documents',
      count: 3,
      details: ['IMG_2291.jpg → Bank statement · Sep', 'IMG_2304.HEIC → LOX · credit inquiry', 'Appraisal_1004.pdf → Appraisal report'],
    },
    { id: 'a3', kind: 'replace', label: 'Replaced Oct statement v1', details: ['Statement_Oct_p1.pdf (missing pages) → Statement_Oct_full.pdf'] },
    {
      id: 'a4',
      kind: 'create',
      label: 'Created conditions',
      count: 5,
      details: ['LOX for $48,500 deposit', 'Updated paystub', 'Name on W-2 doesn’t match', 'LOX for credit inquiry', 'Undisclosed debt: Lakeshore Auto Finance'],
    },
    { id: 'a5', kind: 'link', label: 'Linked LOX to its condition' },
  ],
  'loan-1': [
    { id: 'b1', kind: 'classify', label: 'Classified uploads', count: 5 },
    { id: 'b2', kind: 'request', label: 'Requested tax return re-upload' },
  ],
}
