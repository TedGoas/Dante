import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

import { AppShell } from '@/components/AppShell'
import { ErrorDetailSheet } from '@/components/ErrorDetailSheet'
import {
  MappingPanel,
  MAPPING_FIELDS,
  type FormField,
} from '@/components/MappingPanel'
import { ValidationTable } from '@/components/ValidationTable'
import { Button } from '@/components/ui/button'
import { ALIAS_SEEDS, FIELD_LABELS, type MappingField } from '@/data/aliases'
import {
  EXAMPLE_ORDER_FILE,
  EXAMPLE_ORDER_PAYLOAD_FIELDS,
} from '@/data/exampleOrder'
import type { SampleFile } from '@/data/sampleFiles'
import {
  getValidationRows,
  type ValidationRow,
  type ValidationScenario,
} from '@/data/validationRows'

type FieldErrors = Partial<Record<FormField, string>>

const DEFAULT_NAME = 'Example Broker'

const VALID_MAPPING_VALUES: Record<MappingField, string> = {
  ticker: ALIAS_SEEDS.ticker[0],
  order: ALIAS_SEEDS.order[0],
  quantity: ALIAS_SEEDS.quantity[0],
  price: ALIAS_SEEDS.price[0],
}

function defaultMappingValues(): Record<MappingField, string> {
  return { ...VALID_MAPPING_VALUES }
}

const RETEST_DELAY_MS = 1500

function cloneAliases() {
  return {
    ticker: [...ALIAS_SEEDS.ticker],
    order: [...ALIAS_SEEDS.order],
    quantity: [...ALIAS_SEEDS.quantity],
    price: [...ALIAS_SEEDS.price],
  }
}

function clearFormState() {
  return {
    name: DEFAULT_NAME,
    aliases: cloneAliases(),
    values: defaultMappingValues(),
    fieldErrors: {} as FieldErrors,
    files: [] as SampleFile[],
  }
}

export default function App() {
  const [name, setName] = useState(DEFAULT_NAME)
  const [aliases, setAliases] = useState(cloneAliases)
  const [values, setValues] = useState(defaultMappingValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [files, setFiles] = useState<SampleFile[]>([])
  const [sheetOpen, setSheetOpen] = useState(false)
  const [resultsScenario, setResultsScenario] =
    useState<ValidationScenario>('column-fail')
  const [isRetesting, setIsRetesting] = useState(false)
  const retestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (retestTimeoutRef.current) {
        clearTimeout(retestTimeoutRef.current)
      }
    }
  }, [])

  const rows = getValidationRows(resultsScenario)

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

  function handleReset() {
    if (retestTimeoutRef.current) {
      clearTimeout(retestTimeoutRef.current)
      retestTimeoutRef.current = null
    }
    const cleared = clearFormState()
    setName(cleared.name)
    setAliases(cleared.aliases)
    setValues(cleared.values)
    setFieldErrors(cleared.fieldErrors)
    setFiles(cleared.files)
    setSheetOpen(false)
    setResultsScenario('column-fail')
    setIsRetesting(false)
  }

  function handleOpenQuantityMismatch() {
    setSheetOpen(true)
  }

  function handleConfirmQuantityMismatch() {
    const payloadField = EXAMPLE_ORDER_PAYLOAD_FIELDS.quantity

    setValues((current) => ({ ...current, quantity: payloadField }))
    setAliases((current) => {
      if (current.quantity.includes(payloadField)) return current
      return {
        ...current,
        quantity: [...current.quantity, payloadField],
      }
    })
    setFieldErrors((errors) => {
      const next = { ...errors }
      delete next.quantity
      return next
    })
    setSheetOpen(false)
  }

  function handleDeclineQuantityMismatch() {
    setSheetOpen(false)
  }

  function handleRetest() {
    if (isRetesting) return

    setIsRetesting(true)
    retestTimeoutRef.current = setTimeout(() => {
      setResultsScenario('all-pass')
      setIsRetesting(false)
      retestTimeoutRef.current = null
    }, RETEST_DELAY_MS)
  }

  return (
    <AppShell
      drawerOpen={sheetOpen}
      drawer={
        <ErrorDetailSheet
          configuredField={values.quantity}
          payloadField={EXAMPLE_ORDER_PAYLOAD_FIELDS.quantity}
          sampleFileName={EXAMPLE_ORDER_FILE}
          fieldLabel={FIELD_LABELS.quantity}
          onClose={() => setSheetOpen(false)}
          onConfirm={handleConfirmQuantityMismatch}
          onDecline={handleDeclineQuantityMismatch}
        />
      }
      footer={
        <button
          type="button"
          onClick={handleReset}
          className="self-start cursor-pointer text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Reset prototype
        </button>
      }
    >
      <div className="flex w-full flex-col gap-workos">
        <header className="max-w-2xl">
          <h1 className="page-title text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl">
            Broker Configuration
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            Add a new brokerage and test the mapping before it goes live.
          </p>
        </header>

        <ValidateWorkspace
          name={name}
          aliases={aliases}
          values={values}
          files={files}
          rows={rows}
          fieldErrors={fieldErrors}
          onNameChange={handleNameChange}
          onAliasesChange={setAliases}
          onValuesChange={handleValuesChange}
          onFilesChange={setFiles}
          isRetesting={isRetesting}
          onRetest={handleRetest}
          onNullQuantityClick={
            resultsScenario === 'column-fail' ? handleOpenQuantityMismatch : undefined
          }
        />
      </div>
    </AppShell>
  )
}

type ValidateWorkspaceProps = {
  name: string
  aliases: Record<MappingField, string[]>
  values: Record<MappingField, string>
  files: SampleFile[]
  rows: ValidationRow[]
  fieldErrors: FieldErrors
  onNameChange: (value: string) => void
  onAliasesChange: Dispatch<SetStateAction<Record<MappingField, string[]>>>
  onValuesChange: Dispatch<SetStateAction<Record<MappingField, string>>>
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
  isRetesting: boolean
  onRetest: () => void
  onNullQuantityClick?: () => void
}

function ValidateWorkspace({
  name,
  aliases,
  values,
  files,
  rows,
  fieldErrors,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  isRetesting,
  onRetest,
  onNullQuantityClick,
}: ValidateWorkspaceProps) {
  return (
    <div className="layout-b layout-b--results">
      <h2 className="layout-b__config-title text-lg font-bold tracking-tight text-foreground">
        Configuration
      </h2>
      <h2 className="layout-b__results-title text-lg font-bold tracking-tight text-foreground">
        Results of exampleOrder.js
      </h2>
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
          <Button
            type="button"
            disabled={isRetesting}
            className="mapping-assistant__action-btn normal-case tracking-normal"
            onClick={onRetest}
          >
            Rerun test
          </Button>
        </div>
      </div>
      <div className="layout-b__stage">
        <ValidationTable
          rows={rows}
          loading={isRetesting}
          onNullQuantityClick={onNullQuantityClick}
        />
      </div>
    </div>
  )
}
