import { useState } from 'react'

import { CreatableCombobox } from '@/components/CreatableCombobox'
import { SampleDropzone } from '@/components/SampleDropzone'
import {
  ALIAS_SEEDS,
  FIELD_LABELS,
  type MappingField,
} from '@/data/aliases'

const FIELDS: MappingField[] = ['ticker', 'order', 'quantity', 'price']

export function MappingPanel() {
  const [aliases, setAliases] = useState(ALIAS_SEEDS)
  const [values, setValues] = useState<Record<MappingField, string>>({
    ticker: 'stock ticker',
    order: 'type',
    quantity: 'count',
    price: 'price',
  })

  function createAlias(field: MappingField, next: string) {
    setAliases((current) => {
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
          Field mapping
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Map the brokerage’s field names to ticker, order, quantity, and price.
          Add a new alias if you hear one that isn’t in the list yet.
        </p>
      </div>

      <SampleDropzone />

      <div className="flex flex-col gap-4">
        {FIELDS.map((field) => (
          <CreatableCombobox
            key={field}
            id={`mapping-${field}`}
            label={FIELD_LABELS[field]}
            value={values[field]}
            options={aliases[field]}
            onChange={(next) =>
              setValues((current) => ({ ...current, [field]: next }))
            }
            onCreate={(next) => createAlias(field, next)}
          />
        ))}
      </div>
    </section>
  )
}
