import { FieldStatusCell } from '@/components/StatusIcon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ValidationRow, ValidationScenario } from '@/data/validationRows'

export type ValidationEmptyReason = 'awaiting-continue' | 'awaiting-sample'

type ValidationTableProps = {
  rows: ValidationRow[]
  empty?: boolean
  emptyReason?: ValidationEmptyReason
  scenario?: ValidationScenario
  onScenarioChange?: (scenario: ValidationScenario) => void
}

export function ValidationTable({
  rows,
  empty = false,
  emptyReason = 'awaiting-sample',
  scenario,
  onScenarioChange,
}: ValidationTableProps) {
  const emptyCopy =
    emptyReason === 'awaiting-continue'
      ? {
          title: 'Validation unlocks next',
          body: 'Fill in all four field mappings, then continue to review mapped results.',
        }
      : {
          title: 'No samples validated yet',
          body: 'Continue from mapping to see sample results in this table.',
        }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            Results
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {empty ? 'Results appear after you continue.' : 'e.g. orders.js'}
          </p>
        </div>
        {onScenarioChange && scenario ? (
          <label className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-[0.08em]">
              Simulation
            </span>
            <select
              value={scenario}
              onChange={(event) =>
                onScenarioChange(event.target.value as ValidationScenario)
              }
              className="h-9 border border-border bg-background px-2 text-sm text-foreground"
            >
              <option value="all-pass">All columns pass</option>
              <option value="column-fail">Quantity column fails</option>
            </select>
          </label>
        ) : null}
      </div>

      <div className="border-t border-nyse-ink/20">
        {empty ? (
          <div className="flex min-h-64 flex-col items-start justify-center gap-2 py-12">
            <p className="text-sm font-semibold text-foreground">
              {emptyCopy.title}
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {emptyCopy.body}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Ticker</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id} className="hover:bg-transparent">
                  <TableCell>
                    <FieldStatusCell cell={row.ticker} />
                  </TableCell>
                  <TableCell>
                    <FieldStatusCell cell={row.order} />
                  </TableCell>
                  <TableCell>
                    <FieldStatusCell cell={row.quantity} />
                  </TableCell>
                  <TableCell>
                    <FieldStatusCell cell={row.price} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  )
}
