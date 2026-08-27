import type { Dispatch, SetStateAction } from 'react'

import { CreatableCombobox } from '@/components/CreatableCombobox'
import { SampleDropzone } from '@/components/SampleDropzone'
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

type MappingPanelProps = {
  aliases: Record<MappingField, string[]>
  values: Record<MappingField, string>
  files: SampleFile[]
  onAliasesChange: Dispatch<SetStateAction<Record<MappingField, string[]>>>
  onValuesChange: Dispatch<SetStateAction<Record<MappingField, string>>>
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
  showDropzone?: boolean
  title?: string
  description?: string
  fieldErrors?: Partial<Record<MappingField, string>>
}

export function MappingPanel({
  aliases,
  values,
  files,
  onAliasesChange,
  onValuesChange,
  onFilesChange,
  showDropzone = true,
  title = 'Field mapping',
  description = 'Map the brokerage’s field names to ticker, order, quantity, and price. Add a new alias if you hear one that isn’t in the list yet.',
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

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {showDropzone ? (
        <SampleDropzone files={files} onFilesChange={onFilesChange} />
      ) : null}

      <div className="flex flex-col gap-4">
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
    </section>
  )
}
