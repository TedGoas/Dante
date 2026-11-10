/** All fake content and timing for the Clio brief prototype. Sample data only. */

export const TIMING = {
  /** One entry per generation step. Totals 8 seconds. */
  stepMs: [1500, 2000, 2500, 2000],
  chatReplyMs: 900,
  citationPinMs: 2500,
  copiedMs: 1800,
  toastMs: 10000,
  toastExitMs: 140,
  /** Delay between each phrase of a new chat reply. */
  streamPhraseMs: 110,
  /** How long after arriving a chat reply still animates. Stops replays on tab return. */
  streamWindowMs: 1500,
  sectionStaggerMs: 40,
}

export const CREDITS = { total: 200, start: 142 }

export const ORG = {
  name: 'Clio',
  description:
    'Clio is the global leader in legal AI technology, empowering legal professionals and law firms of every size to work smarter, faster, and more securely…',
  industry: 'Scientific and Technical Services',
  headcount: '2.4k',
  hq: 'British Columbia, Canada',
  founded: '2008',
  parentOf: 3,
  domain: 'clio.com',
  domainMore: 1,
  tag: 'Digital Native',
  tagMore: 2,
  icp: { score: '71.0', label: 'Great fit' },
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

export const NEW_DATA_NOTE = '5 new job posts since'

export const HOW_CALCULATED =
  'All sections are ranked by your ICP and used to build the brief. Costs 1 credit. Reopening is free; refreshing costs 1 credit.'

export const SOURCE_LINK_NOTE = "This would link out to the source, but this isn't hooked up in this prototype."

export const COVERAGE: { level: 'full' | 'limited'; text: string }[] = [
  { level: 'full', text: '3 angles you could take · strong data' },
  { level: 'full', text: '5 high-score contacts with reasons' },
  { level: 'limited', text: 'Recent changes · limited data this month' },
]

/** One entry per TIMING.stepMs value. */
export const GENERATION_STEPS = [
  { doing: 'Reading 52 job posts', done: 'Read 52 job posts' },
  { doing: 'Scoring 100 people against your ICP', done: 'Scored 100 people against your ICP' },
  { doing: 'Matching teams to your product', done: 'Matched teams to your product' },
  { doing: 'Writing the angles', done: 'Wrote the angles' },
]

/** Each chip appears once generation reaches its step. */
export const SOURCE_CHIPS = [
  { label: 'LinkedIn profiles', atStep: 0 },
  { label: 'Job posts', atStep: 1 },
  { label: 'Headcount trends', atStep: 2 },
  { label: 'Team structure', atStep: 3 },
]

export type Source = {
  id: number
  type: string
  title: string
  age: string
}

export const SOURCES: Source[] = [
  { id: 1, type: 'Job post', title: 'Accounts Payable Specialist', age: '4 days ago' },
  { id: 2, type: 'Job post', title: 'Senior Manager, Accounts Payable', age: '9 days ago' },
  { id: 3, type: 'Headcount trend', title: 'Finance up 53.3% in 12 months', age: 'this week' },
  { id: 4, type: 'Team structure', title: 'Finance team, 52 matching jobs', age: 'this week' },
  { id: 5, type: 'Job post', title: 'Billing Operations Analyst', age: '2 weeks ago' },
  { id: 6, type: 'Job post', title: 'AP Coordinator, shared mailbox triage', age: '3 weeks ago' },
  { id: 7, type: 'LinkedIn profile', title: 'Curt Sigfstead, Chief Financial Officer', age: '2 months ago' },
  { id: 8, type: 'LinkedIn profile', title: 'Alex MacGillivray, VP Finance', age: '1 month ago' },
  { id: 9, type: 'LinkedIn profile', title: 'Christal Yan, Vice President of Tax', age: '1 month ago' },
  { id: 10, type: 'LinkedIn profile', title: 'Hugo Ruiz-Taboada, VP Strategic Finance & CFO, vLex', age: '3 months ago' },
  { id: 11, type: 'LinkedIn profile', title: 'Nav Gill, VP Finance', age: '2 months ago' },
  { id: 12, type: 'Team structure', title: 'EMEA org, 3 matching jobs', age: 'this week' },
  { id: 13, type: 'Headcount trend', title: 'Sales Development Representative up 31.6% in 12 months', age: 'this week' },
  { id: 14, type: 'Team structure', title: 'Sales team, 17 matching jobs', age: 'this week' },
  { id: 15, type: 'Job post', title: 'Integration Accountant, vLex', age: '5 weeks ago' },
]

export type Contact = {
  id: string
  name: string
  score: number
  title: string
  location: string
  matches: string
}

/** Sorted by score. The Overview table renders this order. */
export const PEOPLE: Contact[] = [
  { id: 'curt', name: 'Curt Sigfstead', score: 71.8, title: 'Chief Financial Officer', location: 'San Francisco, California, United States', matches: 'Finance' },
  { id: 'alex', name: 'Alex MacGillivray, CPA', score: 62.4, title: 'VP Finance', location: 'Vancouver, British Columbia, Canada', matches: 'Finance' },
  { id: 'christal', name: 'Christal Yan, CPA, CA', score: 62.4, title: 'Vice President of Tax', location: 'Greater Vancouver Metropolitan Area', matches: 'Finance' },
  { id: 'hugo', name: 'Hugo Ruiz-Taboada', score: 62.4, title: 'VP Strategic Finance & CFO, vLex (post-acquisition)', location: 'Miami, Florida, United States', matches: 'Finance' },
  { id: 'nav', name: 'Nav Gill, CPA', score: 62.4, title: 'VP Finance', location: 'Greater Vancouver Metropolitan Area', matches: 'Finance' },
]

export const CONTACTS: Record<string, Contact> = Object.fromEntries(PEOPLE.map((p) => [p.id, p]))

export type Team = { id: string; name: string; score: number; matches: string[]; jobs: number }

export const TEAMS: Team[] = [
  { id: 'sales', name: 'Sales team', score: 14.8, matches: ['SDR', 'Finance', 'Accountant'], jobs: 17 },
  { id: 'emea', name: 'EMEA org', score: 11.1, matches: ['Finance', 'Accountant'], jobs: 3 },
  { id: 'finance', name: 'Finance team', score: 11.0, matches: ['Finance', 'Accountant'], jobs: 52 },
  { id: 'revops', name: 'Revenue Operations team', score: 9.5, matches: ['Finance', 'Accountant'], jobs: 1 },
  { id: 'success', name: 'Customer Success team', score: 8.9, matches: ['Finance', 'Accountant'], jobs: 1 },
]

export const TEAMS_BY_ID: Record<string, Team> = Object.fromEntries(TEAMS.map((t) => [t.id, t]))

export const LIST_TOTALS = { people: 100, teams: 39 }

export const HEADCOUNT_BY_PERSONA = [
  { persona: 'Sales Development Representative', current: 154, yearAgo: 117, growth: 31.6 },
  { persona: 'Finance', current: 115, yearAgo: 75, growth: 53.3 },
  { persona: 'Overall', current: 2442, yearAgo: 2021, growth: 20.8 },
]

/** Two items this month, two older. Matches "limited data this month". */
export const RECENT_CHANGES = [
  { date: 'Nov 6', text: 'Posted Accounts Payable Specialist.' },
  { date: 'Nov 1', text: 'Posted Senior Manager, Accounts Payable.' },
  { date: 'Aug 12', text: 'Finance headcount passed 115.' },
  { date: 'Jun 3', text: 'vLex finance team joined after the acquisition.' },
]

export type Evidence = 'Strong' | 'Medium' | 'Weak'

export type Angle = {
  id: string
  short: string
  line: string
  evidence: Evidence
  proof: string
  contacts: { id: string; reason: string }[]
  contactsLimited?: boolean
  whyNow: string[]
  whyNowLimited?: boolean
  teams: { id: string; reason: string }[]
  teamsLimited?: boolean
  emailSubject: string
  /** Language lifted from the sources below. Tinted in the draft. */
  emailSourceLine: string
  emailSourceIds: number[]
  /** Connecting sentence written for this draft. Not tinted. */
  emailBridge: string
}

export const ANGLES: Angle[] = [
  {
    id: 'finance-ap',
    short: 'AP inboxes',
    line: 'Pitch TeamInbox to Finance to clear shared AP inboxes.',
    evidence: 'Strong',
    proof: 'Finance up 53.3% in 12 months. AP roles open now. [1][3]',
    contacts: [
      { id: 'alex', reason: 'VP Finance. AP hiring sits in this group. [2][8]' },
      { id: 'curt', reason: 'Top score. Signs vendor spend. Bring in at pricing. [7]' },
      { id: 'nav', reason: 'VP Finance. Billing ops roles are open. [5][11]' },
      { id: 'christal', reason: 'Tax work depends on clean invoice records. [9]' },
      { id: 'hugo', reason: 'Backup path through the vLex finance team. [10]' },
    ],
    whyNow: [
      'Accounts Payable Specialist posted 4 days ago. [1]',
      'Senior Manager, Accounts Payable posted 9 days ago. [2]',
    ],
    whyNowLimited: true,
    teams: [
      { id: 'finance', reason: 'Most matching jobs. Shared mailboxes named. [4][6]' },
      { id: 'emea', reason: 'Same finance roles, smaller team. [12]' },
      { id: 'revops', reason: 'Billing questions reach this team. [5]' },
    ],
    emailSubject: 'Shared AP inboxes at Clio',
    emailSourceLine: 'Saw Finance is adding AP roles.',
    emailSourceIds: [1, 2],
    emailBridge: 'Shared inboxes get harder to run at that size.',
  },
  {
    id: 'vlex',
    short: 'vLex finance',
    line: 'Give the post-vLex finance teams one shared queue.',
    evidence: 'Medium',
    proof: 'Finance up 53.3%. vLex finance is now in the org. [3][15]',
    contacts: [
      { id: 'hugo', reason: 'Finance lead for vLex after the acquisition. [10][15]' },
      { id: 'alex', reason: 'VP Finance. Likely owner of shared process. [8]' },
      { id: 'curt', reason: 'Signs vendor spend. [7]' },
    ],
    whyNow: ['Integration Accountant, vLex posted 5 weeks ago. [15]', 'EMEA org has 3 matching jobs. [12]'],
    whyNowLimited: true,
    teams: [
      { id: 'finance', reason: 'Clearest owner for this angle. [4]' },
      { id: 'emea', reason: 'Finance roles outside the main team. [12]' },
    ],
    emailSubject: 'One queue for finance after vLex',
    emailSourceLine: 'Saw the vLex finance team is now part of Clio.',
    emailSourceIds: [15],
    emailBridge: 'Two sets of inboxes are hard to run as one.',
  },
  {
    id: 'sdr',
    short: 'SDR replies',
    line: 'Help Sales Development manage shared prospect replies.',
    evidence: 'Weak',
    proof: 'SDRs up 31.6%. No inbox pain in the data yet. [13]',
    contacts: [
      { id: 'curt', reason: 'Possible sponsor. No direct signal. [7]' },
      { id: 'nav', reason: 'Finance partner to Sales. Weak link. [11]' },
    ],
    contactsLimited: true,
    whyNow: ['SDR headcount up 31.6% in a year. [13]'],
    whyNowLimited: true,
    teams: [{ id: 'sales', reason: 'Top team score. Validate first. [14]' }],
    teamsLimited: true,
    emailSubject: 'Shared replies for Sales Development',
    emailSourceLine: 'Saw your SDR team is growing.',
    emailSourceIds: [13],
    emailBridge: 'Prospect replies tend to scatter across inboxes.',
  },
]

export type DraftOrigin = 'sources' | 'playbook' | 'history'

export const DRAFT_ORIGINS = {
  playbook: {
    title: "Your team's playbook",
    detail: 'Approved pitch line. Reps are told to lead with one queue, an owner, and a response time.',
  },
  history: {
    title: 'Your past conversations',
    detail: 'You closed with this line in 9 of your last 12 booked meetings.',
  },
}

export function draftEmail(contact: Contact, angle: Angle | null) {
  const firstName = contact.name.split(' ')[0]
  const bridge = angle ? ` ${angle.emailBridge}` : ''
  const parts: { text: string; origin?: DraftOrigin }[] = [
    { text: `Hi ${firstName},\n\n` },
    { text: angle?.emailSourceLine ?? "Saw Clio's Finance team is growing fast.", origin: 'sources' },
    { text: `${bridge}\n\n` },
    {
      text: 'TeamInbox gives your team one shared queue, with an owner and a response time on every thread.',
      origin: 'playbook',
    },
    { text: '\n\n' },
    { text: 'Worth 15 minutes next week?', origin: 'history' },
    { text: '\n\nBest,\nTed' },
  ]
  return {
    subject: angle?.emailSubject ?? 'Team inboxes at Clio',
    parts,
    sources: (angle?.emailSourceIds ?? [3]).flatMap((id) => SOURCES.filter((s) => s.id === id)),
  }
}

export type ChatMessage = { id: string; role: 'user' | 'sumble'; text: string; createdAt?: number }

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'opening',
    role: 'sumble',
    text: 'Your brief is ready. Strongest angle: clear shared AP inboxes in Finance. [1][3]',
  },
  { id: 'prefill-q', role: 'user', text: 'Is the AP backlog real?' },
  {
    id: 'prefill-a',
    role: 'sumble',
    text: 'Looks like it. Open roles name invoice backlog and mailbox triage. [1][6] Finance is up 53.3% in a year. [3] Billing ops is hiring too. [5]',
  },
]

export const FOLLOW_UPS = [
  {
    prompt: 'Why Alex over the CFO?',
    answer:
      'Alex has the closer role. VP Finance, and AP hiring sits in that group. [2][8] The CFO has the higher score and signs the contract, but is a step away from the inbox. [7] Start with Alex. Bring in the CFO at pricing.',
  },
  {
    prompt: 'Draft an opener for Alex',
    answer:
      '"Alex, saw Finance is adding AP roles. Shared inboxes get harder to run at that size. Worth 15 minutes?" Based on [1][2].',
  },
  {
    prompt: 'What changed this quarter?',
    answer:
      'Two things stand out. Accounts Payable Specialist posted 4 days ago. [1] Senior Manager, Accounts Payable posted 9 days ago. [2] Data is thin this month, so treat this as partial.',
  },
]

export const CHAT_FALLBACK =
  'This prototype only answers the suggested follow-ups. Try one of those.'

/** Invented firm for the "See example" modal. */
export const EXAMPLE_BRIEF = {
  company: 'Northlane Legal Software',
  angle: 'Pitch TeamInbox to Client Support to clear shared-inbox backlogs.',
  evidence: 'Strong' as Evidence,
  sources: 9,
  contacts: [
    { name: 'Jordan Vance', score: 84.2, title: 'VP Customer Support', reason: 'Owns the backlog. Hiring three team leads.' },
    { name: 'Sam Okoye', score: 76.5, title: 'Director, Support Operations', reason: 'Runs queue tooling.' },
    { name: 'Riley Hart', score: 70.1, title: 'Chief Financial Officer', reason: 'Signs vendor spend.' },
  ],
  whyNow: ['Support up 40% in 12 months.', '11 open support roles.'],
}

export function stripCitations(text: string) {
  return text.replace(/\s*\[\d+\]/g, '')
}

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
