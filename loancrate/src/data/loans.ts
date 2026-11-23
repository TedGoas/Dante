import type { BadgeVariant } from '@/components/ui/badge'

/* Made-up mortgage pipeline. Seeded so rows are identical on every load. */

export const stages = ['Application', 'Processing', 'Underwriting', 'Conditions', 'Clear to close', 'Suspended'] as const
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
  Suspended: 'danger',
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
  updated: Date
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const first = ['Avery', 'Jordan', 'Maya', 'Elijah', 'Sofia', 'Noah', 'Grace', 'Liam', 'Hana', 'Mateo', 'Chloe', 'Isaac', 'Leah', 'Caleb', 'Nora', 'Theo']
const last = ['Brennan', 'Okafor', 'Lindqvist', 'Patel', 'Moreno', 'Takahashi', 'Delgado', 'Fischer', 'Abara', 'Quinn', 'Sato', 'Holloway', 'Marsh', 'Vance']

const rand = mulberry32(4821)
const pick = <T,>(list: readonly T[]) => list[Math.floor(rand() * list.length)]
const base = new Date('2026-11-23T12:00:00').getTime()

export const loans: Loan[] = Array.from({ length: 28 }, (_, i) => {
  const stage = pick(stages)
  const program = pick(programs)
  const surname = pick(last)
  const amount =
    program === 'Jumbo'
      ? 820_000 + Math.round(rand() * 900) * 1000
      : 180_000 + Math.round(rand() * 520) * 1000
  return {
    id: `loan-${i}`,
    number: String(4821 + i * 7),
    borrower: `${pick(first)} ${surname}`,
    coBorrower: rand() > 0.6 ? `${pick(first)} ${surname}` : undefined,
    program,
    purpose: rand() > 0.35 ? 'Purchase' : 'Refinance',
    amount,
    stage,
    openConditions: stage === 'Clear to close' ? 0 : Math.floor(rand() * 9),
    aiFlags: stage === 'Clear to close' ? 0 : Math.floor(rand() * 4),
    processor: pick(processors),
    updated: new Date(base - Math.floor(rand() * 14 * 24 * 60) * 60_000),
  }
})
