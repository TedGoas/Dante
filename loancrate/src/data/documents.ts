import { daysFromNow, money2 } from '@/lib/seed'

/*
 * Fake loan documents, rendered as HTML "paper" by components/evidence.
 *
 * Page coordinates: every block is absolutely positioned in a 0–100 × 0–100
 * box (x = % of page width, y = % of page height). Extracted-field regions use
 * the same space, so highlights line up with the rendered text exactly.
 * Use the region helpers below rather than hand-typing boxes.
 */

export const docTypes = [
  'Paystub',
  'W-2',
  'Bank statement',
  'Tax return',
  'VOE',
  'Credit report',
  'Appraisal',
  'Title commitment',
  'Homeowners insurance',
  'Gift letter',
  'LOX',
  'Purchase contract',
] as const
export type DocType = (typeof docTypes)[number]

export type DocStatus = 'processing' | 'classified' | 'needs-review' | 'verified' | 'failed'

export const docStatusLabel: Record<DocStatus, string> = {
  processing: 'Processing',
  classified: 'Classified',
  'needs-review': 'Needs review',
  verified: 'Verified',
  failed: 'Failed',
}

export type Region = { page: number; x: number; y: number; w: number; h: number }

/** Keys used to compare extracted values against the 1003 (see application.ts). */
export type FieldKey =
  | 'borrowerName'
  | 'employer'
  | 'monthlyIncome'
  | 'checkingBalance'
  | 'monthlyDebts'
  | 'giftAmount'

export type ExtractedField = {
  id: string
  docId: string
  label: string
  value: string
  confidence: number
  region: Region
  key?: FieldKey
  /** Initial review state for AiSuggestion. Verified docs start accepted. */
  review: 'pending' | 'accepted'
}

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Column = { label: string; w: number; align?: 'left' | 'right' }

export type Block =
  | { kind: 'text'; x: number; y: number; w: number; text: string; size?: Size; bold?: boolean; muted?: boolean; align?: 'left' | 'right'; hand?: boolean }
  | { kind: 'kv'; x: number; y: number; w: number; label: string; value: string }
  | { kind: 'table'; x: number; y: number; w: number; columns: Column[]; rows: string[][] }
  | { kind: 'rule'; x: number; y: number; w: number }
  | { kind: 'paragraph'; x: number; y: number; w: number; text: string; hand?: boolean }
  | { kind: 'signature'; x: number; y: number; w: number; label: string; signed?: string }
  | { kind: 'logo'; x: number; y: number; w: number; h: number; text: string }

export type Page = { blocks: Block[] }

export type Document = {
  id: string
  loanId: string
  type: DocType
  title: string
  fileName: string
  borrower: string
  pages: Page[]
  uploadedAt: Date
  uploadedBy: string
  /** Documents that are versions of each other share a group. */
  versionGroup: string
  version: number
  superseded?: boolean
  status: DocStatus
  failureReason?: string
  quality?: 'low'
  fields: ExtractedField[]
}

/* ------------------------------------------------------------------ */
/* Region helpers                                                      */
/* ------------------------------------------------------------------ */

export const ROW_H = 3
const KV_H = 2.6

type TableBlock = Extract<Block, { kind: 'table' }>
type KvBlock = Extract<Block, { kind: 'kv' }>
type TextBlock = Extract<Block, { kind: 'text' }>

/** Box around a table body row (0-based), optionally one column only. */
export function rowRegion(page: number, t: TableBlock, row: number, col?: number): Region {
  const y = t.y + (row + 1) * ROW_H
  if (col === undefined) return { page, x: t.x - 0.6, y: y - 0.3, w: t.w + 1.2, h: ROW_H }
  const before = t.columns.slice(0, col).reduce((sum, c) => sum + c.w, 0)
  return {
    page,
    x: t.x + (before * t.w) / 100 - 0.6,
    y: y - 0.3,
    w: (t.columns[col].w * t.w) / 100 + 1.2,
    h: ROW_H,
  }
}

export function kvRegion(page: number, kv: KvBlock): Region {
  return { page, x: kv.x - 0.8, y: kv.y - 0.5, w: kv.w + 1.6, h: KV_H }
}

export function textRegion(page: number, t: TextBlock, h = 3.4): Region {
  return { page, x: t.x - 0.8, y: t.y - 0.6, w: t.w + 1.6, h }
}

/* ------------------------------------------------------------------ */
/* Builders                                                            */
/* ------------------------------------------------------------------ */

type FieldSpec = Omit<ExtractedField, 'id' | 'docId' | 'review'> & { review?: ExtractedField['review'] }

type DocBase = Omit<Document, 'fields' | 'pages'>

function finish(base: DocBase, pages: Page[], fields: FieldSpec[]): Document {
  const review: ExtractedField['review'] = base.status === 'verified' ? 'accepted' : 'pending'
  return {
    ...base,
    pages,
    fields: fields.map((f, i) => ({ review, ...f, id: `${base.id}-f${i}`, docId: base.id })),
  }
}

const kv = (x: number, y: number, w: number, label: string, value: string): KvBlock => ({ kind: 'kv', x, y, w, label, value })

type Txn = { date: string; desc: string; amount: number }

function bankStatement(
  base: DocBase,
  opts: {
    bank: string
    holder: string
    account: string
    period: string
    opening: number
    txns: Txn[]
    holderConfidence?: number
    balanceConfidence?: number
    /** Flag the first deposit at or above this amount as a field. */
    flagDepositOver?: number
    flagLabel?: string
    partial?: boolean
  }
): Document {
  let balance = opts.opening
  const rows = opts.txns.map((t) => {
    balance += t.amount
    return [
      t.date,
      t.desc,
      t.amount < 0 ? money2.format(-t.amount) : '',
      t.amount > 0 ? money2.format(t.amount) : '',
      money2.format(balance),
    ]
  })
  const ending = balance
  const perPage = 14
  const columns: Column[] = [
    { label: 'Date', w: 11 },
    { label: 'Description', w: 45 },
    { label: 'Withdrawals', w: 15, align: 'right' },
    { label: 'Deposits', w: 14, align: 'right' },
    { label: 'Balance', w: 15, align: 'right' },
  ]
  const chunks: string[][][] = []
  for (let i = 0; i < rows.length; i += perPage) chunks.push(rows.slice(i, i + perPage))
  const total = opts.partial ? chunks.length + 1 : chunks.length

  const header: TextBlock = { kind: 'text', x: 16, y: 5, w: 50, text: opts.bank, size: 'lg', bold: true }
  const holder = kv(8, 17, 48, 'Account holder', opts.holder)
  const endBal = kv(8, 26, 48, 'Ending balance', money2.format(ending))
  const tables: TableBlock[] = chunks.map((chunk, i) => ({
    kind: 'table',
    x: 8,
    y: i === 0 ? 37 : 12,
    w: 84,
    columns,
    rows: chunk,
  }))

  const pages: Page[] = chunks.map((_, i) => ({
    blocks: [
      ...(i === 0
        ? ([
            { kind: 'logo', x: 8, y: 4.2, w: 6, h: 4.6, text: opts.bank[0] },
            header,
            { kind: 'text', x: 16, y: 8.6, w: 50, text: 'Member FDIC-insured credit union', size: 'xs', muted: true },
            { kind: 'text', x: 56, y: 5, w: 36, text: 'Account statement', size: 'md', bold: true, align: 'right' },
            { kind: 'text', x: 56, y: 8.6, w: 36, text: opts.period, size: 'xs', muted: true, align: 'right' },
            { kind: 'rule', x: 8, y: 13, w: 84 },
            holder,
            kv(8, 20, 48, 'Account number', opts.account),
            kv(8, 23, 48, 'Beginning balance', money2.format(opts.opening)),
            endBal,
            { kind: 'text', x: 8, y: 33, w: 40, text: 'Transactions', size: 'md', bold: true },
          ] satisfies Block[])
        : ([
            { kind: 'text', x: 8, y: 5, w: 60, text: `${opts.bank} · ${opts.account}`, size: 'xs', muted: true },
            { kind: 'text', x: 8, y: 8, w: 40, text: 'Transactions (continued)', size: 'md', bold: true },
          ] satisfies Block[])),
      tables[i],
      { kind: 'text', x: 8, y: 94, w: 84, text: `Page ${i + 1} of ${total}`, size: 'xs', muted: true, align: 'right' },
    ],
  }))

  const fields: FieldSpec[] = [
    { label: 'Account holder', value: opts.holder, confidence: opts.holderConfidence ?? 0.98, region: kvRegion(0, holder), key: 'borrowerName' },
    { label: 'Statement period', value: opts.period, confidence: 0.97, region: { page: 0, x: 55, y: 8, w: 38, h: 2.6 } },
    { label: 'Ending balance', value: money2.format(ending), confidence: opts.balanceConfidence ?? 0.96, region: kvRegion(0, endBal), key: 'checkingBalance' },
  ]

  if (opts.flagDepositOver) {
    const index = opts.txns.findIndex((t) => t.amount >= opts.flagDepositOver!)
    if (index >= 0) {
      const page = Math.floor(index / perPage)
      const txn = opts.txns[index]
      fields.push({
        label: opts.flagLabel ?? 'Large deposit',
        value: `${money2.format(txn.amount)} on ${txn.date}`,
        confidence: 0.97,
        region: rowRegion(page, tables[page], index % perPage),
      })
    }
  }

  return finish(base, pages, fields)
}

function paystub(
  base: DocBase,
  opts: { employer: string; employee: string; payDate: string; period: string; gross: number; ytd: number; nameConfidence?: number }
): Document {
  const employer: TextBlock = { kind: 'text', x: 16, y: 5, w: 48, text: opts.employer, size: 'lg', bold: true }
  const employee = kv(8, 17, 50, 'Employee', opts.employee)
  const payDate = kv(8, 26, 50, 'Pay date', opts.payDate)
  const reg = Math.round(opts.gross * 0.92 * 100) / 100
  const ot = Math.round((opts.gross - reg) * 100) / 100
  const earnings: TableBlock = {
    kind: 'table',
    x: 8,
    y: 35,
    w: 84,
    columns: [
      { label: 'Earnings', w: 40 },
      { label: 'Rate', w: 15, align: 'right' },
      { label: 'Hours', w: 15, align: 'right' },
      { label: 'Current', w: 15, align: 'right' },
      { label: 'Year to date', w: 15, align: 'right' },
    ],
    rows: [
      ['Regular', money2.format(reg / 80), '80.00', money2.format(reg), money2.format(opts.ytd * 0.92)],
      ['Overtime', money2.format((reg / 80) * 1.5), (ot / ((reg / 80) * 1.5)).toFixed(2), money2.format(ot), money2.format(opts.ytd * 0.08)],
      ['Gross pay', '', '', money2.format(opts.gross), money2.format(opts.ytd)],
    ],
  }
  const tax = (r: number) => money2.format(opts.gross * r)
  const deductions: TableBlock = {
    kind: 'table',
    x: 8,
    y: 53,
    w: 84,
    columns: [
      { label: 'Deductions', w: 55 },
      { label: 'Current', w: 22, align: 'right' },
      { label: 'Year to date', w: 23, align: 'right' },
    ],
    rows: [
      ['Federal income tax', tax(0.12), money2.format(opts.ytd * 0.12)],
      ['State income tax', tax(0.035), money2.format(opts.ytd * 0.035)],
      ['Social Security', tax(0.062), money2.format(opts.ytd * 0.062)],
      ['Medicare', tax(0.0145), money2.format(opts.ytd * 0.0145)],
      ['401(k)', tax(0.05), money2.format(opts.ytd * 0.05)],
      ['Net pay', money2.format(opts.gross * 0.7185), money2.format(opts.ytd * 0.7185)],
    ],
  }
  const monthly = (opts.gross * 26) / 12
  const pages: Page[] = [
    {
      blocks: [
        { kind: 'logo', x: 8, y: 4.2, w: 6, h: 4.6, text: opts.employer[0] },
        employer,
        { kind: 'text', x: 16, y: 8.6, w: 48, text: 'Payroll services', size: 'xs', muted: true },
        { kind: 'text', x: 56, y: 5, w: 36, text: 'Earnings statement', size: 'md', bold: true, align: 'right' },
        { kind: 'rule', x: 8, y: 13, w: 84 },
        employee,
        kv(8, 20, 50, 'Pay period', opts.period),
        kv(8, 23, 50, 'Pay frequency', 'Biweekly'),
        payDate,
        earnings,
        deductions,
        { kind: 'text', x: 8, y: 94, w: 84, text: 'This is not a check. Retain for your records.', size: 'xs', muted: true },
      ],
    },
  ]
  return finish(base, pages, [
    { label: 'Employee name', value: opts.employee, confidence: opts.nameConfidence ?? 0.98, region: kvRegion(0, employee), key: 'borrowerName' },
    { label: 'Employer', value: opts.employer, confidence: 0.97, region: textRegion(0, employer), key: 'employer' },
    { label: 'Pay date', value: opts.payDate, confidence: 0.98, region: kvRegion(0, payDate) },
    { label: 'Gross pay (current)', value: money2.format(opts.gross), confidence: 0.95, region: rowRegion(0, earnings, 2, 3) },
    { label: 'Monthly income (calculated)', value: money2.format(monthly), confidence: 0.93, region: rowRegion(0, earnings, 2, 3), key: 'monthlyIncome' },
    { label: 'Year-to-date gross', value: money2.format(opts.ytd), confidence: 0.94, region: rowRegion(0, earnings, 2, 4) },
  ])
}

function w2(base: DocBase, opts: { employer: string; employee: string; wages: number; year: string; nameConfidence?: number }): Document {
  const name = kv(8, 26, 84, "e  Employee's name", opts.employee)
  const employer = kv(8, 17, 84, "c  Employer's name, address, and ZIP", `${opts.employer}, 400 Commerce Pkwy, Columbus, OH 43219`)
  const wages = kv(8, 35, 84, '1  Wages, tips, other compensation', money2.format(opts.wages))
  const pages: Page[] = [
    {
      blocks: [
        { kind: 'text', x: 8, y: 5, w: 40, text: 'Form W-2', size: 'xl', bold: true },
        { kind: 'text', x: 8, y: 9.4, w: 40, text: 'Wage and Tax Statement', size: 'sm' },
        { kind: 'text', x: 60, y: 5, w: 32, text: opts.year, size: 'xl', bold: true, align: 'right' },
        { kind: 'text', x: 52, y: 9.4, w: 40, text: 'Copy B. To be filed with employee’s federal tax return', size: 'xs', muted: true, align: 'right' },
        { kind: 'rule', x: 8, y: 13, w: 84 },
        employer,
        kv(8, 20, 84, 'd  Control number', '0042-118'),
        name,
        kv(8, 29, 84, "f  Employee's address", '1148 Larkspur Ln, Columbus, OH 43215'),
        { kind: 'rule', x: 8, y: 32.5, w: 84 },
        wages,
        kv(8, 38, 84, '2  Federal income tax withheld', money2.format(opts.wages * 0.12)),
        kv(8, 41, 84, '3  Social security wages', money2.format(opts.wages)),
        kv(8, 44, 84, '5  Medicare wages and tips', money2.format(opts.wages)),
        kv(8, 47, 84, '12a  Code D', money2.format(opts.wages * 0.05)),
        { kind: 'text', x: 8, y: 94, w: 84, text: 'Department of the Treasury – Internal Revenue Service', size: 'xs', muted: true },
      ],
    },
  ]
  return finish(base, pages, [
    { label: 'Employee name', value: opts.employee, confidence: opts.nameConfidence ?? 0.97, region: kvRegion(0, name), key: 'borrowerName' },
    { label: 'Employer', value: opts.employer, confidence: 0.96, region: kvRegion(0, employer) },
    { label: `Wages (${opts.year})`, value: money2.format(opts.wages), confidence: 0.97, region: kvRegion(0, wages) },
  ])
}

/** Letterhead + key/value rows + optional paragraph and signature. Covers most other doc types. */
function simpleDoc(
  base: DocBase,
  opts: {
    org: string
    heading: string
    rows: [string, string][]
    paragraph?: string
    hand?: boolean
    signature?: { label: string; signed?: string }
    fields?: { row: number; label?: string; confidence: number; key?: FieldKey }[]
    paragraphField?: { label: string; value: string; confidence: number }
    extraPages?: number
  }
): Document {
  const rows = opts.rows.map(([label, value], i) => kv(8, 17 + i * 3, 84, label, value))
  const after = 17 + opts.rows.length * 3 + 3
  const paragraph: Extract<Block, { kind: 'paragraph' }> | undefined = opts.paragraph
    ? { kind: 'paragraph', x: 8, y: after, w: 84, text: opts.paragraph, hand: opts.hand }
    : undefined
  const blocks: Block[] = opts.hand
    ? []
    : [
        { kind: 'logo', x: 8, y: 4.2, w: 6, h: 4.6, text: opts.org[0] },
        { kind: 'text', x: 16, y: 5, w: 48, text: opts.org, size: 'lg', bold: true },
        { kind: 'text', x: 52, y: 5, w: 40, text: opts.heading, size: 'md', bold: true, align: 'right' },
        { kind: 'rule', x: 8, y: 13, w: 84 },
      ]
  if (opts.hand) blocks.push({ kind: 'text', x: 8, y: 6, w: 84, text: opts.heading, size: 'lg', hand: true })
  blocks.push(...rows)
  if (paragraph) blocks.push(paragraph)
  if (opts.signature) blocks.push({ kind: 'signature', x: 8, y: 80, w: 40, ...opts.signature })
  const pages: Page[] = [{ blocks }]
  for (let i = 0; i < (opts.extraPages ?? 0); i++) {
    pages.push({
      blocks: [
        { kind: 'text', x: 8, y: 5, w: 84, text: `${opts.org} · ${opts.heading} (continued)`, size: 'xs', muted: true },
        { kind: 'paragraph', x: 8, y: 10, w: 84, text: 'Terms, exceptions, and schedules continue on this page. Content omitted in this prototype.' },
      ],
    })
  }
  const fields: FieldSpec[] = (opts.fields ?? []).map((f) => ({
    label: f.label ?? opts.rows[f.row][0],
    value: opts.rows[f.row][1],
    confidence: f.confidence,
    region: kvRegion(0, rows[f.row]),
    key: f.key,
  }))
  if (opts.paragraphField && paragraph) {
    fields.push({ ...opts.paragraphField, region: { page: 0, x: 7.2, y: after - 0.6, w: 85.6, h: 14 } })
  }
  return finish(base, pages, fields)
}

/* ------------------------------------------------------------------ */
/* Seed                                                                */
/* ------------------------------------------------------------------ */

const groceries = (date: string, amt: number): Txn => ({ date, desc: 'KROGER #0442 COLUMBUS OH', amount: -amt })

/* loan-0 · Avery Brennan · Conventional purchase · the rich demo file */
const avery: Document[] = [
  paystub(
    {
      id: 'doc-avery-paystub',
      loanId: 'loan-0',
      type: 'Paystub',
      title: 'Paystub · Oct 13',
      fileName: 'Paystub_Oct13.pdf',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-12, 14, 2),
      uploadedBy: 'Avery Brennan',
      versionGroup: 'avery-paystub',
      version: 1,
      status: 'needs-review',
    },
    { employer: 'Northgate Logistics', employee: 'Avery Brennan', payDate: 'Oct 13, 2026', period: 'Sep 27 – Oct 10, 2026', gross: 4264.62, ytd: 81_027.78 }
  ),
  w2(
    {
      id: 'doc-avery-w2',
      loanId: 'loan-0',
      type: 'W-2',
      title: 'W-2 · 2025',
      fileName: 'W2_2025_Northgate.pdf',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-12, 14, 4),
      uploadedBy: 'Avery Brennan',
      versionGroup: 'avery-w2',
      version: 1,
      status: 'needs-review',
    },
    { employer: 'Northgate Logistics', employee: 'Avery M. Brenan', wages: 106_420.5, year: '2025', nameConfidence: 0.93 }
  ),
  bankStatement(
    {
      id: 'doc-avery-bank-oct-v1',
      loanId: 'loan-0',
      type: 'Bank statement',
      title: 'Bank statement · Oct',
      fileName: 'Statement_Oct_p1.pdf',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-6, 9, 15),
      uploadedBy: 'Avery Brennan',
      versionGroup: 'avery-bank-oct',
      version: 1,
      superseded: true,
      status: 'needs-review',
    },
    {
      bank: 'Ridgeline Federal Credit Union',
      holder: 'Avery Brennan',
      account: 'Checking ••4417',
      period: 'Oct 1 – Oct 31, 2026',
      opening: 22_410.18,
      partial: true,
      txns: [
        { date: 'Oct 2', desc: 'NORTHGATE LOGISTICS PAYROLL', amount: 3064.0 },
        { date: 'Oct 3', desc: 'COLUMBIA GAS OF OHIO', amount: -84.12 },
        groceries('Oct 5', 142.67),
      ],
    }
  ),
  bankStatement(
    {
      id: 'doc-avery-bank-oct',
      loanId: 'loan-0',
      type: 'Bank statement',
      title: 'Bank statement · Oct',
      fileName: 'Statement_Oct_full.pdf',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-3, 16, 41),
      uploadedBy: 'Avery Brennan',
      versionGroup: 'avery-bank-oct',
      version: 2,
      status: 'needs-review',
    },
    {
      bank: 'Ridgeline Federal Credit Union',
      holder: 'Avery Brennan',
      account: 'Checking ••4417',
      period: 'Oct 1 – Oct 31, 2026',
      opening: 22_410.18,
      flagDepositOver: 20_000,
      txns: [
        { date: 'Oct 2', desc: 'NORTHGATE LOGISTICS PAYROLL', amount: 3064.0 },
        { date: 'Oct 3', desc: 'COLUMBIA GAS OF OHIO', amount: -84.12 },
        groceries('Oct 5', 142.67),
        { date: 'Oct 6', desc: 'AEP OHIO ELECTRIC', amount: -118.4 },
        { date: 'Oct 8', desc: 'VENMO CASHOUT', amount: 220.0 },
        { date: 'Oct 9', desc: 'LAKESHORE AUTO FINANCE PMT', amount: -375.0 },
        { date: 'Oct 10', desc: 'SPECTRUM INTERNET', amount: -79.99 },
        groceries('Oct 12', 96.3),
        { date: 'Oct 14', desc: 'MOBILE DEPOSIT REF 88213', amount: 48_500.0 },
        { date: 'Oct 16', desc: 'NORTHGATE LOGISTICS PAYROLL', amount: 3064.0 },
        { date: 'Oct 18', desc: 'SHELL OIL 5741', amount: -52.18 },
        { date: 'Oct 20', desc: 'RENT · HIGHLAND PARK APTS', amount: -1650.0 },
        groceries('Oct 22', 131.04),
        { date: 'Oct 24', desc: 'TARGET T-1207', amount: -64.55 },
        { date: 'Oct 27', desc: 'TRANSFER TO SAVINGS ••4425', amount: -500.0 },
        { date: 'Oct 29', desc: 'PROGRESSIVE INSURANCE', amount: -142.0 },
        { date: 'Oct 30', desc: 'NORTHGATE LOGISTICS PAYROLL', amount: 3064.0 },
        { date: 'Oct 31', desc: 'DIVIDEND', amount: 4.12 },
      ],
    }
  ),
  bankStatement(
    {
      id: 'doc-avery-bank-sep',
      loanId: 'loan-0',
      type: 'Bank statement',
      title: 'Bank statement · Sep',
      fileName: 'IMG_2291.jpg',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-6, 9, 18),
      uploadedBy: 'Avery Brennan',
      versionGroup: 'avery-bank-sep',
      version: 1,
      status: 'needs-review',
      quality: 'low',
    },
    {
      bank: 'Ridgeline Federal Credit Union',
      holder: 'Avery Brennan',
      account: 'Checking ••4417',
      period: 'Sep 1 – Sep 30, 2026',
      opening: 21_874.6,
      holderConfidence: 0.81,
      balanceConfidence: 0.42,
      txns: [
        { date: 'Sep 4', desc: 'NORTHGATE LOGISTICS PAYROLL', amount: 3064.0 },
        { date: 'Sep 5', desc: 'COLUMBIA GAS OF OHIO', amount: -61.77 },
        groceries('Sep 7', 158.2),
        { date: 'Sep 9', desc: 'LAKESHORE AUTO FINANCE PMT', amount: -375.0 },
        { date: 'Sep 18', desc: 'NORTHGATE LOGISTICS PAYROLL', amount: 3064.0 },
        { date: 'Sep 20', desc: 'RENT · HIGHLAND PARK APTS', amount: -1650.0 },
        groceries('Sep 23', 117.85),
        { date: 'Sep 26', desc: 'TRANSFER TO SAVINGS ••4425', amount: -3500.0 },
        { date: 'Sep 30', desc: 'DIVIDEND', amount: 3.98 },
      ],
    }
  ),
  simpleDoc(
    {
      id: 'doc-avery-credit',
      loanId: 'loan-0',
      type: 'Credit report',
      title: 'Credit report · tri-merge',
      fileName: 'CreditReport_TriMerge.pdf',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-14, 11, 0),
      uploadedBy: 'System',
      versionGroup: 'avery-credit',
      version: 1,
      status: 'verified',
    },
    {
      org: 'Keystone Credit Services',
      heading: 'Residential mortgage credit report',
      rows: [
        ['Applicant', 'Avery Brennan'],
        ['Representative score', '742'],
        ['Inquiries (last 90 days)', 'Lakeshore Auto Finance, Sep 29, 2026'],
        ['Open tradelines', '6'],
        ['Total monthly payments', '$1,015.00'],
        ['  Lakeshore Auto Finance (installment)', '$375.00 / mo'],
        ['  Student loan (deferred)', '$0.00 / mo'],
        ['Public records', 'None'],
      ],
      fields: [
        { row: 0, confidence: 0.99, key: 'borrowerName' },
        { row: 1, confidence: 0.99 },
        { row: 2, label: 'Recent inquiry', confidence: 0.97 },
        { row: 4, label: 'Monthly debt payments', confidence: 0.96, key: 'monthlyDebts' },
      ],
      extraPages: 2,
    }
  ),
  simpleDoc(
    {
      id: 'doc-avery-contract',
      loanId: 'loan-0',
      type: 'Purchase contract',
      title: 'Purchase contract',
      fileName: 'PurchaseAgreement_signed.pdf',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-20, 10, 20),
      uploadedBy: 'Dana Whitfield',
      versionGroup: 'avery-contract',
      version: 1,
      status: 'verified',
    },
    {
      org: 'Ohio Residential Purchase Agreement',
      heading: 'Real estate purchase contract',
      rows: [
        ['Buyer(s)', 'Avery Brennan, Sam Brennan'],
        ['Property', '1148 Larkspur Ln, Columbus, OH 43215'],
        ['Purchase price', '$515,000.00'],
        ['Earnest money', '$10,000.00'],
        ['Closing date', 'On or before Dec 2, 2026'],
      ],
      signature: { label: 'Buyer signature', signed: 'Avery Brennan' },
      fields: [
        { row: 2, confidence: 0.99 },
        { row: 3, confidence: 0.98 },
        { row: 4, confidence: 0.95 },
      ],
      extraPages: 5,
    }
  ),
  simpleDoc(
    {
      id: 'doc-avery-lox',
      loanId: 'loan-0',
      type: 'LOX',
      title: 'LOX · credit inquiry',
      fileName: 'IMG_2304.HEIC',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-2, 19, 48),
      uploadedBy: 'Avery Brennan',
      versionGroup: 'avery-lox-inquiry',
      version: 1,
      status: 'needs-review',
      quality: 'low',
    },
    {
      org: 'Handwritten',
      heading: 'Letter of explanation',
      rows: [
        ['Re:', 'Credit inquiry, Lakeshore Auto Finance'],
        ['Date:', 'Nov 20, 2026'],
      ],
      paragraph:
        'To whom it may concern, the inquiry on Sept 29 was me shopping for a car loan. I did not open a new account. The Lakeshore loan I already have is for my 2022 Honda and I pay $375 a month on it.',
      hand: true,
      signature: { label: 'Borrower signature' },
      fields: [{ row: 0, label: 'Subject', confidence: 0.74 }],
      paragraphField: { label: 'Explanation', value: 'Inquiry was rate shopping; no new account opened.', confidence: 0.68 },
    }
  ),
  simpleDoc(
    {
      id: 'doc-avery-hoi',
      loanId: 'loan-0',
      type: 'Homeowners insurance',
      title: 'Homeowners insurance · declarations',
      fileName: 'HOI_Declarations.pdf',
      borrower: 'Avery Brennan',
      uploadedAt: daysFromNow(-1, 13, 5),
      uploadedBy: 'Dana Whitfield',
      versionGroup: 'avery-hoi',
      version: 1,
      status: 'classified',
    },
    {
      org: 'Buckeye Mutual Insurance',
      heading: 'Declarations page',
      rows: [
        ['Named insured', 'Avery Brennan, Sam Brennan'],
        ['Property', '1148 Larkspur Ln, Columbus, OH 43215'],
        ['Policy period', 'Dec 2, 2026 – Dec 2, 2027'],
        ['Dwelling coverage', '$468,000'],
        ['Annual premium', '$1,284.00'],
        ['Mortgagee', 'Lender name ISAOA/ATIMA'],
      ],
      fields: [
        { row: 2, confidence: 0.94 },
        { row: 3, confidence: 0.92 },
        { row: 5, confidence: 0.71 },
      ],
    }
  ),
  {
    id: 'doc-avery-appraisal',
    loanId: 'loan-0',
    type: 'Appraisal',
    title: 'Appraisal report',
    fileName: 'Appraisal_1004.pdf',
    borrower: 'Avery Brennan',
    pages: Array.from({ length: 6 }, () => ({ blocks: [] })),
    uploadedAt: daysFromNow(0, 10, 24),
    uploadedBy: 'AMC upload',
    versionGroup: 'avery-appraisal',
    version: 1,
    status: 'processing',
    fields: [],
  },
]

/* loan-1 · Jordan Okafor · FHA refinance. Large deposit, but no LOX (refinance exception). */
const jordan: Document[] = [
  paystub(
    {
      id: 'doc-jordan-paystub',
      loanId: 'loan-1',
      type: 'Paystub',
      title: 'Paystub · Nov 14',
      fileName: 'paystub_nov14.pdf',
      borrower: 'Jordan Okafor',
      uploadedAt: daysFromNow(-8, 9, 0),
      uploadedBy: 'Jordan Okafor',
      versionGroup: 'jordan-paystub',
      version: 1,
      status: 'verified',
    },
    { employer: 'Miami Valley Health', employee: 'Jordan Okafor', payDate: 'Nov 14, 2026', period: 'Oct 31 – Nov 13, 2026', gross: 3115.38, ytd: 68_538.36 }
  ),
  bankStatement(
    {
      id: 'doc-jordan-bank',
      loanId: 'loan-1',
      type: 'Bank statement',
      title: 'Bank statement · Oct',
      fileName: 'Oct_statement.pdf',
      borrower: 'Jordan Okafor',
      uploadedAt: daysFromNow(-8, 9, 2),
      uploadedBy: 'Jordan Okafor',
      versionGroup: 'jordan-bank',
      version: 1,
      status: 'verified',
    },
    {
      bank: 'Great Miami Savings',
      holder: 'Jordan Okafor',
      account: 'Checking ••0918',
      period: 'Oct 1 – Oct 31, 2026',
      opening: 8_204.5,
      flagDepositOver: 10_000,
      flagLabel: 'Large deposit (refinance: no LOX required)',
      txns: [
        { date: 'Oct 3', desc: 'MIAMI VALLEY HEALTH PAYROLL', amount: 2240.1 },
        { date: 'Oct 7', desc: 'DAYTON P&L', amount: -96.0 },
        { date: 'Oct 11', desc: 'DEPOSIT · VEHICLE SALE', amount: 12_000.0 },
        { date: 'Oct 17', desc: 'MIAMI VALLEY HEALTH PAYROLL', amount: 2240.1 },
        { date: 'Oct 21', desc: 'MORTGAGE PMT · CURRENT SERVICER', amount: -1688.0 },
        { date: 'Oct 31', desc: 'MIAMI VALLEY HEALTH PAYROLL', amount: 2240.1 },
      ],
    }
  ),
  simpleDoc(
    {
      id: 'doc-jordan-voe',
      loanId: 'loan-1',
      type: 'VOE',
      title: 'Verification of employment',
      fileName: 'VOE_MiamiValley.pdf',
      borrower: 'Jordan Okafor',
      uploadedAt: daysFromNow(-4, 15, 30),
      uploadedBy: 'System',
      versionGroup: 'jordan-voe',
      version: 1,
      status: 'verified',
    },
    {
      org: 'Miami Valley Health',
      heading: 'Verification of employment',
      rows: [
        ['Employee', 'Jordan Okafor'],
        ['Position', 'Respiratory therapist'],
        ['Start date', 'Mar 4, 2019'],
        ['Status', 'Active, full time'],
        ['Base pay', '$40.50 / hour'],
      ],
      fields: [
        { row: 0, confidence: 0.99, key: 'borrowerName' },
        { row: 3, confidence: 0.98 },
      ],
    }
  ),
  {
    id: 'doc-jordan-tax',
    loanId: 'loan-1',
    type: 'Tax return',
    title: 'Tax return · 2025',
    fileName: 'scan0007.pdf',
    borrower: 'Jordan Okafor',
    pages: Array.from({ length: 9 }, () => ({ blocks: [] })),
    uploadedAt: daysFromNow(-1, 20, 12),
    uploadedBy: 'Jordan Okafor',
    versionGroup: 'jordan-tax',
    version: 1,
    status: 'failed',
    failureReason: 'Unreadable: pages out of order and 2 pages are upside down.',
    fields: [],
  },
  simpleDoc(
    {
      id: 'doc-jordan-title',
      loanId: 'loan-1',
      type: 'Title commitment',
      title: 'Title commitment',
      fileName: 'TitleCommitment.pdf',
      borrower: 'Jordan Okafor',
      uploadedAt: daysFromNow(-2, 10, 0),
      uploadedBy: 'Title agent',
      versionGroup: 'jordan-title',
      version: 1,
      status: 'classified',
    },
    {
      org: 'Lakeview Title Agency',
      heading: 'Commitment for title insurance',
      rows: [
        ['Proposed insured', 'Lender, its successors and/or assigns'],
        ['Property', '73 Quarry Rd, Dayton, OH 45402'],
        ['Vested owner', 'Jordan Okafor'],
        ['Requirement 4', 'Release of mortgage recorded 2019-0042117'],
      ],
      fields: [
        { row: 2, confidence: 0.96 },
        { row: 3, confidence: 0.88 },
      ],
      extraPages: 3,
    }
  ),
]

/* loan-2 · Maya Lindqvist · VA purchase with gift funds */
const maya: Document[] = [
  simpleDoc(
    {
      id: 'doc-maya-gift',
      loanId: 'loan-2',
      type: 'Gift letter',
      title: 'Gift letter',
      fileName: 'GiftLetter_signed.pdf',
      borrower: 'Maya Lindqvist',
      uploadedAt: daysFromNow(-3, 12, 0),
      uploadedBy: 'Maya Lindqvist',
      versionGroup: 'maya-gift',
      version: 1,
      status: 'needs-review',
    },
    {
      org: 'Gift letter',
      heading: 'Gift of funds',
      rows: [
        ['Donor', 'Karin Lindqvist (mother)'],
        ['Recipient', 'Maya Lindqvist'],
        ['Gift amount', '$25,000.00'],
        ['Date of transfer', 'Nov 6, 2026'],
        ['Repayment expected', 'No'],
      ],
      signature: { label: 'Donor signature', signed: 'Karin Lindqvist' },
      fields: [
        { row: 0, confidence: 0.95 },
        { row: 2, confidence: 0.98, key: 'giftAmount' },
        { row: 4, confidence: 0.97 },
      ],
    }
  ),
  bankStatement(
    {
      id: 'doc-maya-bank',
      loanId: 'loan-2',
      type: 'Bank statement',
      title: 'Bank statement · Nov',
      fileName: 'Nov_statement.pdf',
      borrower: 'Maya Lindqvist',
      uploadedAt: daysFromNow(-2, 8, 45),
      uploadedBy: 'Maya Lindqvist',
      versionGroup: 'maya-bank',
      version: 1,
      status: 'needs-review',
    },
    {
      bank: 'Queen City Bank',
      holder: 'Maya Lindqvist',
      account: 'Checking ••6630',
      period: 'Nov 1 – Nov 20, 2026',
      opening: 14_880.0,
      flagDepositOver: 20_000,
      flagLabel: 'Gift deposit',
      txns: [
        { date: 'Nov 1', desc: 'DFAS VA PAY', amount: 2610.4 },
        { date: 'Nov 6', desc: 'WIRE IN · K LINDQVIST', amount: 25_000.0 },
        { date: 'Nov 8', desc: 'DUKE ENERGY', amount: -103.22 },
        { date: 'Nov 15', desc: 'DFAS VA PAY', amount: 2610.4 },
      ],
    }
  ),
  paystub(
    {
      id: 'doc-maya-paystub',
      loanId: 'loan-2',
      type: 'Paystub',
      title: 'Leave and earnings statement · Nov',
      fileName: 'LES_Nov.pdf',
      borrower: 'Maya Lindqvist',
      uploadedAt: daysFromNow(-3, 12, 2),
      uploadedBy: 'Maya Lindqvist',
      versionGroup: 'maya-paystub',
      version: 1,
      status: 'verified',
    },
    { employer: 'Defense Finance and Accounting Service', employee: 'Maya Lindqvist', payDate: 'Nov 15, 2026', period: 'Nov 1 – Nov 15, 2026', gross: 3354.0, ytd: 70_434.0 }
  ),
]

/* loan-3 · Elijah Patel · Jumbo purchase. Large deposit was a transfer (AI condition waived). */
const elijah: Document[] = [
  bankStatement(
    {
      id: 'doc-elijah-bank',
      loanId: 'loan-3',
      type: 'Bank statement',
      title: 'Bank statement · Oct',
      fileName: 'chk_oct.pdf',
      borrower: 'Elijah Patel',
      uploadedAt: daysFromNow(-5, 9, 30),
      uploadedBy: 'Elijah Patel',
      versionGroup: 'elijah-bank',
      version: 1,
      status: 'verified',
    },
    {
      bank: 'Olentangy Trust',
      holder: 'Elijah Patel',
      account: 'Checking ••7702',
      period: 'Oct 1 – Oct 31, 2026',
      opening: 41_500.0,
      flagDepositOver: 50_000,
      txns: [
        { date: 'Oct 1', desc: 'ACME ROBOTICS PAYROLL', amount: 7840.0 },
        { date: 'Oct 9', desc: 'TRANSFER FROM BROKERAGE ••2290', amount: 60_000.0 },
        { date: 'Oct 15', desc: 'ACME ROBOTICS PAYROLL', amount: 7840.0 },
        { date: 'Oct 22', desc: 'AMEX EPAYMENT', amount: -3210.55 },
      ],
    }
  ),
  {
    id: 'doc-elijah-tax',
    loanId: 'loan-3',
    type: 'Tax return',
    title: 'Tax return · 2025',
    fileName: '2025_1040.pdf',
    borrower: 'Elijah Patel',
    pages: Array.from({ length: 14 }, () => ({ blocks: [] })),
    uploadedAt: daysFromNow(0, 9, 58),
    uploadedBy: 'Elijah Patel',
    versionGroup: 'elijah-tax',
    version: 1,
    status: 'processing',
    fields: [],
  },
]

export const documents: Document[] = [...avery, ...jordan, ...maya, ...elijah]

/** All documents for a loan, including superseded versions. */
export function documentsForLoan(loanId: string): Document[] {
  return documents.filter((d) => d.loanId === loanId)
}

/** Latest version of each document for a loan. */
export function currentDocumentsForLoan(loanId: string): Document[] {
  return documentsForLoan(loanId).filter((d) => !d.superseded)
}

export function getDocument(id: string): Document | undefined {
  return documents.find((d) => d.id === id)
}

/** Every version in a document's group, newest first. */
export function versionsOf(doc: Document): Document[] {
  return documents.filter((d) => d.versionGroup === doc.versionGroup).sort((a, b) => b.version - a.version)
}

export function fieldsForDoc(docId: string): ExtractedField[] {
  return getDocument(docId)?.fields ?? []
}

export function getField(fieldId: string): ExtractedField | undefined {
  for (const d of documents) {
    const f = d.fields.find((x) => x.id === fieldId)
    if (f) return f
  }
  return undefined
}

/** Fields still waiting on a human (AI suggested, not yet accepted). */
export function needsReviewCount(doc: Document): number {
  return doc.fields.filter((f) => f.review === 'pending').length
}
