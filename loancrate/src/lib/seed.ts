/** Seeded PRNG so fake data is identical on every load. */
export function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** "Today" for all seed data and relative dates, so the demo never drifts. */
export const FIXED_NOW = new Date('2026-11-23T10:30:00')

const DAY = 24 * 60 * 60 * 1000

/** Date offset from FIXED_NOW by days (negative = past), at an optional hour:minute. */
export function daysFromNow(days: number, hour = 10, minute = 0): Date {
  const d = new Date(FIXED_NOW.getTime() + days * DAY)
  d.setHours(hour, minute, 0, 0)
  return d
}

/** Whole calendar days from FIXED_NOW to date (negative = past). */
export function daysUntil(date: Date): number {
  const a = new Date(FIXED_NOW)
  a.setHours(0, 0, 0, 0)
  const b = new Date(date)
  b.setHours(0, 0, 0, 0)
  return Math.round((b.getTime() - a.getTime()) / DAY)
}

const relFormat = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto' })

/** "2 hours ago", "yesterday", "in 3 days", relative to FIXED_NOW. */
export function relativeTime(date: Date): string {
  const diffMin = Math.round((date.getTime() - FIXED_NOW.getTime()) / 60000)
  if (Math.abs(diffMin) < 60) return relFormat.format(diffMin, 'minute')
  const diffHr = Math.round(diffMin / 60)
  if (Math.abs(diffHr) < 24) return relFormat.format(diffHr, 'hour')
  return relFormat.format(daysUntil(date), 'day')
}

export const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
export const longDateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})
export const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
export const money2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
