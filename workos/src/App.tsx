import { useState } from 'react'

import { AppShell } from '@/components/AppShell'
import { ErrorDetailSheet } from '@/components/ErrorDetailSheet'
import { MappingPanel } from '@/components/MappingPanel'
import { ValidationTable } from '@/components/ValidationTable'
import {
  VALIDATION_ROWS,
  type ValidationRow,
} from '@/data/validationRows'

export default function App() {
  const [selected, setSelected] = useState<ValidationRow | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  function handleSelectRow(row: ValidationRow) {
    if (row.status === 'pass') return
    setSelected(row)
    setSheetOpen(true)
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

        <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
          <MappingPanel />
          <ValidationTable
            rows={VALIDATION_ROWS}
            selectedId={selected?.id}
            onSelectRow={handleSelectRow}
          />
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
