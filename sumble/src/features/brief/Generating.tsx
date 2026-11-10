import { CheckIcon, CircleIcon, Loader2Icon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { GENERATION_STEPS, SOURCE_CHIPS } from '@/data/clio'
import { useBrief } from '@/features/brief/BriefContext'
import { TileLabel } from '@/features/brief/TileLabel'
import { cn } from '@/lib/utils'

export function Generating() {
  const { step } = useBrief()

  return (
    <>
      <TileLabel label="Generating brief" right="about 20 seconds" />
      <span aria-live="polite" className="sr-only">
        {GENERATION_STEPS[step].doing}
      </span>
      <ol className="mt-3 flex flex-col gap-1.5 text-body">
        {GENERATION_STEPS.map((item, index) => {
          const done = index < step
          const current = index === step
          return (
            <li
              key={item.doing}
              className={cn(
                'flex h-5 items-center gap-2',
                done && 'text-slate-700',
                current && 'font-semibold text-slate-900',
                !done && !current && 'text-slate-500'
              )}
            >
              {done ? <CheckIcon aria-hidden className="size-3.5 text-green-700 motion-safe:animate-check-in" /> : null}
              {current ? <Loader2Icon aria-hidden className="size-3.5 text-slate-600 motion-safe:animate-spin" /> : null}
              {!done && !current ? <CircleIcon aria-hidden className="size-3.5" /> : null}
              {done ? item.done : item.doing}
            </li>
          )
        })}
      </ol>
      <div className="mt-3 flex h-6 items-center gap-1.5" aria-label="Sources found">
        {SOURCE_CHIPS.filter((chip) => step >= chip.atStep).map((chip) => (
          <Badge key={chip.label} variant="outline" className="motion-safe:animate-fade-in">
            {chip.label}
          </Badge>
        ))}
      </div>
      <p className="mt-auto border-t border-border pt-3 text-xs text-slate-600">
        1 credit used · Keep browsing; we'll let you know when it's ready.
      </p>
    </>
  )
}
