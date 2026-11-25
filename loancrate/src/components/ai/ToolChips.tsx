import { ArrowRightLeftIcon, FilePlus2Icon, LinkIcon, PencilLineIcon, SendIcon, TagIcon } from 'lucide-react'
import type * as React from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import type { Automation, AutomationKind } from '@/data/automations'
import { cn } from '@/lib/utils'

/*
 * Compact chips for what the AI did automatically (beautifului.dev "Tool
 * chips"). Chips with details open a popover. Overflow collapses to "+N".
 */

const icon: Record<AutomationKind, React.ElementType> = {
  classify: TagIcon,
  rename: PencilLineIcon,
  replace: ArrowRightLeftIcon,
  create: FilePlus2Icon,
  link: LinkIcon,
  request: SendIcon,
}

const chipClass =
  'inline-flex h-6 shrink-0 items-center gap-1 rounded-md border border-ai-border bg-ai-soft/70 px-1.5 text-xs font-medium text-ai [&_svg]:size-3'

export function ToolChips({
  items,
  max = 3,
  label = 'Done automatically by AI',
  className,
}: {
  items: Automation[]
  max?: number
  label?: string
  className?: string
}) {
  const visible = items.slice(0, max)
  const rest = items.slice(max)
  return (
    <ul aria-label={label} data-slot="tool-chips" className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {visible.map((item) => (
        <li key={item.id}>
          <Chip item={item} />
        </li>
      ))}
      {rest.length > 0 && (
        <li>
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className={cn(chipClass, 'cursor-pointer hover:bg-ai-soft')}>
                +{rest.length} more
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-2" align="start">
              <ul className="flex flex-col gap-1">
                {rest.map((item) => (
                  <li key={item.id}>
                    <Detail item={item} />
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        </li>
      )}
    </ul>
  )
}

function Chip({ item }: { item: Automation }) {
  const Icon = icon[item.kind]
  const content = (
    <>
      <Icon aria-hidden />
      {item.label}
      {item.count !== undefined && <span className="rounded bg-white/80 px-1 tabular-nums">{item.count}</span>}
    </>
  )
  if (!item.details?.length) return <span className={chipClass}>{content}</span>
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className={cn(chipClass, 'cursor-pointer hover:bg-ai-soft')}>
          {content}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="start">
        <Detail item={item} />
      </PopoverContent>
    </Popover>
  )
}

function Detail({ item }: { item: Automation }) {
  const Icon = icon[item.kind]
  return (
    <div className="rounded-md px-2 py-1.5 text-[13px]">
      <p className="flex items-center gap-1.5 font-medium text-gray-900">
        <Icon aria-hidden className="size-3.5 text-ai" />
        {item.label}
        {item.count !== undefined && <span className="text-gray-400 tabular-nums">· {item.count}</span>}
      </p>
      {item.details && (
        <ul className="mt-1 flex flex-col gap-0.5 pl-5 text-xs text-gray-600">
          {item.details.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
