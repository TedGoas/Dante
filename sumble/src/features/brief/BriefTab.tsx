import { BriefChat } from '@/features/brief/BriefChat'
import { BriefDocument } from '@/features/brief/BriefDocument'
import { useBrief } from '@/features/brief/BriefContext'

export function BriefTab() {
  const { status } = useBrief()

  if (status !== 'ready') {
    return <p className="p-6 text-body text-slate-600">This state is next in the build.</p>
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
