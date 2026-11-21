import { createColumnHelper } from '@tanstack/react-table'
import {
  ExternalLinkIcon,
  ListPlusIcon,
  MoreHorizontalIcon,
  StarIcon,
  Trash2Icon,
  TrendingDownIcon,
  TrendingUpIcon,
  UserPlusIcon,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconButton } from '@/components/ui/icon-button'
import { Tooltip } from '@/components/ui/tooltip'
import { SortableHeader } from '@/components/data-table/SortableHeader'
import type { DataTableFeatures } from '@/components/data-table/features'
import { industryBadge, type Account } from '@/data/accounts'
import { cn } from '@/lib/utils'

const helper = createColumnHelper<DataTableFeatures, Account>()

const numberFormat = new Intl.NumberFormat('en-US')
const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export const accountColumns = helper.columns([
  helper.display({
    id: 'select',
    meta: { width: 'w-10' },
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all rows on this page"
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
              ? 'indeterminate'
              : false
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onClick={row.getToggleSelectedHandler()}
      />
    ),
  }),
  helper.accessor('name', {
    header: ({ header }) => <SortableHeader header={header}>Company</SortableHeader>,
    sortFn: 'alphanumeric',
    cell: ({ row }) => {
      const { name, domain, logoColor, starred } = row.original
      return (
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={cn(
              'grid size-8 shrink-0 place-items-center rounded-md text-xs font-semibold text-white',
              logoColor
            )}
          >
            {name
              .split(/\s+/)
              .slice(0, 2)
              .map((word) => word[0])
              .join('')}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1 font-semibold text-slate-900">
              {name}
              {starred && (
                <StarIcon
                  aria-label="Starred"
                  className="size-3.5 fill-amber-400 text-amber-400"
                />
              )}
            </div>
            <div className="text-xs text-slate-500">{domain}</div>
          </div>
        </div>
      )
    },
  }),
  helper.accessor('industry', {
    header: ({ header }) => <SortableHeader header={header}>Industry</SortableHeader>,
    filterFn: 'inSet',
    cell: ({ getValue }) => <Badge variant={industryBadge[getValue()]}>{getValue()}</Badge>,
  }),
  helper.accessor('techStack', {
    header: 'Tech stack',
    enableSorting: false,
    filterFn: 'arrIncludesSome',
    getUniqueValues: (row) => row.techStack,
    cell: ({ getValue }) => {
      const stack = getValue()
      const shown = stack.slice(0, 2)
      const hidden = stack.slice(2)
      return (
        <div className="flex items-center gap-1">
          {shown.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
          {hidden.length > 0 && (
            <Tooltip content={hidden.join(', ')}>
              <button
                type="button"
                className="cursor-default rounded-full px-1.5 py-0.5 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                +{hidden.length}
              </button>
            </Tooltip>
          )}
        </div>
      )
    },
  }),
  helper.accessor('headcount', {
    meta: { align: 'right' },
    header: ({ header }) => (
      <SortableHeader header={header} align="right">
        Employees
      </SortableHeader>
    ),
    sortFn: 'basic',
    sortDescFirst: true,
    cell: ({ getValue }) => (
      <span className="tabular-nums text-slate-700">{numberFormat.format(getValue())}</span>
    ),
  }),
  helper.accessor('signalScore', {
    header: ({ header }) => <SortableHeader header={header}>Signal</SortableHeader>,
    sortFn: 'basic',
    sortDescFirst: true,
    cell: ({ getValue }) => {
      const score = getValue()
      const tone =
        score >= 70 ? 'bg-green-600' : score >= 40 ? 'bg-amber-500' : 'bg-slate-300'
      return (
        <div className="flex items-center gap-2">
          <div
            role="meter"
            aria-label="Signal score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score}
            className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100"
          >
            <div className={cn('h-full rounded-full', tone)} style={{ width: `${score}%` }} />
          </div>
          <span className="w-6 text-xs font-medium tabular-nums text-slate-700">{score}</span>
        </div>
      )
    },
  }),
  helper.accessor('hiringTrend', {
    header: ({ header }) => <SortableHeader header={header}>Hiring</SortableHeader>,
    sortFn: 'basic',
    sortDescFirst: true,
    cell: ({ getValue }) => {
      const trend = getValue()
      const up = trend >= 0
      const Icon = up ? TrendingUpIcon : TrendingDownIcon
      return (
        <Badge variant={up ? 'green' : 'rose'}>
          <Icon aria-hidden />
          <span className="tabular-nums">
            {up ? '+' : '−'}
            {Math.abs(trend)}%
          </span>
        </Badge>
      )
    },
  }),
  helper.accessor('owners', {
    header: 'Owners',
    enableSorting: false,
    enableGlobalFilter: false,
    cell: ({ getValue }) => (
      <div className="flex -space-x-1">
        {getValue().map((owner) => (
          <Tooltip key={owner.initials} content={owner.name}>
            <Avatar tabIndex={0} className="size-7 ring-2 ring-white">
              <AvatarFallback className="text-[10px]">{owner.initials}</AvatarFallback>
            </Avatar>
          </Tooltip>
        ))}
      </div>
    ),
  }),
  helper.accessor('lastActivity', {
    header: ({ header }) => <SortableHeader header={header}>Last activity</SortableHeader>,
    sortFn: 'datetime',
    sortDescFirst: true,
    enableGlobalFilter: false,
    cell: ({ getValue }) => (
      <span className="text-slate-500">{dateFormat.format(new Date(getValue()))}</span>
    ),
  }),
  helper.display({
    id: 'actions',
    meta: { align: 'right', width: 'w-24' },
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <div className="flex items-center justify-end gap-0.5">
        <IconButton label="Add to list">
          <ListPlusIcon />
        </IconButton>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <IconButton label={`More actions for ${row.original.name}`}>
              <MoreHorizontalIcon />
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <ExternalLinkIcon />
              Open account
            </DropdownMenuItem>
            <DropdownMenuItem>
              <UserPlusIcon />
              Assign owner
            </DropdownMenuItem>
            <DropdownMenuItem>
              <StarIcon />
              {row.original.starred ? 'Unstar' : 'Star'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <Trash2Icon />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }),
])
