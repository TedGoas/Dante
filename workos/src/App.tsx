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
  getValidationRows,
  type ValidationRow,
  type ValidationScenario,
} from '@/data/validationRows'

type LayoutMode = 'a' | 'b' | 'c'
type Phase = 'map' | 'validate'
type FieldErrors = Partial<Record<FormField, string>>

const REQUIRED_MESSAGE = 'This field is required.'
const UNMAPPED_MESSAGE = 'Could not map this field.'

const EMPTY_VALUES: Record<MappingField, string> = {
  ticker: '',
  order: '',
  quantity: '',
  price: '',
}

const VALID_MAPPING_VALUES: Record<MappingField, string> = {
  ticker: ALIAS_SEEDS.ticker[0],
  order: ALIAS_SEEDS.order[0],
  quantity: ALIAS_SEEDS.quantity[0],
  price: ALIAS_SEEDS.price[0],
}

/** Field left blank when simulating incomplete sample parsing. */
const UNMAPPED_FIELD: MappingField = 'price'

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
  const [sheetOpen, setSheetOpen] = useState(false)
  const [resultsScenario, setResultsScenario] =
    useState<ValidationScenario>('all-pass')

  const showValidateWorkspace = phase === 'validate'
  const rows = showValidateWorkspace
    ? getValidationRows(resultsScenario)
    : []
  const tableEmpty = !showValidateWorkspace
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

  function handleSimulateValid() {
    setValues({ ...VALID_MAPPING_VALUES })
    setFieldErrors((errors) => {
      const cleared = { ...errors }
      for (const field of MAPPING_FIELDS) {
        delete cleared[field]
      }
      return cleared
    })
  }

  function handleSimulateIncomplete() {
    setValues({
      ...VALID_MAPPING_VALUES,
      [UNMAPPED_FIELD]: '',
    })
    setFieldErrors((errors) => {
      const next = { ...errors }
      for (const field of MAPPING_FIELDS) {
        delete next[field]
      }
      next[UNMAPPED_FIELD] = UNMAPPED_MESSAGE
      return next
    })
  }

  function handleClearInputs() {
    setValues(EMPTY_VALUES)
    setFieldErrors((errors) => {
      const cleared = { ...errors }
      for (const field of MAPPING_FIELDS) {
        delete cleared[field]
      }
      return cleared
    })
  }

  function handleReset() {
    setPhase('map')
    setName('')
    setAliases(cloneAliases())
    setValues(EMPTY_VALUES)
    setFieldErrors({})
    setFiles([])
    setSheetOpen(false)
    setResultsScenario('all-pass')
  }

  function handleLayoutChange(next: LayoutMode) {
    setLayoutMode(next)
    setPhase('map')
    setFieldErrors({})
    setFiles([])
    setSheetOpen(false)
    setResultsScenario('all-pass')
  }

  function handleContinue(): boolean {
    const errors = requiredFieldErrors(name, values)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return false
    }
    setFieldErrors({})
    setPhase('validate')
    return true
  }

  function handleBack() {
    setPhase('map')
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
    resultsScenario,
    onResultsScenarioChange: setResultsScenario,
    fieldErrors,
    onNameChange: handleNameChange,
    onAliasesChange: setAliases,
    onValuesChange: handleValuesChange,
    onFilesChange: setFiles,
    onSimulateValid: handleSimulateValid,
    onSimulateIncomplete: handleSimulateIncomplete,
    onClearInputs: handleClearInputs,
    onContinue: handleContinue,
    onBack: handleBack,
  }

  return (
    <AppShell
      footer={
        <>
          <button
            type="button"
            onClick={handleReset}
            className="self-start text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            Reset prototype
          </button>
          <label className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <span>Version</span>
            <select
              value={layoutMode}
              onChange={(event) =>
                handleLayoutChange(event.target.value as LayoutMode)
              }
              className="h-9 max-w-full border border-border bg-background px-2 text-sm text-foreground"
            >
              {LAYOUT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </>
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="max-w-2xl">
          <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-4xl">
            Broker Configuration
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Set how a brokerage names ticker, order, quantity, and price, then
            test the mapping with a sample before going live.
          </p>
        </header>

        {layoutMode === 'a' ? <LayoutA {...shared} /> : null}
        {layoutMode === 'b' ? <LayoutB {...shared} /> : null}
        {layoutMode === 'c' ? <LayoutC {...shared} /> : null}
      </div>

      <ErrorDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} />
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
  resultsScenario?: ValidationScenario
  onResultsScenarioChange?: (scenario: ValidationScenario) => void
  fieldErrors: FieldErrors
  onNameChange: (value: string) => void
  onAliasesChange: Dispatch<SetStateAction<Record<MappingField, string[]>>>
  onValuesChange: Dispatch<SetStateAction<Record<MappingField, string>>>
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
  onSimulateValid: () => void
  onSimulateIncomplete: () => void
  onClearInputs: () => void
  onContinue: () => boolean
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
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  onSimulateValid,
  onSimulateIncomplete,
  onClearInputs,
  onContinue,
  onBack,
}: LayoutSharedProps) {
  if (phase === 'map') {
    return (
      <div className="flex max-w-5xl flex-col gap-6">
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
          onSimulateValid={onSimulateValid}
          onSimulateIncomplete={onSimulateIncomplete}
          onClearInputs={onClearInputs}
          dropzonePlacement="beside-fields"
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
        />
        <div className="flex flex-col gap-4">
          <SampleDropzone files={files} onFilesChange={onFilesChange} />
          <ValidationTable
            rows={rows}
            empty={tableEmpty}
            emptyReason={emptyReason}
          />
        </div>
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
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  onSimulateValid,
  onSimulateIncomplete,
  onClearInputs,
  onContinue,
  resultsScenario,
  onResultsScenarioChange,
}: LayoutSharedProps) {
  if (phase === 'map') {
    return (
      <div className="layout-b layout-b--configure">
        <div className="layout-b__intro">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Configuration
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter a name and map ticker, order, quantity, and price. Type them
            in, or use a sample on the right to fill the fields.
          </p>
        </div>
        <div className="layout-b__form">
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
            showHeader={false}
          />
          <div>
            <Button type="button" onClick={() => onContinue()}>
              Continue
            </Button>
          </div>
        </div>
        <div className="layout-b__stage">
          <SampleDropzone
            mode="simulate"
            fill
            heading="Drop a sample or transcript"
            description="Optional. Use a sample to fill the mapping fields on the left."
            onSimulateValid={onSimulateValid}
            onSimulateIncomplete={onSimulateIncomplete}
            onClearInputs={onClearInputs}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="layout-b layout-b--results">
      <div className="layout-b__intro">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Configuration
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Adjust a mapping if a result looks wrong.
        </p>
      </div>
      <div className="layout-b__form">
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
          showHeader={false}
        />
      </div>
      <div className="layout-b__stage">
        <ValidationTable
          rows={rows}
          empty={tableEmpty}
          emptyReason={emptyReason}
          scenario={resultsScenario}
          onScenarioChange={onResultsScenarioChange}
        />
      </div>
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
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  onSimulateValid,
  onSimulateIncomplete,
  onClearInputs,
  onContinue,
  onBack,
}: LayoutSharedProps) {
  if (phase === 'map') {
    return (
      <div className="flex max-w-5xl flex-col gap-6">
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
          onSimulateValid={onSimulateValid}
          onSimulateIncomplete={onSimulateIncomplete}
          onClearInputs={onClearInputs}
          dropzonePlacement="beside-fields"
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
        />
      </div>
    </div>
  )
}
