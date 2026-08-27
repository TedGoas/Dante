import { StatusCell, StatusLegend } from '@/components/StatusIcon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ValidationRow } from '@/data/validationRows'
import { cn } from '@/lib/utils'

export type ValidationEmptyReason = 'awaiting-continue' | 'awaiting-sample'

type ValidationTableProps = {
  rows: ValidationRow[]
  empty?: boolean
  emptyReason?: ValidationEmptyReason
  selectedId?: string | null
  onSelectRow: (row: ValidationRow) => void
  showLegend?: boolean
}

export function ValidationTable({
  rows,
  empty = false,
  emptyReason = 'awaiting-sample',
  selectedId,
  onSelectRow,
  showLegend = true,
}: ValidationTableProps) {
  const emptyCopy =
    emptyReason === 'awaiting-continue'
      ? {
          title: 'Validation unlocks next',
          body: 'Fill in all four field mappings, then continue to attach a sample and review results.',
        }
      : {
          title: 'No samples validated yet',
          body: 'Drop a sample or transcript to run the batch and populate this table.',
        }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Sample validation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {empty
            ? emptyReason === 'awaiting-sample'
              ? 'Attach a sample payload to see pass, warning, and fail results.'
              : 'Results appear after you continue and attach a sample.'
            : 'Results from the latest sample batch. Select a warning or failure to see what went wrong.'}
        </p>
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
          <>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const interactive = row.status !== 'pass'
                  const selected = selectedId === row.id
                  return (
                    <TableRow
                      key={row.id}
                      data-state={selected ? 'selected' : undefined}
                      className={cn(
                        interactive && 'cursor-pointer',
                        selected &&
                          'bg-accent shadow-[inset_2px_0_0_0_var(--color-ice-blue)]'
                      )}
                      tabIndex={interactive ? 0 : undefined}
                      onClick={() => {
                        if (interactive) onSelectRow(row)
                      }}
                      onKeyDown={(event) => {
                        if (
                          interactive &&
                          (event.key === 'Enter' || event.key === ' ')
                        ) {
                          event.preventDefault()
                          onSelectRow(row)
                        }
                      }}
                    >
                      <TableCell className="font-semibold">{row.name}</TableCell>
                      <TableCell>
                        <StatusCell status={row.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.notes ?? '—'}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            {showLegend ? <StatusLegend /> : null}
          </>
        )}
      </div>
    </section>
  )
}
