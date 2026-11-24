import { createColumnHelper } from '@tanstack/react-table'
import { CopyIcon, ExternalLinkIcon, MoreHorizontalIcon, SparklesIcon, UserRoundIcon, XCircleIcon } from 'lucide-react'

import { SortableHeader } from '@/components/data-table/SortableHeader'
import type { DataTableFeatures } from '@/components/data-table/features'
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
import { stageBadge, type Loan } from '@/data/loans'

const helper = createColumnHelper<DataTableFeatures, Loan>()

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })

export const loanColumns = helper.columns([
  helper.display({
    id: 'select',
    meta: { width: 'w-10' },
    header: ({ table }) => (
      <Checkbox
        aria-label="Select all loans on this page"
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
        aria-label={`Select loan ${row.original.number}`}
        checked={row.getIsSelected()}
        onClick={row.getToggleSelectedHandler()}
      />
    ),
  }),
  helper.accessor('number', {
    header: ({ header }) => <SortableHeader header={header}>Loan</SortableHeader>,
    sortFn: 'alphanumeric',
    cell: ({ row, getValue }) => (
      <a
        href={`#/loan/${row.original.id}`}
        className="rounded font-medium text-gray-900 tabular-nums underline-offset-2 hover:text-link hover:underline"
      >
        #{getValue()}
      </a>
    ),
  }),
  helper.accessor('borrower', {
    header: ({ header }) => <SortableHeader header={header}>Borrower</SortableHeader>,
    sortFn: 'text',
    cell: ({ row }) => (
      <div className="flex flex-col leading-tight">
        <span className="font-medium text-gray-900">{row.original.borrower}</span>
        {row.original.coBorrower && (
          <span className="text-xs text-gray-500">+ {row.original.coBorrower}</span>
        )}
      </div>
    ),
  }),
  helper.accessor('program', {
    header: ({ header }) => <SortableHeader header={header}>Program</SortableHeader>,
    filterFn: 'inSet',
    cell: ({ row }) => (
      <span>
        {row.original.program}
        <span className="text-gray-400"> · {row.original.purpose}</span>
      </span>
    ),
  }),
  helper.accessor('amount', {
    meta: { align: 'right' },
    header: ({ header }) => (
      <SortableHeader header={header} align="right">
        Amount
      </SortableHeader>
    ),
    sortFn: 'basic',
    cell: ({ getValue }) => <span className="text-gray-900 tabular-nums">{money.format(getValue())}</span>,
  }),
  helper.accessor('stage', {
    header: ({ header }) => <SortableHeader header={header}>Stage</SortableHeader>,
    filterFn: 'inSet',
    cell: ({ getValue }) => (
      <Badge variant={stageBadge[getValue()]} dot>
        {getValue()}
      </Badge>
    ),
  }),
  helper.accessor('openConditions', {
    meta: { align: 'right' },
    header: ({ header }) => (
      <SortableHeader header={header} align="right">
        Conditions
      </SortableHeader>
    ),
    sortFn: 'basic',
    cell: ({ row }) => {
      const { openConditions, aiFlags } = row.original
      return (
        <span className="inline-flex items-center justify-end gap-2 tabular-nums">
          {aiFlags > 0 && (
            <Tooltip content={`${aiFlags} AI review flag${aiFlags > 1 ? 's' : ''}`}>
              <span tabIndex={0} className="inline-flex items-center gap-0.5 text-xs font-medium text-indigo-600">
                <SparklesIcon aria-hidden className="size-3" />
                {aiFlags}
              </span>
            </Tooltip>
          )}
          <span className={openConditions ? 'text-gray-900' : 'text-gray-400'}>{openConditions}</span>
        </span>
      )
    },
  }),
  helper.accessor('processor', {
    header: ({ header }) => <SortableHeader header={header}>Processor</SortableHeader>,
    sortFn: 'text',
  }),
  helper.accessor('updated', {
    meta: { align: 'right' },
    header: ({ header }) => (
      <SortableHeader header={header} align="right">
        Updated
      </SortableHeader>
    ),
    sortFn: 'datetime',
    cell: ({ getValue }) => <span className="tabular-nums">{dateFormat.format(getValue())}</span>,
  }),
  helper.display({
    id: 'actions',
    meta: { width: 'w-12' },
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton label={`Actions for loan ${row.original.number}`}>
            <MoreHorizontalIcon />
          </IconButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <ExternalLinkIcon />
            Open loan file
          </DropdownMenuItem>
          <DropdownMenuItem>
            <UserRoundIcon />
            Reassign processor
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CopyIcon />
            Copy loan number
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <XCircleIcon />
            Withdraw application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }),
])
