import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ValidationRow, ValidationStatus } from '@/data/validationRows'
import { cn } from '@/lib/utils'

const STATUS_LABEL: Record<ValidationStatus, string> = {
  pass: 'Pass',
  warning: 'Warning',
  fail: 'Fail',
}

function StatusMarker({ status }: { status: ValidationStatus }) {
  if (status === 'pass') {
    return (
      <span
        className="inline-block size-0 border-x-[5px] border-b-[7px] border-x-transparent border-b-nyse-pass"
        aria-hidden="true"
      />
    )
  }
  if (status === 'warning') {
    return (
      <span
        className="inline-block size-2 rotate-45 bg-nyse-warn"
        aria-hidden="true"
      />
    )
  }
  return (
    <span
      className="inline-block size-0 border-x-[5px] border-t-[7px] border-x-transparent border-t-nyse-fail"
      aria-hidden="true"
    />
  )
}

type ValidationTableProps = {
  rows: ValidationRow[]
  selectedId?: string | null
  onSelectRow: (row: ValidationRow) => void
}

export function ValidationTable({
  rows,
  selectedId,
  onSelectRow,
}: ValidationTableProps) {
  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Sample validation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Results from the latest sample batch. Select a warning or failure to
          see what went wrong.
        </p>
      </div>

      <div className="border-t border-nyse-ink/20">
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
                    <Badge variant={row.status}>
                      <StatusMarker status={row.status} />
                      {STATUS_LABEL[row.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.notes ?? '—'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
