import { StatusCell } from '@/components/StatusIcon'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { ValidationRow } from '@/data/validationRows'

type ErrorDetailSheetProps = {
  row: ValidationRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ErrorDetailSheet({
  row,
  open,
  onOpenChange,
}: ErrorDetailSheetProps) {
  const detail = row?.detail

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <div className="mb-2">
            {row && row.status !== 'pass' ? (
              <StatusCell status={row.status} />
            ) : null}
          </div>
          <SheetTitle className="text-xl font-bold tracking-tight">
            {detail?.title ?? 'Issue details'}
          </SheetTitle>
          <SheetDescription>
            {row ? `Sample ${row.name}` : 'Select a row to inspect.'}
          </SheetDescription>
        </SheetHeader>

        {detail ? (
          <div className="flex flex-col gap-5 text-sm">
            <div>
              <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                What happened
              </h3>
              <p className="leading-relaxed text-foreground">{detail.summary}</p>
            </div>

            {detail.field ? (
              <div>
                <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Related field
                </h3>
                <p className="text-foreground">{detail.field}</p>
              </div>
            ) : null}

            {detail.suggestion ? (
              <div>
                <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                  Suggested next step
                </h3>
                <p className="leading-relaxed text-foreground">
                  {detail.suggestion}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
