import type { Dispatch, SetStateAction } from 'react'

import { CreatableCombobox } from '@/components/CreatableCombobox'
import { MAPPING_FIELDS } from '@/components/MappingPanel'
import { TextField } from '@/components/TextField'
import { FIELD_LABELS, type MappingField } from '@/data/aliases'

type MappingChipsProps = {
  name: string
  aliases: Record<MappingField, string[]>
  values: Record<MappingField, string>
  onNameChange: (value: string) => void
  onAliasesChange: Dispatch<SetStateAction<Record<MappingField, string[]>>>
  onValuesChange: Dispatch<SetStateAction<Record<MappingField, string>>>
}

export function MappingChips({
  name,
  aliases,
  values,
  onNameChange,
  onAliasesChange,
  onValuesChange,
}: MappingChipsProps) {
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
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-bold tracking-tight text-foreground">
          Current mapping
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Edit a field if a sample fails — you stay on this screen.
        </p>
      </div>
      <div className="max-w-sm">
        <TextField
          id="chip-name"
          label="Name"
          value={name}
          placeholder="Eg. Charles Schwab, Vanguard, etc."
          onChange={onNameChange}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {MAPPING_FIELDS.map((field) => (
          <CreatableCombobox
            key={field}
            id={`chip-${field}`}
            label={FIELD_LABELS[field]}
            value={values[field]}
            options={aliases[field]}
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
