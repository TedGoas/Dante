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
        <h2 className="text-base font-semibold text-foreground">
          Sample validation
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Results from the latest sample batch. Select a warning or failure to
          see what went wrong.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
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
              return (
                <TableRow
                  key={row.id}
                  data-state={selectedId === row.id ? 'selected' : undefined}
                  className={cn(interactive && 'cursor-pointer')}
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
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell>
                    <Badge variant={row.status}>
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
