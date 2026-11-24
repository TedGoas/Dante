import { PanelRightOpenIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/dialog'
import { useMediaQuery } from '@/lib/use-media-query'

/*
 * Loan file layout with slots. No content of its own, so it can host any
 * exercise screen:
 *
 *   ≥1280px  documents | viewer | panel
 *   ≥1024px  documents | viewer      (panel opens in a right Sheet)
 *   <1024px  compact document picker above the viewer, panel in a Sheet
 */
export function LoanDetailShell({
  header,
  documents,
  documentsCompact,
  viewer,
  panel,
  panelLabel = 'Conditions, data, and activity',
}: {
  header: React.ReactNode
  documents: React.ReactNode
  /** Small-screen replacement for `documents`, e.g. a <Select>. */
  documentsCompact?: React.ReactNode
  viewer: React.ReactNode
  panel: React.ReactNode
  panelLabel?: string
}) {
  const wide = useMediaQuery('(min-width: 1280px)')
  const medium = useMediaQuery('(min-width: 1024px)')
  const [sheetOpen, setSheetOpen] = React.useState(false)

  React.useEffect(() => {
    if (wide) setSheetOpen(false)
  }, [wide])

  return (
    <div data-slot="loan-detail-shell" className="flex h-[calc(100dvh-49px)] min-h-[560px] flex-col bg-gray-50">
      <div className="shrink-0 border-b border-border bg-white">{header}</div>
      <div className="flex min-h-0 flex-1">
        {medium && (
          <nav aria-label="Loan documents" className="flex w-[248px] shrink-0 flex-col border-r border-border bg-white">
            {documents}
          </nav>
        )}
        <main className="flex min-w-0 flex-1 flex-col gap-3 p-3">
          {(!medium || !wide) && (
            <div className="flex items-center gap-2">
              {!medium && <div className="min-w-0 flex-1">{documentsCompact}</div>}
              <Button variant="secondary" size="sm" className="ml-auto" onClick={() => setSheetOpen(true)}>
                <PanelRightOpenIcon />
                Conditions & data
              </Button>
            </div>
          )}
          <div className="flex min-h-0 flex-1 flex-col">{viewer}</div>
        </main>
        {wide && (
          <aside aria-label={panelLabel} className="flex w-[372px] shrink-0 flex-col border-l border-border bg-white">
            {panel}
          </aside>
        )}
      </div>
      {!wide && (
        <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={panelLabel} className="[&>div:nth-child(2)]:p-0">
          <div className="flex h-full flex-col">{panel}</div>
        </Sheet>
      )}
    </div>
  )
}
