import { BriefChat } from '@/features/brief/BriefChat'
import { BriefDocument } from '@/features/brief/BriefDocument'
import { useBrief } from '@/features/brief/BriefContext'
import { BriefTile } from '@/features/brief/BriefTile'

export function BriefTab() {
  const { status } = useBrief()

  if (status !== 'ready') {
    return (
      <div className="mx-auto w-full max-w-[640px] p-8">
        <BriefTile size="page" />
      </div>
    )
  }

  return (
    <div className="grid h-full grid-cols-[2fr_3fr]">
      <div className="min-h-0 border-r border-border">
        <BriefChat />
      </div>
      <div className="min-h-0">
        <BriefDocument />
      </div>
    </div>
  )
}
