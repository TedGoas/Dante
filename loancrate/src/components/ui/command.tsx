import { CornerDownLeftIcon, SearchIcon, SearchXIcon } from 'lucide-react'
import * as React from 'react'

import { Kbd } from '@/components/ui/kbd'
import { cn } from '@/lib/utils'

/*
 * Command palette (beautifului.dev "Search"). Native <dialog> for focus trap
 * and Esc; combobox + listbox with aria-activedescendant. Arrow keys move,
 * Enter runs. Filtering is instant (no animation on a keyboard path).
 */

export type CommandItem = {
  id: string
  group: string
  label: string
  hint?: string
  icon?: React.ReactNode
  keywords?: string
  onSelect: () => void
}

export function CommandPalette({
  open,
  onClose,
  items,
  placeholder = 'Search loans, documents, conditions…',
}: {
  open: boolean
  onClose: () => void
  items: CommandItem[]
  placeholder?: string
}) {
  const ref = React.useRef<HTMLDialogElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listId = React.useId()
  const [query, setQuery] = React.useState('')
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      setActive(0)
      dialog.showModal()
      inputRef.current?.focus()
    }
    if (!open && dialog.open) dialog.close()
  }, [open])

  const q = query.trim().toLowerCase()
  const results = q ? items.filter((i) => `${i.label} ${i.hint ?? ''} ${i.keywords ?? ''}`.toLowerCase().includes(q)) : items
  const groups = [...new Set(results.map((r) => r.group))]
  const flat = groups.flatMap((g) => results.filter((r) => r.group === g))
  const activeItem = flat[Math.min(active, flat.length - 1)]

  React.useEffect(() => {
    document.getElementById(`${listId}-${activeItem?.id}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeItem?.id, listId])

  function run(item: CommandItem | undefined) {
    if (!item) return
    onClose()
    item.onSelect()
  }

  return (
    <dialog
      ref={ref}
      aria-label="Command search"
      onClose={() => open && onClose()}
      onClick={(e) => {
        if (e.target === ref.current) onClose()
      }}
      className="dialog-motion mx-auto mt-[12vh] w-[600px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-menu backdrop:bg-gray-900/30 open:flex"
    >
      <div className="flex items-center gap-2 border-b border-border px-4">
        <SearchIcon aria-hidden className="size-4 text-gray-400" />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded
          aria-controls={listId}
          aria-activedescendant={activeItem ? `${listId}-${activeItem.id}` : undefined}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(0)
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => (flat.length ? (i + 1) % flat.length : 0))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0))
            } else if (e.key === 'Enter') {
              e.preventDefault()
              run(activeItem)
            }
          }}
          placeholder={placeholder}
          className="h-12 flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        <Kbd>Esc</Kbd>
      </div>
      <div id={listId} role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto p-1.5">
        {flat.length === 0 && (
          <div className="flex flex-col items-center gap-1.5 py-10 text-center text-[13px] text-gray-500">
            <SearchXIcon aria-hidden className="size-5 text-gray-400" />
            No results for “{query}”
          </div>
        )}
        {groups.map((group) => (
          <div key={group} role="group" aria-label={group} className="mb-1">
            <p className="px-2.5 pt-2 pb-1 text-[11px] font-medium text-gray-400">{group}</p>
            {results
              .filter((r) => r.group === group)
              .map((item) => {
                const selected = item === activeItem
                return (
                  <div
                    key={item.id}
                    id={`${listId}-${item.id}`}
                    role="option"
                    aria-selected={selected}
                    onMouseMove={() => setActive(flat.indexOf(item))}
                    onClick={() => run(item)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-gray-400',
                      selected ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    )}
                  >
                    {item.icon}
                    <span className="min-w-0 truncate">
                      <Highlight text={item.label} query={q} />
                    </span>
                    {item.hint && <span className="ml-auto shrink-0 truncate text-xs text-gray-400">{item.hint}</span>}
                    {selected && <CornerDownLeftIcon aria-hidden className={cn(!item.hint && 'ml-auto')} />}
                  </div>
                )
              })}
          </div>
        ))}
      </div>
    </dialog>
  )
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const i = text.toLowerCase().indexOf(query)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-amber-100 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  )
}
