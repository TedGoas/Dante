import type { BadgeVariant } from '@/components/ui/badge'
import { daysFromNow } from '@/lib/seed'

/*
 * Conditions per loan (see DOMAIN.md › Conditions). AI-created conditions
 * carry a `why` (trigger, plain-language rule, evidence link). Every
 * condition has a history so the audit trail is real.
 */

export const conditionCategories = ['PTD', 'PTC', 'PTF', 'At closing', 'Post-closing'] as const
export type ConditionCategory = (typeof conditionCategories)[number]

export const conditionCategoryLabel: Record<ConditionCategory, string> = {
  PTD: 'Prior to docs',
  PTC: 'Prior to closing',
  PTF: 'Prior to funding',
  'At closing': 'At closing',
  'Post-closing': 'Post-closing',
}

export type ConditionStatus = 'open' | 'requested' | 'received' | 'under-review' | 'cleared' | 'waived' | 'rejected'

export const conditionStatusLabel: Record<ConditionStatus, string> = {
  open: 'Open',
  requested: 'Requested',
  received: 'Received',
  'under-review': 'Under review',
  cleared: 'Cleared',
  waived: 'Waived',
  rejected: 'Rejected',
}

export const conditionStatusBadge: Record<ConditionStatus, BadgeVariant> = {
  open: 'neutral',
  requested: 'blue',
  received: 'indigo',
  'under-review': 'warning',
  cleared: 'success',
  waived: 'outline',
  rejected: 'danger',
}

/** Statuses that still need work before clear to close. */
export const OUTSTANDING: ConditionStatus[] = ['open', 'requested', 'received', 'under-review', 'rejected']

export type ConditionSource = 'AI' | 'AUS' | 'Underwriter'
export type Role = 'Processor' | 'Underwriter' | 'Loan officer' | 'Closer' | 'Post-closer' | 'QC analyst' | 'Borrower'

export type Actor = { kind: 'ai'; name: string } | { kind: 'human'; name: string; role: Role }

export const AI_ACTOR: Actor = { kind: 'ai', name: 'LoanCrate AI' }

export type HistoryEntry = {
  id: string
  actor: Actor
  action: string
  at: Date
  note?: string
}

export type Evidence = { docId: string; fieldId: string }

export type ConditionWhy = {
  /** The data point that fired the rule. */
  trigger: string
  /** The rule in plain language. */
  rule: string
  /** Guideline citation, if any. */
  guideline?: string
  /** What would satisfy it. */
  satisfiedBy: string
  evidence: Evidence
}

export type Condition = {
  id: string
  loanId: string
  title: string
  category: ConditionCategory
  status: ConditionStatus
  source: ConditionSource
  ownerRole: Role
  dueDate: Date
  docIds: string[]
  why?: ConditionWhy
  history: HistoryEntry[]
}

const dana: Actor = { kind: 'human', name: 'Dana Whitfield', role: 'Processor' }

/** The signed-in user for demos (a processor). Actions in the UI are attributed to them. */
export const CURRENT_USER: Actor = dana
const ruth: Actor = { kind: 'human', name: 'Ruth Calloway', role: 'Underwriter' }
const theo: Actor = { kind: 'human', name: 'Theo Marsh', role: 'Underwriter' }
const priya: Actor = { kind: 'human', name: 'Priya Nair', role: 'Processor' }
const borrower = (name: string): Actor => ({ kind: 'human', name, role: 'Borrower' })
const aus: Actor = { kind: 'ai', name: 'Desktop Underwriter (AUS)' }

let seq = 0
const h = (actor: Actor, action: string, at: Date, note?: string): HistoryEntry => ({ id: `h${seq++}`, actor, action, at, note })

export const conditions: Condition[] = [
  /* ---------------- loan-0 · Avery Brennan ---------------- */
  {
    id: 'cond-avery-deposit',
    loanId: 'loan-0',
    title: 'Letter of explanation for $48,500 deposit',
    category: 'PTD',
    status: 'requested',
    source: 'AI',
    ownerRole: 'Processor',
    dueDate: daysFromNow(2),
    docIds: ['doc-avery-bank-oct'],
    why: {
      trigger: '$48,500.00 mobile deposit on Oct 14, Ridgeline FCU checking ••4417',
      rule: 'Single deposit over 50% of monthly qualifying income on a purchase. Qualifying income is $9,240/mo, so anything over $4,620 needs a documented source if used for down payment, closing costs, or reserves.',
      guideline: 'Fannie Mae Selling Guide B3-4.2-02',
      satisfiedBy: 'Borrower LOX plus proof of source (asset sale, gift letter, or transfer from a verified account).',
      evidence: { docId: 'doc-avery-bank-oct', fieldId: 'doc-avery-bank-oct-f3' },
    },
    history: [
      h(AI_ACTOR, 'Created condition from Bank statement · Oct', daysFromNow(-3, 16, 43)),
      h(dana, 'Requested from borrower', daysFromNow(-2, 9, 5), 'Sent through the borrower portal with the deposit highlighted.'),
    ],
  },
  {
    id: 'cond-avery-paystub',
    loanId: 'loan-0',
    title: 'Updated paystub (most recent is over 30 days old)',
    category: 'PTD',
    status: 'open',
    source: 'AI',
    ownerRole: 'Processor',
    dueDate: daysFromNow(3),
    docIds: ['doc-avery-paystub'],
    why: {
      trigger: 'Most recent paystub is dated Oct 13, 2026, which is 41 days ago',
      rule: 'Income documents must be current. The most recent paystub must be dated within 30 days.',
      satisfiedBy: 'Paystub dated on or after Oct 24, 2026 showing year-to-date earnings.',
      evidence: { docId: 'doc-avery-paystub', fieldId: 'doc-avery-paystub-f2' },
    },
    history: [h(AI_ACTOR, 'Created condition from Paystub · Oct 13', daysFromNow(0, 6, 0))],
  },
  {
    id: 'cond-avery-name',
    loanId: 'loan-0',
    title: 'Name on W-2 doesn’t match the application',
    category: 'PTC',
    status: 'open',
    source: 'AI',
    ownerRole: 'Underwriter',
    dueDate: daysFromNow(5),
    docIds: ['doc-avery-w2'],
    why: {
      trigger: 'W-2 shows “Avery M. Brenan”. The 1003 shows “Avery Brennan”.',
      rule: 'Names on income documents must match the application, or the difference must be explained.',
      satisfiedBy: 'Corrected W-2 from the employer, or a signed name affidavit (AKA statement).',
      evidence: { docId: 'doc-avery-w2', fieldId: 'doc-avery-w2-f0' },
    },
    history: [h(AI_ACTOR, 'Created condition from W-2 · 2025', daysFromNow(-12, 14, 6))],
  },
  {
    id: 'cond-avery-inquiry',
    loanId: 'loan-0',
    title: 'Letter of explanation for credit inquiry',
    category: 'PTD',
    status: 'requested',
    source: 'AI',
    ownerRole: 'Processor',
    dueDate: daysFromNow(2),
    docIds: ['doc-avery-credit', 'doc-avery-lox'],
    why: {
      trigger: 'Inquiry from Lakeshore Auto Finance on Sep 29, 2026',
      rule: 'Recent credit inquiries need an explanation that confirms no new, undisclosed debt.',
      satisfiedBy: 'Signed and dated LOX stating whether new credit was opened.',
      evidence: { docId: 'doc-avery-credit', fieldId: 'doc-avery-credit-f2' },
    },
    history: [
      h(AI_ACTOR, 'Created condition from Credit report', daysFromNow(-14, 11, 2)),
      h(dana, 'Requested from borrower', daysFromNow(-13, 9, 30)),
      h(borrower('Avery Brennan'), 'Uploaded LOX · credit inquiry', daysFromNow(-2, 19, 48)),
      h(AI_ACTOR, 'Pre-reviewed upload', daysFromNow(-2, 19, 49), 'Signature line is blank. Handwriting confidence is low.'),
      h(ruth, 'Rejected', daysFromNow(-1, 10, 12), 'LOX is unsigned. Needs borrower signature and date.'),
      h(dana, 'Re-requested from borrower', daysFromNow(-1, 10, 30), 'Asked for a signed copy. Typed is fine.'),
    ],
  },
  {
    id: 'cond-avery-debts',
    loanId: 'loan-0',
    title: 'Undisclosed debt: Lakeshore Auto Finance',
    category: 'PTD',
    status: 'under-review',
    source: 'AI',
    ownerRole: 'Underwriter',
    dueDate: daysFromNow(3),
    docIds: ['doc-avery-credit'],
    why: {
      trigger: 'Credit report shows $1,015/mo in payments. The 1003 lists $640/mo.',
      rule: 'Every debt on the credit report must appear on the application and be included in DTI.',
      satisfiedBy: 'Updated 1003 liabilities and recalculated DTI.',
      evidence: { docId: 'doc-avery-credit', fieldId: 'doc-avery-credit-f3' },
    },
    history: [
      h(AI_ACTOR, 'Created condition from Credit report', daysFromNow(-14, 11, 2)),
      h(dana, 'Updated 1003 liabilities', daysFromNow(-1, 15, 20), 'Added Lakeshore auto loan, $375/mo.'),
      h(dana, 'Sent for underwriter review', daysFromNow(-1, 15, 22)),
    ],
  },
  {
    id: 'cond-avery-voe',
    loanId: 'loan-0',
    title: 'Verbal verification of employment within 10 days of closing',
    category: 'PTF',
    status: 'open',
    source: 'AUS',
    ownerRole: 'Closer',
    dueDate: daysFromNow(8),
    docIds: [],
    history: [h(aus, 'Added from DU findings', daysFromNow(-15, 12, 0))],
  },
  {
    id: 'cond-avery-hoi',
    loanId: 'loan-0',
    title: 'Homeowners insurance declarations page with mortgagee clause',
    category: 'PTC',
    status: 'received',
    source: 'Underwriter',
    ownerRole: 'Processor',
    dueDate: daysFromNow(4),
    docIds: ['doc-avery-hoi'],
    history: [
      h(ruth, 'Added condition', daysFromNow(-10, 14, 0)),
      h(dana, 'Uploaded Homeowners insurance · declarations', daysFromNow(-1, 13, 5)),
    ],
  },
  {
    id: 'cond-avery-contract',
    loanId: 'loan-0',
    title: 'Fully executed purchase contract',
    category: 'PTD',
    status: 'cleared',
    source: 'Underwriter',
    ownerRole: 'Processor',
    dueDate: daysFromNow(-12),
    docIds: ['doc-avery-contract'],
    history: [
      h(ruth, 'Added condition', daysFromNow(-16, 9, 0)),
      h(dana, 'Uploaded Purchase contract', daysFromNow(-20, 10, 20)),
      h(ruth, 'Cleared', daysFromNow(-12, 11, 45)),
    ],
  },

  /* ---------------- loan-1 · Jordan Okafor ---------------- */
  {
    id: 'cond-jordan-tax',
    loanId: 'loan-1',
    title: 'Re-upload 2025 tax return (unreadable)',
    category: 'PTD',
    status: 'requested',
    source: 'AI',
    ownerRole: 'Processor',
    dueDate: daysFromNow(3),
    docIds: ['doc-jordan-tax'],
    why: {
      trigger: 'Tax return · 2025 failed extraction: pages out of order, 2 pages upside down',
      rule: 'Every required document must be legible and complete before underwriting.',
      satisfiedBy: 'A complete, correctly ordered scan of the 2025 return with all schedules.',
      evidence: { docId: 'doc-jordan-tax', fieldId: '' },
    },
    history: [
      h(AI_ACTOR, 'Created condition from failed upload', daysFromNow(-1, 20, 14)),
      h(AI_ACTOR, 'Requested from borrower', daysFromNow(-1, 20, 14), 'Auto-request is on for unreadable uploads.'),
    ],
  },
  {
    id: 'cond-jordan-payoff',
    loanId: 'loan-1',
    title: 'Payoff statement from current servicer',
    category: 'PTC',
    status: 'open',
    source: 'Underwriter',
    ownerRole: 'Processor',
    dueDate: daysFromNow(9),
    docIds: [],
    history: [h(ruth, 'Added condition', daysFromNow(-3, 10, 0))],
  },

  /* ---------------- loan-2 · Maya Lindqvist ---------------- */
  {
    id: 'cond-maya-gift',
    loanId: 'loan-2',
    title: 'Gift letter and proof of donor funds',
    category: 'PTD',
    status: 'under-review',
    source: 'Underwriter',
    ownerRole: 'Underwriter',
    dueDate: daysFromNow(1),
    docIds: ['doc-maya-gift', 'doc-maya-bank'],
    history: [
      h(theo, 'Added condition', daysFromNow(-9, 11, 0)),
      h(borrower('Maya Lindqvist'), 'Uploaded Gift letter', daysFromNow(-3, 12, 0)),
      h(borrower('Maya Lindqvist'), 'Uploaded Bank statement · Nov', daysFromNow(-2, 8, 45)),
      h(AI_ACTOR, 'Pre-reviewed uploads', daysFromNow(-2, 8, 46), '$25,000.00 wire on Nov 6 matches the gift letter amount and donor name. Suggest clearing.'),
    ],
  },
  {
    id: 'cond-maya-coe',
    loanId: 'loan-2',
    title: 'Certificate of Eligibility',
    category: 'PTD',
    status: 'cleared',
    source: 'AUS',
    ownerRole: 'Processor',
    dueDate: daysFromNow(-6),
    docIds: [],
    history: [
      h(aus, 'Added from AUS findings', daysFromNow(-14, 9, 0)),
      h(priya, 'Cleared', daysFromNow(-6, 14, 10), 'COE pulled through the VA portal.'),
    ],
  },

  /* ---------------- loan-3 · Elijah Patel ---------------- */
  {
    id: 'cond-elijah-deposit',
    loanId: 'loan-3',
    title: 'Letter of explanation for $60,000 deposit',
    category: 'PTD',
    status: 'waived',
    source: 'AI',
    ownerRole: 'Processor',
    dueDate: daysFromNow(4),
    docIds: ['doc-elijah-bank'],
    why: {
      trigger: '$60,000.00 deposit on Oct 9, Olentangy Trust checking ••7702',
      rule: 'Single deposit over 50% of monthly qualifying income on a purchase.',
      guideline: 'Fannie Mae Selling Guide B3-4.2-02',
      satisfiedBy: 'Borrower LOX plus proof of source.',
      evidence: { docId: 'doc-elijah-bank', fieldId: 'doc-elijah-bank-f3' },
    },
    history: [
      h(AI_ACTOR, 'Created condition from Bank statement · Oct', daysFromNow(-5, 9, 32)),
      h(theo, 'Waived', daysFromNow(-4, 13, 15), 'Deposit is a transfer between verified accounts. Brokerage ••2290 statement is already in the file.'),
    ],
  },
  {
    id: 'cond-elijah-tax',
    loanId: 'loan-3',
    title: 'Two years of personal tax returns',
    category: 'PTD',
    status: 'received',
    source: 'AUS',
    ownerRole: 'Processor',
    dueDate: daysFromNow(6),
    docIds: ['doc-elijah-tax'],
    history: [
      h(aus, 'Added from AUS findings', daysFromNow(-7, 9, 0)),
      h(borrower('Elijah Patel'), 'Uploaded Tax return · 2025', daysFromNow(0, 9, 58)),
    ],
  },
]

export function conditionsForLoan(loanId: string): Condition[] {
  return conditions.filter((c) => c.loanId === loanId)
}

/** All history entries across a loan's conditions, newest first. */
export function activityForLoan(list: Condition[]): (HistoryEntry & { conditionTitle: string })[] {
  return list
    .flatMap((c) => c.history.map((e) => ({ ...e, conditionTitle: c.title })))
    .sort((a, b) => b.at.getTime() - a.at.getTime())
}
