import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

type ErrorDetailSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Reserved for per-cell failure details; unused while Results uses inline badges. */
export function ErrorDetailSheet({ open, onOpenChange }: ErrorDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold tracking-tight">
            Issue details
          </SheetTitle>
          <SheetDescription>
            Select a failed field to inspect details.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
