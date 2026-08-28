import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

import { AppShell } from '@/components/AppShell'
import { ErrorDetailSheet } from '@/components/ErrorDetailSheet'
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
import {
  applyTheme,
  DEFAULT_THEME,
  THEME_OPTIONS,
  type ThemeId,
} from '@/lib/theme'

type LayoutMode = 'multi-screen' | 'single-screen'
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
  { value: 'multi-screen', label: 'MultiScreen' },
  { value: 'single-screen', label: 'SingleScreen' },
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

function clearFormState() {
  return {
    name: '',
    aliases: cloneAliases(),
    values: EMPTY_VALUES,
    fieldErrors: {} as FieldErrors,
    files: [] as SampleFile[],
  }
}

export default function App() {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('single-screen')
  const [phase, setPhase] = useState<Phase>('map')
  const [name, setName] = useState('')
  const [aliases, setAliases] = useState(cloneAliases)
  const [values, setValues] = useState(EMPTY_VALUES)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [files, setFiles] = useState<SampleFile[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [resultsScenario, setResultsScenario] =
    useState<ValidationScenario>('all-pass')
  const [theme, setTheme] = useState<ThemeId>(DEFAULT_THEME)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const showResults =
    layoutMode === 'single-screen' || phase === 'validate'
  const rows = showResults ? getValidationRows(resultsScenario) : []
  const tableEmpty = layoutMode === 'single-screen' ? false : phase !== 'validate'
  const emptyReason: 'awaiting-continue' | 'awaiting-sample' =
    layoutMode === 'single-screen' || phase === 'validate'
      ? 'awaiting-sample'
      : 'awaiting-continue'

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
    const cleared = clearFormState()
    setName(cleared.name)
    setAliases(cleared.aliases)
    setValues(cleared.values)
    setFieldErrors(cleared.fieldErrors)
    setFiles(cleared.files)
    setSheetOpen(false)
    setResultsScenario('all-pass')
    if (layoutMode === 'multi-screen') {
      setPhase('map')
    }
  }

  function handleLayoutChange(next: LayoutMode) {
    setLayoutMode(next)
    setFieldErrors({})
    setFiles([])
    setSheetOpen(false)
    setResultsScenario('all-pass')
    if (next === 'multi-screen') {
      setPhase('map')
    }
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

  const validateProps: ValidateWorkspaceProps = {
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
  }

  const multiScreenProps: MultiScreenProps = {
    ...validateProps,
    phase,
    onSimulateValid: handleSimulateValid,
    onSimulateIncomplete: handleSimulateIncomplete,
    onClearInputs: handleClearInputs,
    onContinue: handleContinue,
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
          <label className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            <span>Theme</span>
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value as ThemeId)}
              className="h-9 max-w-full border border-border bg-background px-2 text-sm text-foreground"
            >
              {THEME_OPTIONS.map((option) => (
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

        {layoutMode === 'multi-screen' ? (
          <MultiScreen {...multiScreenProps} />
        ) : (
          <SingleScreen {...validateProps} />
        )}
      </div>

      <ErrorDetailSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </AppShell>
  )
}

type ValidateWorkspaceProps = {
  name: string
  aliases: Record<MappingField, string[]>
  values: Record<MappingField, string>
  files: SampleFile[]
  rows: ValidationRow[]
  tableEmpty: boolean
  emptyReason: 'awaiting-continue' | 'awaiting-sample'
  resultsScenario: ValidationScenario
  onResultsScenarioChange: (scenario: ValidationScenario) => void
  fieldErrors: FieldErrors
  onNameChange: (value: string) => void
  onAliasesChange: Dispatch<SetStateAction<Record<MappingField, string[]>>>
  onValuesChange: Dispatch<SetStateAction<Record<MappingField, string>>>
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
}

type MultiScreenProps = ValidateWorkspaceProps & {
  phase: Phase
  onSimulateValid: () => void
  onSimulateIncomplete: () => void
  onClearInputs: () => void
  onContinue: () => boolean
}

function ValidateWorkspace({
  name,
  aliases,
  values,
  files,
  rows,
  tableEmpty,
  emptyReason,
  resultsScenario,
  onResultsScenarioChange,
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
}: ValidateWorkspaceProps) {
  return (
    <div className="layout-b layout-b--results">
      <h2 className="layout-b__results-title text-lg font-bold tracking-tight text-foreground">
        Results of exampleOrder.js
      </h2>
      <div className="layout-b__stage">
        <ValidationTable
          rows={rows}
          empty={tableEmpty}
          emptyReason={emptyReason}
        />
      </div>
      <div className="layout-b__form">
        <h3 className="text-sm font-semibold text-muted-foreground">
          Configuration
        </h3>
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
      <div className="layout-b__simulation">
        <label className="flex flex-col items-center gap-1.5 text-sm text-muted-foreground">
          <span className="text-xs font-semibold uppercase tracking-[0.08em]">
            Simulation
          </span>
          <select
            value={resultsScenario}
            onChange={(event) =>
              onResultsScenarioChange(
                event.target.value as ValidationScenario
              )
            }
            className="h-9 border border-border bg-background px-2 text-sm text-foreground"
          >
            <option value="all-pass">All columns pass</option>
            <option value="column-fail">Quantity column fails</option>
          </select>
        </label>
      </div>
    </div>
  )
}

function MultiScreen({
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
}: MultiScreenProps) {
  if (phase === 'validate') {
    return (
      <ValidateWorkspace
        name={name}
        aliases={aliases}
        values={values}
        files={files}
        rows={rows}
        tableEmpty={tableEmpty}
        emptyReason={emptyReason}
        resultsScenario={resultsScenario}
        onResultsScenarioChange={onResultsScenarioChange}
        fieldErrors={fieldErrors}
        onNameChange={onNameChange}
        onAliasesChange={onAliasesChange}
        onValuesChange={onValuesChange}
        onFilesChange={onFilesChange}
      />
    )
  }

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

function SingleScreen(props: ValidateWorkspaceProps) {
  return <ValidateWorkspace {...props} />
}
