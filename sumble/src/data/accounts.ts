import type { BadgeVariant } from '@/components/ui/badge'

export type Industry =
  | 'Software'
  | 'Fintech'
  | 'Healthcare'
  | 'Retail'
  | 'Logistics'
  | 'Media'

export type Owner = { name: string; initials: string }

export type Account = {
  id: string
  name: string
  domain: string
  logoColor: string
  industry: Industry
  techStack: string[]
  headcount: number
  /** 0–100 likelihood the account is in-market. */
  signalScore: number
  /** Year-over-year change in open roles, as a percentage. */
  hiringTrend: number
  owners: Owner[]
  /** ISO date. */
  lastActivity: string
  starred: boolean
}

export const industries: Industry[] = [
  'Software',
  'Fintech',
  'Healthcare',
  'Retail',
  'Logistics',
  'Media',
]

export const industryBadge: Record<Industry, BadgeVariant> = {
  Software: 'blue',
  Fintech: 'green',
  Healthcare: 'rose',
  Retail: 'amber',
  Logistics: 'violet',
  Media: 'neutral',
}

export const technologies = [
  'Snowflake',
  'dbt',
  'Kubernetes',
  'React',
  'Postgres',
  'Kafka',
  'Terraform',
  'Python',
  'Airflow',
  'Go',
  'Rust',
  'Databricks',
]

const people: Owner[] = [
  { name: 'Priya Raman', initials: 'PR' },
  { name: 'Marcus Lee', initials: 'ML' },
  { name: 'Sofia Alvarez', initials: 'SA' },
  { name: 'Jordan Okafor', initials: 'JO' },
  { name: 'Hannah Becker', initials: 'HB' },
  { name: 'Diego Moreno', initials: 'DM' },
]

const companyNames = [
  'Northwind Analytics', 'Lumen Ledger', 'Brightpath Health', 'Cobalt Freight',
  'Harbor & Pine', 'Quillstack', 'Meridian Pay', 'Tidewell Clinics',
  'Parcelry', 'Fieldnote Media', 'Arcadia Robotics', 'Saltbox Retail',
  'Veritas Bio', 'Kestrel Logistics', 'Openfold', 'Copperline Bank',
  'Wavecrest Studios', 'Granite Cloud', 'Juniper Care', 'Atlas Loop',
  'Fernway Goods', 'Signal Harbor', 'Polar Ledger', 'Marigold Health',
  'Trailhead Freight', 'Inkwell News', 'Beacon Systems', 'Orchard Market',
  'Crescent Capital', 'Driftwood Labs', 'Summit Rx', 'Railyard Supply',
  'Pinecone Data', 'Mosaic Broadcast', 'Ironbark Security', 'Cedar & Co.',
  'Halcyon Pay', 'Lattice Health', 'Bluejay Shipping', 'Nimbus Works',
]

const industryByIndex: Industry[] = [
  'Software', 'Fintech', 'Healthcare', 'Logistics', 'Retail', 'Software',
  'Fintech', 'Healthcare', 'Logistics', 'Media', 'Software', 'Retail',
  'Healthcare', 'Logistics', 'Software', 'Fintech', 'Media', 'Software',
  'Healthcare', 'Logistics', 'Retail', 'Software', 'Fintech', 'Healthcare',
  'Logistics', 'Media', 'Software', 'Retail', 'Fintech', 'Software',
  'Healthcare', 'Logistics', 'Software', 'Media', 'Software', 'Retail',
  'Fintech', 'Healthcare', 'Logistics', 'Software',
]

const logoColors = [
  'bg-slate-800', 'bg-green-700', 'bg-sky-700', 'bg-violet-700',
  'bg-amber-600', 'bg-rose-700', 'bg-teal-700', 'bg-indigo-700',
]

/** Small seeded PRNG so the fake data is identical on every load. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)
const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)]

function sample<T>(list: T[], count: number) {
  const pool = [...list]
  const out: T[] = []
  while (out.length < count && pool.length) {
    out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0])
  }
  return out
}

const today = new Date('2026-11-04T12:00:00Z')

export const accounts: Account[] = companyNames.map((name, i) => {
  const daysAgo = Math.floor(rand() * 60)
  const lastActivity = new Date(today)
  lastActivity.setUTCDate(today.getUTCDate() - daysAgo)

  return {
    id: `acct-${i + 1}`,
    name,
    domain: `${name.toLowerCase().replace(/[^a-z]+/g, '')}.example`,
    logoColor: pick(logoColors),
    industry: industryByIndex[i],
    techStack: sample(technologies, 2 + Math.floor(rand() * 4)),
    headcount: Math.round(40 + rand() ** 2 * 9000),
    signalScore: Math.round(10 + rand() * 90),
    hiringTrend: Math.round((rand() - 0.35) * 80),
    owners: sample(people, 1 + Math.floor(rand() * 3)),
    lastActivity: lastActivity.toISOString(),
    starred: rand() > 0.8,
  }
})
