import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { HOW_CALCULATED } from '@/data/clio'

export function HowCalculated() {
  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer rounded-sm text-xs text-slate-600 underline underline-offset-2 hover:text-slate-900">
        How is this calculated?
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3 text-body leading-relaxed text-slate-700">{HOW_CALCULATED}</PopoverContent>
    </Popover>
  )
}
