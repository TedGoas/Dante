import type { BadgeVariant } from '@/components/ui/badge'
import { daysFromNow, mulberry32 } from '@/lib/seed'

/*
 * Made-up mortgage pipeline. Seeded so rows are identical on every load.
 * loan-0…loan-3 are hand-authored "rich" files with documents and conditions
 * (see documents.ts / conditions.ts). The rest are sparse pipeline filler.
 * Stage names follow the lifecycle in DOMAIN.md.
 */

export const stages = [
  'Application',
  'Processing',
  'Underwriting',
  'Conditions',
  'Clear to close',
  'Closing',
  'Post-closing',
] as const
export type Stage = (typeof stages)[number]

export const programs = ['Conventional', 'FHA', 'VA', 'Jumbo', 'USDA'] as const
export type Program = (typeof programs)[number]

export const processors = ['Dana Whitfield', 'Marcus Reyes', 'Priya Nair', 'Owen Kessler'] as const

export const stageBadge: Record<Stage, BadgeVariant> = {
  Application: 'neutral',
  Processing: 'blue',
  Underwriting: 'indigo',
  Conditions: 'warning',
  'Clear to close': 'success',
  Closing: 'success',
  'Post-closing': 'outline',
}

export type Loan = {
  id: string
  number: string
  borrower: string
  coBorrower?: string
  program: Program
  purpose: 'Purchase' | 'Refinance'
  amount: number
  stage: Stage
  openConditions: number
  aiFlags: number
  processor: string
  underwriter: string
  propertyAddress: string
  closingDate: Date
  rateLockExpires: Date
  updated: Date
}

/** Loans with full document + condition files. Use these in demos. */
export const RICH_LOAN_IDS = ['loan-0', 'loan-1', 'loan-2', 'loan-3'] as const
export const DEMO_LOAN_ID = 'loan-0'

const rich: Loan[] = [
  {
    id: 'loan-0',
    number: '4821',
    borrower: 'Avery Brennan',
    coBorrower: 'Sam Brennan',
    program: 'Conventional',
    purpose: 'Purchase',
    amount: 412_000,
    stage: 'Conditions',
    openConditions: 7,
    aiFlags: 5,
    processor: 'Dana Whitfield',
    underwriter: 'Ruth Calloway',
    propertyAddress: '1148 Larkspur Ln, Columbus, OH 43215',
    closingDate: daysFromNow(9),
    rateLockExpires: daysFromNow(2),
    updated: daysFromNow(0, 9, 12),
  },
  {
    id: 'loan-1',
    number: '4828',
    borrower: 'Jordan Okafor',
    program: 'FHA',
    purpose: 'Refinance',
    amount: 286_000,
    stage: 'Underwriting',
    openConditions: 2,
    aiFlags: 1,
    processor: 'Dana Whitfield',
    underwriter: 'Ruth Calloway',
    propertyAddress: '73 Quarry Rd, Dayton, OH 45402',
    closingDate: daysFromNow(16),
    rateLockExpires: daysFromNow(12),
    updated: daysFromNow(0, 8, 40),
  },
  {
    id: 'loan-2',
    number: '4835',
    borrower: 'Maya Lindqvist',
    program: 'VA',
    purpose: 'Purchase',
    amount: 358_500,
    stage: 'Conditions',
    openConditions: 1,
    aiFlags: 0,
    processor: 'Priya Nair',
    underwriter: 'Theo Marsh',
    propertyAddress: '902 Alder Ct, Cincinnati, OH 45202',
    closingDate: daysFromNow(4),
    rateLockExpires: daysFromNow(1),
    updated: daysFromNow(-1, 16, 5),
  },
  {
    id: 'loan-3',
    number: '4842',
    borrower: 'Elijah Patel',
    program: 'Jumbo',
    purpose: 'Purchase',
    amount: 1_085_000,
    stage: 'Processing',
    openConditions: 1,
    aiFlags: 0,
    processor: 'Marcus Reyes',
    underwriter: 'Theo Marsh',
    propertyAddress: '18 Hollis Ridge Dr, Westerville, OH 43081',
    closingDate: daysFromNow(27),
    rateLockExpires: daysFromNow(21),
    updated: daysFromNow(-2, 11, 30),
  },
]

const first = ['Avery', 'Jordan', 'Maya', 'Elijah', 'Sofia', 'Noah', 'Grace', 'Liam', 'Hana', 'Mateo', 'Chloe', 'Isaac', 'Leah', 'Caleb', 'Nora', 'Theo']
const last = ['Brennan', 'Okafor', 'Lindqvist', 'Patel', 'Moreno', 'Takahashi', 'Delgado', 'Fischer', 'Abara', 'Quinn', 'Sato', 'Holloway', 'Marsh', 'Vance']
const streets = ['Maple Ave', 'Birch St', 'Cedar Ln', 'Ridge Rd', 'Harbor Way', 'Elm Ct', 'Summit Dr']
const cities = ['Columbus, OH 43215', 'Dayton, OH 45402', 'Akron, OH 44308', 'Toledo, OH 43604']
const underwriters = ['Ruth Calloway', 'Theo Marsh']

const rand = mulberry32(4821)
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)]

const sparse: Loan[] = Array.from({ length: 24 }, (_, i) => {
  const stage = pick(stages)
  const program = pick(programs)
  const surname = pick(last)
  const amount =
    program === 'Jumbo'
      ? 820_000 + Math.round(rand() * 900) * 1000
      : 180_000 + Math.round(rand() * 520) * 1000
  const closeIn = 3 + Math.floor(rand() * 40)
  const done = stage === 'Clear to close' || stage === 'Closing' || stage === 'Post-closing'
  const open = done ? 0 : Math.floor(rand() * 9)
  const flags = done ? 0 : Math.min(open, Math.floor(rand() * 4))
  return {
    id: `loan-${i + 4}`,
    number: String(4849 + i * 7),
    borrower: `${pick(first)} ${surname}`,
    coBorrower: rand() > 0.6 ? `${pick(first)} ${surname}` : undefined,
    program,
    purpose: rand() > 0.35 ? 'Purchase' : 'Refinance',
    amount,
    stage,
    openConditions: open,
    aiFlags: flags,
    processor: pick(processors),
    underwriter: pick(underwriters),
    propertyAddress: `${100 + Math.floor(rand() * 900)} ${pick(streets)}, ${pick(cities)}`,
    closingDate: daysFromNow(stage === 'Post-closing' ? -closeIn : closeIn),
    rateLockExpires: daysFromNow(stage === 'Post-closing' ? -closeIn - 2 : closeIn - 2),
    updated: daysFromNow(-Math.floor(rand() * 14), 8 + Math.floor(rand() * 9), Math.floor(rand() * 60)),
  }
})

export const loans: Loan[] = [...rich, ...sparse]

export function getLoan(id: string): Loan | undefined {
  return loans.find((loan) => loan.id === id)
}
