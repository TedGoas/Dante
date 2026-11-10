/** All fake content and timing for the Clio brief prototype. Sample data only. */

export const TIMING = {
  /** One entry per generation step. Totals 8 seconds. */
  stepMs: [1500, 2000, 2500, 2000],
  chatReplyMs: 900,
  citationPinMs: 2500,
  copiedMs: 1800,
  toastMs: 10000,
}

export const CREDITS = { total: 200, start: 142 }

export const ORG = {
  name: 'Clio',
  description:
    'Clio is the Intelligent Legal Work Platform that connects the business and the practice of law in one place.',
  headcount: '2,442',
  hq: 'Vancouver, Canada',
  domain: 'clio.com',
}

export const TABS = [
  'Overview',
  'Brief',
  'Signals',
  'Teams',
  'Tech Stack',
  'People',
  'Job Functions',
  'Job Posts',
  'Locations',
  'Trends',
  'Events',
  'Funding',
] as const

export type TabName = (typeof TABS)[number]

export type Source = {
  id: number
  type: string
  title: string
  age: string
}

export const SOURCES: Source[] = [
  { id: 1, type: 'Job post', title: 'Team Lead, Client Support', age: '4 days ago' },
  { id: 2, type: 'Job post', title: 'Director, Client Intake Operations', age: '9 days ago' },
  { id: 3, type: 'Headcount trend', title: 'Client Support up 38% in 12 months', age: 'this week' },
  { id: 4, type: 'LinkedIn profile', title: 'Kathryn Reyes, VP Customer Experience', age: 'joined 6 months ago' },
  { id: 5, type: 'Job post', title: 'Support Operations Analyst', age: '2 weeks ago' },
  { id: 6, type: 'Tech stack', title: 'Shared Outlook mailboxes named in 7 job posts', age: '3 weeks ago' },
  { id: 7, type: 'LinkedIn profile', title: 'Daniel Osei, Chief Financial Officer', age: '2 months ago' },
  { id: 8, type: 'LinkedIn profile', title: 'Marcus Bell, Director, Support Operations', age: '1 month ago' },
  { id: 9, type: 'Headcount trend', title: 'Client Intake up 21% in 12 months', age: 'this week' },
  { id: 10, type: 'Job post', title: 'Partner Marketing Manager', age: '5 weeks ago' },
  { id: 11, type: 'LinkedIn profile', title: 'Elena Kowalski, Head of Partnerships', age: '3 months ago' },
]

export type Contact = {
  id: string
  name: string
  score: number
  title: string
  location: string
}

export const CONTACTS: Record<string, Contact> = {
  kathryn: { id: 'kathryn', name: 'Kathryn Reyes', score: 91, title: 'VP, Customer Experience', location: 'Vancouver, CA' },
  marcus: { id: 'marcus', name: 'Marcus Bell', score: 84, title: 'Director, Support Operations', location: 'Toronto, CA' },
  priya: { id: 'priya', name: 'Priya Nair', score: 78, title: 'Sr. Manager, Client Intake', location: 'Calgary, CA' },
  daniel: { id: 'daniel', name: 'Daniel Osei', score: 72, title: 'Chief Financial Officer', location: 'Vancouver, CA' },
  elena: { id: 'elena', name: 'Elena Kowalski', score: 68, title: 'Head of Partnerships', location: 'Dublin, IE' },
}

export type Evidence = 'Strong' | 'Medium' | 'Weak'

export type Angle = {
  id: string
  line: string
  evidence: Evidence
  proof: string
  contacts: { id: string; reason: string }[]
  contactsLimited?: boolean
  whyNow: string[]
  whyNowLimited?: boolean
  teams: { name: string; headcount: number; openRoles: number; reason: string }[]
  teamsLimited?: boolean
  emailSubject: string
  emailHook: string
}

export const ANGLES: Angle[] = [
  {
    id: 'support',
    line: 'Pitch TeamInbox to Client Support to clear shared-inbox backlogs.',
    evidence: 'Strong',
    proof: 'Support up 38% in 12 months. 14 open roles. [1][3]',
    contacts: [
      { id: 'kathryn', reason: '6 months in. Hiring four support leads. [1][4]' },
      { id: 'marcus', reason: 'Owns queue tooling. Posted the ops analyst role. [5][8]' },
      { id: 'priya', reason: 'Runs the intake inbox. Team up 21%. [2][9]' },
      { id: 'daniel', reason: 'Signs vendor spend. Bring in at pricing. [7]' },
      { id: 'elena', reason: 'Backup path through partner support. [11]' },
    ],
    whyNow: [
      '14 support roles posted since August. [1]',
      'Kathryn took over Customer Experience 6 months ago. [4]',
    ],
    whyNowLimited: true,
    teams: [
      { name: 'Client Support', headcount: 214, openRoles: 14, reason: 'Growing fast on shared mailboxes. [3][6]' },
      { name: 'Client Intake', headcount: 86, openRoles: 5, reason: 'Same inbox pattern, smaller team. [9]' },
      { name: 'Support Operations', headcount: 18, openRoles: 2, reason: 'Owns tooling decisions. [5]' },
    ],
    emailSubject: 'Shared inboxes at Client Support',
    emailHook:
      "Saw you're adding four support leads. Most teams hit shared-inbox limits at that size.",
  },
  {
    id: 'intake',
    line: 'Give Client Intake one queue for new-firm onboarding.',
    evidence: 'Medium',
    proof: 'Intake up 21% in 12 months. 5 open roles. [2][9]',
    contacts: [
      { id: 'priya', reason: 'Owns the intake inbox day to day. [2][9]' },
      { id: 'kathryn', reason: 'Intake reports into Customer Experience. [4]' },
      { id: 'marcus', reason: 'Would run the rollout. [8]' },
    ],
    whyNow: ['New intake director role posted 9 days ago. [2]', 'Mailbox handoffs named in job posts. [6]'],
    whyNowLimited: true,
    teams: [
      { name: 'Client Intake', headcount: 86, openRoles: 5, reason: 'Clearest owner for this angle. [2][9]' },
      { name: 'Client Onboarding', headcount: 52, openRoles: 3, reason: 'Takes handoffs from intake by email. [6]' },
    ],
    emailSubject: 'One queue for new-firm intake',
    emailHook:
      "Saw Client Intake is growing and you're hiring a new director. Handoffs by email get harder at that size.",
  },
  {
    id: 'partners',
    line: 'Help Partnerships track reseller and bar-association threads.',
    evidence: 'Weak',
    proof: 'One open role. No clear inbox pain yet. [10]',
    contacts: [
      { id: 'elena', reason: 'Owns partner relationships. [11]' },
      { id: 'kathryn', reason: 'Possible sponsor. No direct signal. [4]' },
    ],
    contactsLimited: true,
    whyNow: ['Partner marketing role posted 5 weeks ago. [10]'],
    whyNowLimited: true,
    teams: [{ name: 'Partnerships', headcount: 31, openRoles: 1, reason: 'Few signals. Validate first. [10]' }],
    teamsLimited: true,
    emailSubject: 'Partner threads at Clio',
    emailHook: 'Saw the Partnerships team is hiring. Partner threads tend to scatter across personal inboxes.',
  },
]

export function draftEmail(contact: Contact, angle: Angle) {
  const firstName = contact.name.split(' ')[0]
  return {
    subject: angle.emailSubject,
    body: `Hi ${firstName},

${angle.emailHook}

TeamInbox gives your team one shared queue, with an owner and a response time on every thread.

Worth 15 minutes next week?

Best,
Ted`,
  }
}

export type ChatMessage = { id: string; role: 'user' | 'sumble'; text: string }

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'opening',
    role: 'sumble',
    text: 'Your brief is ready. Strongest angle: clear shared-inbox backlogs in Client Support. [1][3]',
  },
  { id: 'prefill-q', role: 'user', text: 'Is the support backlog real?' },
  {
    id: 'prefill-a',
    role: 'sumble',
    text: 'Looks like it. Open roles name response time and inbox backlog. [1][5] Support is up 38% in a year. [3] Mail still runs through shared Outlook mailboxes. [6]',
  },
]

export const FOLLOW_UPS = [
  {
    prompt: 'Why her over the CFO?',
    answer:
      'Kathryn owns the problem. 6 months in and hiring four support leads. [1][4] The CFO signs the contract but feels none of the inbox pain. [7] Start with Kathryn. Bring in the CFO at pricing.',
  },
  {
    prompt: 'Draft an opener for Kathryn',
    answer:
      '"Kathryn, saw you\'re adding four support leads. Most teams hit shared-inbox limits at that size. Worth 15 minutes?" Based on [1][4].',
  },
  {
    prompt: 'What changed this quarter?',
    answer:
      'Two things stand out. Support posted 14 roles since August. [1] Kathryn took over Customer Experience. [4] Data is thin this month, so treat this as partial.',
  },
]

export const CHAT_FALLBACK =
  'This prototype only answers the suggested follow-ups. Try one of those.'

/** Distinct source numbers cited anywhere in an angle's sections. */
export function angleSourceIds(angle: Angle) {
  return citedIds([
    angle.proof,
    ...angle.contacts.map((c) => c.reason),
    ...angle.whyNow,
    ...angle.teams.map((t) => t.reason),
  ])
}

export function citedIds(texts: string[]) {
  const ids = new Set<number>()
  for (const text of texts) {
    for (const match of text.matchAll(/\[(\d+)\]/g)) ids.add(Number(match[1]))
  }
  return [...ids]
}
