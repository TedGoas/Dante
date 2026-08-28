import { FieldStatusCell } from '@/components/StatusIcon'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ValidationRow } from '@/data/validationRows'

export type ValidationEmptyReason = 'awaiting-continue' | 'awaiting-sample'

type ValidationTableProps = {
  rows: ValidationRow[]
  empty?: boolean
  emptyReason?: ValidationEmptyReason
}

export function ValidationTable({
  rows,
  empty = false,
  emptyReason = 'awaiting-sample',
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
    <section className="min-h-0 flex-1">
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
