import * as React from 'react'
import { useState } from 'react'
import {
  BellIcon,
  ChevronDownIcon,
  FileTextIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
  UploadIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Chip } from '@/components/ui/chip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Field, Label } from '@/components/ui/field'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Radio } from '@/components/ui/radio'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip } from '@/components/ui/tooltip'
import { stages, stageBadge } from '@/data/loans'
import { PipelineTable } from '@/features/pipeline/PipelineTable'
import { Section, Specimen } from './layout'
import { ToolkitSections } from './ToolkitSections'

const sections = [
  ['typography', 'Typography'],
  ['buttons', 'Buttons'],
  ['forms', 'Form fields'],
  ['badges', 'Badges & chips'],
  ['menus', 'Menus'],
  ['table', 'Data table'],
  ['overlays', 'Dialog & sheet'],
  ['tabs', 'Tabs'],
  ['toast', 'Toast'],
  ['feedback', 'Loading & empty'],
  ['confidence', 'Confidence'],
  ['ai-suggestion', 'AI suggestion'],
  ['conditions', 'Condition card'],
  ['activity', 'Activity log'],
  ['viewer', 'Document viewer'],
] as const

/** Style guide. `section` (from #/kit/{id}) scrolls that section into view. */
export function StyleGuide({ section }: { section?: string }) {
  React.useEffect(() => {
    if (section) document.getElementById(section)?.scrollIntoView({ block: 'start' })
    else window.scrollTo({ top: 0 })
  }, [section])

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-[150px_1fr] gap-10 px-8 py-10">
      <nav aria-label="Style guide sections" className="sticky top-[73px] self-start">
        <ul className="flex flex-col gap-0.5 text-[13px]">
          {sections.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#/kit/${id}`}
                aria-current={section === id ? 'location' : undefined}
                className="block rounded-lg px-2.5 py-1.5 text-gray-600 hover:bg-gray-100 hover:text-gray-900 aria-[current]:bg-gray-100 aria-[current]:text-gray-900"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex min-w-0 flex-col gap-16">
        <header className="flex flex-col gap-3">
          <Badge variant="indigo" className="self-start">
            Exercise toolkit
          </Badge>
          <h1 className="text-4xl">
            Every mortgage, <span className="font-display text-[1.15em] font-normal italic tracking-normal">checked</span> on arrival.
          </h1>
          <p className="max-w-2xl text-base text-gray-500">
            Design system for the LoanCrate exercise. Tokens follow loancrate.com: Inter, Instrument Serif for display
            moments, Tailwind gray neutrals, indigo for AI, blue for links and focus.
          </p>
        </header>

        <Typography />
        <Buttons />
        <Forms />
        <BadgesAndChips />
        <Menus />

        <Section id="table" title="Data table" description="Loan pipeline. Sort columns, filter by stage or program, select rows, and open the row menu.">
          <PipelineTable />
        </Section>

        <ToolkitSections />
      </div>
    </div>
  )
}

function Typography() {
  return (
    <Section id="typography" title="Typography" description="Inter for UI and headings (500, −0.03em). Instrument Serif only for display accents.">
      <Specimen label="Display / serif">
        <p className="font-display text-5xl leading-none text-heading">Clear to close.</p>
      </Specimen>
      <Specimen label="H1 · 36/40">
        <h1 className="text-4xl">Loan #4821 · Avery Brennan</h1>
      </Specimen>
      <Specimen label="H2 · 24/32">
        <h2 className="text-2xl">Conditions</h2>
      </Specimen>
      <Specimen label="H3 · 18/28">
        <h3 className="text-lg">Bank statements</h3>
      </Specimen>
      <Specimen label="H4 · 14/20">
        <h4 className="text-sm font-semibold tracking-normal">Large deposit detected</h4>
      </Specimen>
      <Specimen label="Body · 14/22">
        <p className="max-w-prose">
          A deposit of <strong className="font-medium text-gray-900">$48,500</strong> on Oct 14 doesn't
          match the borrower's payroll pattern. A letter of explanation is required before underwriting
          can continue. <a href="#typography" className="text-link underline-offset-2 hover:text-link-hover hover:underline">View statement</a>
        </p>
      </Specimen>
      <Specimen label="Small / meta">
        <p className="text-xs text-gray-500">
          Uploaded by Dana Whitfield · Nov 21, 2:14 PM · LoanApp_4821.pdf, 2.4 MB
        </p>
      </Specimen>
      <Specimen label="Unordered list">
        <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-gray-300">
          <li>Two most recent pay stubs</li>
          <li>W-2s for 2024 and 2025</li>
          <li>60 days of bank statements, all pages</li>
        </ul>
      </Specimen>
      <Specimen label="Ordered list">
        <ol className="flex list-decimal flex-col gap-1 pl-5 marker:text-gray-400">
          <li>Upload the letter of explanation</li>
          <li>AI review checks it against agency guidelines</li>
          <li>Processor clears the condition</li>
        </ol>
      </Specimen>
      <Specimen label="Inline code / data">
        <p>
          Fannie Mae rule <code className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[13px] text-gray-800">B3-4.2-02</code> applies.
          Loan amount <span className="font-medium text-gray-900 tabular-nums">$412,000</span>, DTI <span className="font-medium text-gray-900 tabular-nums">38.2%</span>.
        </p>
      </Specimen>
    </Section>
  )
}

function Buttons() {
  return (
    <Section id="buttons" title="Buttons" description="Near-black primary and lavender-bordered secondary, both 36px, rounded-xl, with a soft shadow. One primary per view.">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Accept</Button>
          <Button variant="secondary">Modify</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">
            <Trash2Icon />
            Delete
          </Button>
          <Button variant="dashed">
            <PlusIcon />
            Add condition
          </Button>
          <Button variant="link">View guideline</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <UploadIcon />
            Upload documents
          </Button>
          <Button size="sm">Small</Button>
          <Button size="sm" variant="secondary">
            Small secondary
          </Button>
          <Button size="xs" variant="outline">
            Extra small
          </Button>
          <Button disabled>Disabled</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IconButton label="Edit" variant="outline">
            <PencilIcon />
          </IconButton>
          <IconButton label="Filter" variant="outline">
            <FilterIcon />
          </IconButton>
          <IconButton label="Notifications">
            <BellIcon />
          </IconButton>
          <IconButton label="Delete" variant="destructive">
            <Trash2Icon />
          </IconButton>
        </div>
      </div>
    </Section>
  )
}

function Forms() {
  const [agree, setAgree] = useState<boolean | 'indeterminate'>(true)
  return (
    <Section id="forms" title="Form fields" description="Text, select, textarea, checkbox and radio. Focus ring is blue-500, errors are red-600.">
      <Card className="grid grid-cols-2 gap-x-6 gap-y-5 p-6">
        <Field label="Borrower name" htmlFor="f-name">
          <Input id="f-name" defaultValue="Avery Brennan" />
        </Field>
        <Field label="Loan amount" htmlFor="f-amount" hint="Max $766,550 for a conforming loan.">
          <Input id="f-amount" inputMode="numeric" placeholder="$0" aria-describedby="f-amount-hint" />
        </Field>
        <Field label="Loan program" htmlFor="f-program">
          <Select id="f-program" defaultValue="Conventional">
            <option>Conventional</option>
            <option>FHA</option>
            <option>VA</option>
            <option>Jumbo</option>
            <option>USDA</option>
          </Select>
        </Field>
        <Field label="Social Security number" htmlFor="f-ssn" error="Enter all 9 digits.">
          <Input id="f-ssn" defaultValue="123-45-67" aria-invalid aria-describedby="f-ssn-hint" />
        </Field>
        <Field label="Co-borrower" htmlFor="f-co" optional>
          <Input id="f-co" placeholder="Full legal name" />
        </Field>
        <Field label="Processor" htmlFor="f-proc" hint="Assigned automatically.">
          <Input id="f-proc" defaultValue="Dana Whitfield" disabled aria-describedby="f-proc-hint" />
        </Field>
        <Field label="Note to underwriter" htmlFor="f-note" className="col-span-2">
          <Textarea id="f-note" placeholder="Explain anything the documents don't…" />
        </Field>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-[13px] font-medium text-gray-900">Notify me when</legend>
          <div className="flex items-center gap-2.5">
            <Checkbox id="c1" defaultChecked />
            <Label htmlFor="c1" className="font-normal text-gray-700">A condition is cleared</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="c2" />
            <Label htmlFor="c2" className="font-normal text-gray-700">AI review flags a document</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="c3" checked={agree} onCheckedChange={setAgree} />
            <Label htmlFor="c3" className="font-normal text-gray-700">Disclosures are due</Label>
          </div>
          <div className="flex items-center gap-2.5">
            <Checkbox id="c4" checked="indeterminate" disabled />
            <Label htmlFor="c4" className="font-normal text-gray-400">Some loans (indeterminate)</Label>
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-2.5">
          <legend className="mb-2.5 text-[13px] font-medium text-gray-900">Loan purpose</legend>
          {['Purchase', 'Rate-and-term refinance', 'Cash-out refinance'].map((option, i) => (
            <div key={option} className="flex items-center gap-2.5">
              <Radio id={`r${i}`} name="purpose" value={option} defaultChecked={i === 0} />
              <Label htmlFor={`r${i}`} className="font-normal text-gray-700">{option}</Label>
            </div>
          ))}
        </fieldset>

        <div className="col-span-2 flex justify-end gap-2 border-t border-border pt-5">
          <Button variant="secondary">Cancel</Button>
          <Button>Save loan</Button>
        </div>
      </Card>
    </Section>
  )
}

function BadgesAndChips() {
  const [active, setActive] = useState<string[]>(['FHA'])
  const [applied, setApplied] = useState(['Stage: Conditions', 'Processor: Dana Whitfield'])
  return (
    <Section id="badges" title="Badges & chips" description="Badges are read-only status. Chips are interactive: toggle to filter, or remove an applied filter.">
      <Specimen label="Loan stage">
        <div className="flex flex-wrap gap-2">
          {stages.map((stage) => (
            <Badge key={stage} variant={stageBadge[stage]} dot>
              {stage}
            </Badge>
          ))}
        </div>
      </Specimen>
      <Specimen label="Tags">
        <div className="flex flex-wrap gap-2">
          <Badge variant="indigo">New</Badge>
          <Badge variant="indigo">
            <SparklesIcon />
            AI reviewed
          </Badge>
          <Badge variant="outline">
            <FileTextIcon />
            LOX
          </Badge>
          <Badge>Fannie Mae</Badge>
          <Badge variant="warning">Large deposit</Badge>
          <Badge variant="danger">Expired</Badge>
          <Badge variant="success">Verified</Badge>
        </div>
      </Specimen>
      <Specimen label="Toggle chips">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Program">
          {['Conventional', 'FHA', 'VA', 'Jumbo'].map((p) => (
            <Chip
              key={p}
              pressed={active.includes(p)}
              onClick={() =>
                setActive((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]))
              }
            >
              {p}
            </Chip>
          ))}
        </div>
      </Specimen>
      <Specimen label="Applied filters">
        <div className="flex flex-wrap items-center gap-2">
          {applied.map((f) => (
            <Chip key={f} onRemove={() => setApplied((prev) => prev.filter((x) => x !== f))}>
              {f}
            </Chip>
          ))}
          {applied.length === 0 && <span className="text-gray-400">No filters</span>}
        </div>
      </Specimen>
    </Section>
  )
}

function Menus() {
  return (
    <Section id="menus" title="Menus" description="Dropdown menu, popover and tooltip, all on Radix primitives.">
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              Actions
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <UploadIcon />
              Request documents
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SparklesIcon />
              Run AI review
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileTextIcon />
              Generate disclosures
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Delete draft
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Why was this flagged?</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <p className="mb-1 flex items-center gap-1.5 font-medium text-gray-900">
              <SparklesIcon aria-hidden className="size-4 text-indigo-500" />
              Large deposit detected
            </p>
            <p className="text-[13px] text-gray-600">
              $48,500 on Oct 14 is more than 50% of monthly qualifying income. Fannie Mae requires the
              source to be documented.
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <Button size="sm" variant="secondary">Dismiss</Button>
              <Button size="sm">Request LOX</Button>
            </div>
          </PopoverContent>
        </Popover>

        <Tooltip content="Debt-to-income ratio">
          <span tabIndex={0} className="cursor-help border-b border-dotted border-gray-400 text-gray-700">
            DTI 38.2%
          </span>
        </Tooltip>
      </div>
    </Section>
  )
}
