import {
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  ListIcon,
  MessageCircleIcon,
  RadioIcon,
  UsersIcon,
  type LucideIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type NavItem = { label: string; icon: LucideIcon; active?: boolean; tag?: string }

const PRIMARY: NavItem[] = [
  { label: 'Organizations', icon: Building2Icon, active: true },
  { label: 'Job Posts', icon: BriefcaseIcon },
  { label: 'People', icon: UsersIcon },
]

const INTELLIGENCE: NavItem[] = [
  { label: 'Signals', icon: RadioIcon },
  { label: 'Events', icon: CalendarIcon, tag: 'Beta' },
  { label: 'Ask Sumble', icon: MessageCircleIcon },
]

const LISTS: NavItem[] = [
  { label: 'Legal tech Q4', icon: ListIcon },
  { label: 'Expansion targets', icon: ListIcon },
]

function NavLink({ item }: { item: NavItem }) {
  const Icon = item.icon
  return (
    <a
      href="#"
      aria-current={item.active ? 'page' : undefined}
      className={cn(
        'flex h-7.5 items-center gap-2 rounded-md px-2 text-body transition-colors [&_svg]:size-4 [&_svg]:shrink-0',
        item.active
          ? 'bg-nav-active font-medium text-slate-900'
          : 'text-slate-700 hover:bg-slate-200/60 hover:text-slate-900'
      )}
    >
      <Icon aria-hidden />
      <span className="truncate">{item.label}</span>
      {item.tag ? (
        <Badge variant="outline" className="ml-auto px-1.5 py-0">
          {item.tag}
        </Badge>
      ) : null}
    </a>
  )
}

function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="px-2 pb-1 text-xs font-medium text-slate-600">{label}</p>
      {items.map((item) => (
        <NavLink key={item.label} item={item} />
      ))}
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="flex w-[190px] shrink-0 flex-col border-r border-border bg-app">
      <a href="#" className="flex h-13 items-center gap-2 px-4" aria-label="Sumble home">
        <span
          aria-hidden
          className="grid size-6 place-items-center rounded-md bg-primary text-[13px] font-bold text-primary-foreground"
        >
          S
        </span>
        <span className="text-base font-semibold tracking-tight text-slate-900">Sumble</span>
      </a>
      <nav aria-label="Primary" className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2 py-1">
        <div className="flex flex-col gap-0.5">
          {PRIMARY.map((item) => (
            <NavLink key={item.label} item={item} />
          ))}
        </div>
        <NavGroup label="Intelligence" items={INTELLIGENCE} />
        <NavGroup label="Your lists" items={LISTS} />
      </nav>
      <div className="flex flex-col items-start gap-2 border-t border-border p-3">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarFallback>TG</AvatarFallback>
          </Avatar>
          <span className="text-body font-medium text-slate-900">Ted Goas</span>
        </div>
        <span className="rounded-full bg-urgent px-2 py-0.5 text-xs font-medium text-white">28d left in Pro trial</span>
      </div>
    </aside>
  )
}
