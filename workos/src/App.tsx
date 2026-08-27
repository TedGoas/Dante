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
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Internal tooling
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Broker Configuration
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Capture how a brokerage names ticker, order, quantity, and price,
            then validate sample orders before going live.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
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
