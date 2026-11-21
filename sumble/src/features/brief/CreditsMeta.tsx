import { CREDITS } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { HowCalculated } from '@/features/brief/HowCalculated'

/** Credit balance and explainer. Shown in every brief state. */
export function CreditsMeta() {
  const { credits } = useBrief()

  return (
    <div className="ml-auto flex shrink-0 flex-col items-end text-xs text-slate-500 tabular-nums">
      {credits < 1 ? (
        <span>
          <span className="font-medium text-slate-900">You're out of credits</span>
          {' · '}
          <a href="#" className="rounded-sm font-medium text-green-700 underline-offset-4 hover:underline">
            Get more credits
          </a>
        </span>
      ) : (
        <span>
          {credits} of {CREDITS.total} credits left this month
        </span>
      )}
      <HowCalculated />
    </div>
  )
}
