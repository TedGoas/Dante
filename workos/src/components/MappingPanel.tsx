import type { Dispatch, SetStateAction } from 'react'

import { CreatableCombobox } from '@/components/CreatableCombobox'
import { SampleDropzone } from '@/components/SampleDropzone'
import { TextField } from '@/components/TextField'
import {
  FIELD_LABELS,
  type MappingField,
} from '@/data/aliases'
import type { SampleFile } from '@/data/sampleFiles'

export const MAPPING_FIELDS: MappingField[] = [
  'ticker',
  'order',
  'quantity',
  'price',
]

export type FormField = MappingField | 'name'

type MappingPanelProps = {
  name: string
  aliases: Record<MappingField, string[]>
  values: Record<MappingField, string>
  files: SampleFile[]
  onNameChange: (value: string) => void
  onAliasesChange: Dispatch<SetStateAction<Record<MappingField, string[]>>>
  onValuesChange: Dispatch<SetStateAction<Record<MappingField, string>>>
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
  onSimulateValid?: () => void
  onSimulateIncomplete?: () => void
  onClearInputs?: () => void
  /** Where to show the sample dropzone. Default: none. */
  dropzonePlacement?: 'none' | 'above' | 'beside-fields'
  title?: string
  description?: string
  /** When false, render fields only (no Configuration header). */
  showHeader?: boolean
  fieldErrors?: Partial<Record<FormField, string>>
}

export function MappingPanel({
  name,
  aliases,
  values,
  files,
  onNameChange,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  onSimulateValid,
  onSimulateIncomplete,
  onClearInputs,
  dropzonePlacement = 'none',
  title = 'Configuration',
  description = 'Enter a name and map ticker, order, quantity, and price. Type them in, or use a sample on the right to fill the fields.',
  showHeader = true,
  fieldErrors,
}: MappingPanelProps) {
  function createAlias(field: MappingField, next: string) {
    onAliasesChange((current) => {
      if (current[field].includes(next)) return current
      return {
        ...current,
        [field]: [...current[field], next],
      }
    })
  }

  const fields = (
    <div className="flex flex-col gap-4">
      <TextField
        id="mapping-name"
        label="Name"
        value={name}
        error={fieldErrors?.name}
        placeholder="Eg. Charles Schwab, Vanguard, etc."
        onChange={onNameChange}
      />
      {MAPPING_FIELDS.map((field) => (
        <CreatableCombobox
          key={field}
          id={`mapping-${field}`}
          label={FIELD_LABELS[field]}
          value={values[field]}
          options={aliases[field]}
          error={fieldErrors?.[field]}
          onChange={(next) =>
            onValuesChange((current) => ({ ...current, [field]: next }))
          }
          onCreate={(next) => createAlias(field, next)}
        />
      ))}
    </div>
  )

  return (
    <section className="flex flex-col gap-6">
      {showHeader ? (
        <div className="layout-b__intro">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      ) : null}

      {dropzonePlacement === 'above' ? (
        <SampleDropzone files={files} onFilesChange={onFilesChange} />
      ) : null}

      {dropzonePlacement === 'beside-fields' ? (
        <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          {fields}
          <SampleDropzone
            mode="simulate"
            fill
            onSimulateValid={onSimulateValid ?? (() => {})}
            onSimulateIncomplete={onSimulateIncomplete ?? (() => {})}
            onClearInputs={onClearInputs ?? (() => {})}
          />
        </div>
      ) : (
        fields
      )}
    </section>
  )
}
