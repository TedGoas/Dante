import { CheckIcon, CircleIcon, Loader2Icon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { GENERATION_STEPS, SOURCE_CHIPS } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { cn } from '@/lib/utils'

export function Generating() {
  const { step } = useBrief()

  return (
    <>
      <span aria-live="polite" className="sr-only">
        {GENERATION_STEPS[step].doing}
      </span>
      <ol className="flex flex-col gap-1.5 text-body">
        {GENERATION_STEPS.map((item, index) => {
          const done = index < step
          const current = index === step
          return (
            <li
              key={item.doing}
              className={cn(
                'flex h-5 items-center gap-2',
                done && 'text-slate-600',
                current && 'font-semibold',
                !done && !current && 'text-slate-500'
              )}
            >
              {done ? <CheckIcon aria-hidden className="size-3.5 animate-pop-in text-green-700" /> : null}
              {current ? <Loader2Icon aria-hidden className="size-3.5 animate-spin text-slate-500" /> : null}
              {!done && !current ? <CircleIcon aria-hidden className="size-3.5" /> : null}
              <span key={done ? 'done' : 'doing'} className={cn('animate-fade-up', current && 'shimmer-text')}>
                {done ? item.done : item.doing}
              </span>
            </li>
          )
        })}
      </ol>
      <div className="mt-3 flex h-6 items-center gap-1.5" aria-label="Sources found">
        {SOURCE_CHIPS.filter((chip) => step >= chip.atStep).map((chip) => (
          <Badge key={chip.label} variant="outline" className="animate-fade-up">
            {chip.label}
          </Badge>
        ))}
      </div>
      <p className="mt-auto text-xs text-slate-500">1 credit used · Keep browsing; we'll let you know when it's ready.</p>
    </>
  )
}
