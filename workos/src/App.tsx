import { useState, type Dispatch, type SetStateAction } from 'react'

import { AppShell } from '@/components/AppShell'
import { ErrorDetailSheet } from '@/components/ErrorDetailSheet'
import { MappingChips } from '@/components/MappingChips'
import {
  MappingPanel,
  MAPPING_FIELDS,
  type FormField,
} from '@/components/MappingPanel'
import { SampleDropzone } from '@/components/SampleDropzone'
import { ValidationTable } from '@/components/ValidationTable'
import { Button } from '@/components/ui/button'
import { ALIAS_SEEDS, type MappingField } from '@/data/aliases'
import type { SampleFile } from '@/data/sampleFiles'
import {
  VALIDATION_ROWS,
  type ValidationRow,
} from '@/data/validationRows'

type LayoutMode = 'a' | 'b' | 'c'
type Phase = 'map' | 'validate'
type FieldErrors = Partial<Record<FormField, string>>

const REQUIRED_MESSAGE = 'This field is required.'

const EMPTY_VALUES: Record<MappingField, string> = {
  ticker: '',
  order: '',
  quantity: '',
  price: '',
}

const LAYOUT_OPTIONS: { value: LayoutMode; label: string }[] = [
  { value: 'b', label: "Ted's first choice" },
  { value: 'a', label: 'Explore 2' },
  { value: 'c', label: 'Explore 3' },
]

function cloneAliases() {
  return {
    ticker: [...ALIAS_SEEDS.ticker],
    order: [...ALIAS_SEEDS.order],
    quantity: [...ALIAS_SEEDS.quantity],
    price: [...ALIAS_SEEDS.price],
  }
}

function requiredFieldErrors(
  name: string,
  nextValues: Record<MappingField, string>
): FieldErrors {
  const errors: FieldErrors = {}
  if (!name.trim()) {
    errors.name = REQUIRED_MESSAGE
  }
  for (const field of MAPPING_FIELDS) {
    if (!nextValues[field].trim()) {
      errors[field] = REQUIRED_MESSAGE
    }
  }
  return errors
}

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('b')
  const [phase, setPhase] = useState<Phase>('map')
  const [name, setName] = useState('')
  const [aliases, setAliases] = useState(cloneAliases)
  const [values, setValues] = useState(EMPTY_VALUES)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [files, setFiles] = useState<SampleFile[]>([])
  const [selected, setSelected] = useState<ValidationRow | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const hasSample = files.length > 0
  const showValidateWorkspace = phase === 'validate'
  const rows = showValidateWorkspace && hasSample ? VALIDATION_ROWS : []
  const tableEmpty = !showValidateWorkspace || !hasSample
  const emptyReason: 'awaiting-continue' | 'awaiting-sample' =
    !showValidateWorkspace ? 'awaiting-continue' : 'awaiting-sample'

  function handleNameChange(next: string) {
    setName(next)
    if (next.trim()) {
      setFieldErrors((errors) => {
        if (!errors.name) return errors
        const cleared = { ...errors }
        delete cleared.name
        return cleared
      })
    }
  }

  function handleValuesChange(update: SetStateAction<Record<MappingField, string>>) {
    setValues((current) => {
      const next = typeof update === 'function' ? update(current) : update
      setFieldErrors((errors) => {
        const cleared = { ...errors }
        for (const field of MAPPING_FIELDS) {
          if (next[field].trim()) {
            delete cleared[field]
          }
        }
        return cleared
      })
      return next
    })
  }

  function handleSelectRow(row: ValidationRow) {
    if (row.status === 'pass') return
    setSelected(row)
    setSheetOpen(true)
  }

  function handleReset() {
    setPhase('map')
    setName('')
    setAliases(cloneAliases())
    setValues(EMPTY_VALUES)
    setFieldErrors({})
    setFiles([])
    setSelected(null)
    setSheetOpen(false)
  }

  function handleLayoutChange(next: LayoutMode) {
    setLayoutMode(next)
    setPhase('map')
    setFieldErrors({})
    setFiles([])
    setSelected(null)
    setSheetOpen(false)
  }

  function handleContinue() {
    const errors = requiredFieldErrors(name, values)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setFieldErrors({})
    setPhase('validate')
  }

  function handleBack() {
    setPhase('map')
    setSelected(null)
    setSheetOpen(false)
  }

  const shared = {
    phase,
    name,
    aliases,
    values,
    files,
    rows,
    tableEmpty,
    emptyReason,
    selectedId: selected?.id,
    fieldErrors,
    onNameChange: handleNameChange,
    onAliasesChange: setAliases,
    onValuesChange: handleValuesChange,
    onFilesChange: setFiles,
    onSelectRow: handleSelectRow,
    onContinue: handleContinue,
    onBack: handleBack,
  }

  return (
    <AppShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Broker Configuration
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Capture how a brokerage names ticker, order, quantity, and price,
            then validate sample orders before going live.
          </p>
        </header>

        {layoutMode === 'a' ? <LayoutA {...shared} /> : null}
        {layoutMode === 'b' ? <LayoutB {...shared} /> : null}
        {layoutMode === 'c' ? <LayoutC {...shared} /> : null}

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
          <button
            type="button"
            onClick={handleReset}
            className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Reset prototype
          </button>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="whitespace-nowrap">Layout</span>
            <select
              value={layoutMode}
              onChange={(event) =>
                handleLayoutChange(event.target.value as LayoutMode)
              }
              className="h-9 min-w-56 border border-border bg-background px-2 text-sm text-foreground"
            >
              {LAYOUT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <ErrorDetailSheet
        row={selected}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </AppShell>
  )
}

type LayoutSharedProps = {
  phase: Phase
  name: string
  aliases: Record<MappingField, string[]>
  values: Record<MappingField, string>
  files: SampleFile[]
  rows: ValidationRow[]
  tableEmpty: boolean
  emptyReason: 'awaiting-continue' | 'awaiting-sample'
  selectedId?: string
  fieldErrors: FieldErrors
  onNameChange: (value: string) => void
  onAliasesChange: Dispatch<SetStateAction<Record<MappingField, string[]>>>
  onValuesChange: Dispatch<SetStateAction<Record<MappingField, string>>>
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
  onSelectRow: (row: ValidationRow) => void
  onContinue: () => void
  onBack?: () => void
}

function LayoutA({
  phase,
  name,
  aliases,
  values,
  files,
  rows,
  tableEmpty,
  emptyReason,
  selectedId,
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  onSelectRow,
  onContinue,
  onBack,
}: LayoutSharedProps) {
  if (phase === 'map') {
    return (
      <div className="flex max-w-xl flex-col gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Step 1 of 2 · Mapping
        </p>
        <MappingPanel
          name={name}
          aliases={aliases}
          values={values}
          files={files}
          fieldErrors={fieldErrors}
          onNameChange={onNameChange}
          onAliasesChange={onAliasesChange}
          onValuesChange={onValuesChange}
          onFilesChange={onFilesChange}
          showDropzone={false}
        />
        <div>
          <Button type="button" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Step 2 of 2 · Validate
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ice-blue underline-offset-2 hover:underline"
        >
          ← Back to mapping
        </button>
      </div>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <MappingPanel
          name={name}
          aliases={aliases}
          values={values}
          files={files}
          onNameChange={onNameChange}
          onAliasesChange={onAliasesChange}
          onValuesChange={onValuesChange}
          onFilesChange={onFilesChange}
          showDropzone
        />
        <ValidationTable
          rows={rows}
          empty={tableEmpty}
          emptyReason={emptyReason}
          selectedId={selectedId}
          onSelectRow={onSelectRow}
        />
      </div>
    </div>
  )
}

function LayoutB({
  phase,
  name,
  aliases,
  values,
  files,
  rows,
  tableEmpty,
  emptyReason,
  selectedId,
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  onSelectRow,
  onContinue,
}: LayoutSharedProps) {
  if (phase === 'map') {
    return (
      <div className="flex max-w-xl flex-col gap-6">
        <MappingPanel
          name={name}
          aliases={aliases}
          values={values}
          files={files}
          fieldErrors={fieldErrors}
          onNameChange={onNameChange}
          onAliasesChange={onAliasesChange}
          onValuesChange={onValuesChange}
          onFilesChange={onFilesChange}
          showDropzone={false}
          description="Map the brokerage’s field names. When you’re ready, continue to attach a sample and validate on this same page."
        />
        <div>
          <Button type="button" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
      <MappingPanel
        name={name}
        aliases={aliases}
        values={values}
        files={files}
        onNameChange={onNameChange}
        onAliasesChange={onAliasesChange}
        onValuesChange={onValuesChange}
        onFilesChange={onFilesChange}
        showDropzone
        description="Adjust mappings if a sample fails. Drop a sample below to run validation."
      />
      <ValidationTable
        rows={rows}
        empty={tableEmpty}
        emptyReason={emptyReason}
        selectedId={selectedId}
        onSelectRow={onSelectRow}
      />
    </div>
  )
}

function LayoutC({
  phase,
  name,
  aliases,
  values,
  files,
  rows,
  tableEmpty,
  emptyReason,
  selectedId,
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  onSelectRow,
  onContinue,
  onBack,
}: LayoutSharedProps) {
  if (phase === 'map') {
    return (
      <div className="flex max-w-xl flex-col gap-6">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Step 1 of 2 · Mapping
        </p>
        <MappingPanel
          name={name}
          aliases={aliases}
          values={values}
          files={files}
          fieldErrors={fieldErrors}
          onNameChange={onNameChange}
          onAliasesChange={onAliasesChange}
          onValuesChange={onValuesChange}
          onFilesChange={onFilesChange}
          showDropzone={false}
        />
        <div>
          <Button type="button" onClick={onContinue}>
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
          Step 2 of 2 · Validate
        </p>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-ice-blue underline-offset-2 hover:underline"
        >
          ← Back to mapping
        </button>
      </div>

      <MappingChips
        name={name}
        aliases={aliases}
        values={values}
        onNameChange={onNameChange}
        onAliasesChange={onAliasesChange}
        onValuesChange={onValuesChange}
      />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-foreground">Sample payload</h2>
          <SampleDropzone files={files} onFilesChange={onFilesChange} />
        </div>
        <ValidationTable
          rows={rows}
          empty={tableEmpty}
          emptyReason={emptyReason}
          selectedId={selectedId}
          onSelectRow={onSelectRow}
        />
      </div>
    </div>
  )
}
