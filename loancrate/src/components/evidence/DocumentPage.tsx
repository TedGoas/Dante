import type * as React from 'react'

import { ROW_H, type Block, type Page } from '@/data/documents'
import { cn } from '@/lib/utils'

/*
 * Renders one fake document page as "paper" in HTML/CSS. Every block is
 * absolutely positioned in % of the page, and type scales with the page width
 * (container query units), so zoom is just a width change and field regions
 * from documents.ts always line up.
 */

const size = {
  xs: 'text-[1.45cqw]',
  sm: 'text-[1.7cqw]',
  md: 'text-[2cqw]',
  lg: 'text-[2.5cqw]',
  xl: 'text-[3.4cqw]',
}

export function DocumentPage({
  page,
  lowQuality,
  className,
  children,
}: {
  page: Page
  lowQuality?: boolean
  className?: string
  /** Overlays (highlights) positioned in the same % space as the blocks. */
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'relative @container aspect-[8.5/11] w-full overflow-hidden bg-paper text-paper-ink shadow-[0_1px_3px_rgba(12,38,77,0.12),0_8px_24px_rgba(12,38,77,0.08)]',
        className
      )}
    >
      <div className={cn('absolute inset-0', lowQuality && 'scan-low')} aria-hidden={false}>
        {page.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
        {page.blocks.length === 0 && <PlaceholderLines />}
      </div>
      {children}
    </div>
  )
}

const pos = (x: number, y: number, w: number, h?: number): React.CSSProperties => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  width: `${w}%`,
  height: h === undefined ? undefined : `${h}%`,
})

function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'text':
      return (
        <p
          style={pos(block.x, block.y, block.w)}
          className={cn(
            'leading-tight whitespace-nowrap',
            size[block.size ?? 'sm'],
            block.bold && 'font-semibold',
            block.muted && 'text-gray-500',
            block.align === 'right' && 'text-right',
            block.hand && 'font-hand text-[3.2cqw] text-blue-950'
          )}
        >
          {block.text}
        </p>
      )
    case 'kv':
      return (
        <p style={pos(block.x, block.y, block.w)} className="flex justify-between gap-[2cqw] text-[1.7cqw] leading-tight">
          <span className="text-gray-500">{block.label}</span>
          <span className="font-medium">{block.value}</span>
        </p>
      )
    case 'table': {
      const row = (cells: string[], header: boolean, index: number) => (
        <div
          key={index}
          role="row"
          style={pos(block.x, block.y + index * ROW_H, block.w, ROW_H)}
          className={cn(
            'flex items-center text-[1.5cqw]',
            header ? 'border-b border-gray-300 font-semibold text-gray-600' : 'border-b border-gray-100',
            !header && cells[0] && /gross|net/i.test(cells[0]) && 'font-semibold'
          )}
        >
          {block.columns.map((col, c) => (
            <span
              key={c}
              role={header ? 'columnheader' : 'cell'}
              style={{ width: `${col.w}%` }}
              className={cn('truncate px-[0.6cqw] tabular-nums', col.align === 'right' && 'text-right')}
            >
              {cells[c]}
            </span>
          ))}
        </div>
      )
      return (
        <div role="table">
          {row(
            block.columns.map((c) => c.label),
            true,
            0
          )}
          {block.rows.map((cells, i) => row(cells, false, i + 1))}
        </div>
      )
    }
    case 'rule':
      return <div style={pos(block.x, block.y, block.w)} className="h-px bg-gray-300" />
    case 'paragraph':
      return (
        <p
          style={pos(block.x, block.y, block.w)}
          className={cn('text-[1.7cqw] leading-[1.7]', block.hand && 'font-hand text-[2.9cqw] leading-[1.45] text-blue-950')}
        >
          {block.text}
        </p>
      )
    case 'signature':
      return (
        <div style={pos(block.x, block.y, block.w)} className="text-[1.45cqw]">
          <div className="flex h-[4cqw] items-end border-b border-gray-500 px-[1cqw]">
            {block.signed && <span className="font-hand text-[3.2cqw] leading-none text-blue-950">{block.signed}</span>}
          </div>
          <p className="mt-[0.6cqw] text-gray-500">{block.label}</p>
        </div>
      )
    case 'logo':
      return (
        <div
          style={pos(block.x, block.y, block.w, block.h)}
          className="grid place-items-center rounded-[0.8cqw] bg-gray-800 text-[2.6cqw] font-bold text-white"
        >
          {block.text}
        </div>
      )
  }
}

/** Grey text lines for pages with no seeded content. */
function PlaceholderLines() {
  return (
    <div className="absolute inset-[8%] flex flex-col gap-[2.2cqw]">
      <div className="h-[2.4cqw] w-1/2 rounded-sm bg-gray-200" />
      {Array.from({ length: 16 }, (_, i) => (
        <div key={i} className="h-[1.2cqw] rounded-sm bg-gray-100" style={{ width: `${70 + ((i * 37) % 30)}%` }} />
      ))}
    </div>
  )
}
