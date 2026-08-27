import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

type CreatableComboboxProps = {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  onCreate: (value: string) => void
  placeholder?: string
  error?: string
}

export function CreatableCombobox({
  id,
  label,
  value,
  options,
  onChange,
  onCreate,
  placeholder = 'Select or type an alias…',
  error,
}: CreatableComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const errorId = `${id}-error`

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((option) => option.toLowerCase().includes(q))
  }, [options, query])

  const exactMatch = options.some(
    (option) => option.toLowerCase() === query.trim().toLowerCase()
  )
  const canCreate = query.trim().length > 0 && !exactMatch

  function selectValue(next: string) {
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  function createValue() {
    const next = query.trim()
    if (!next) return
    onCreate(next)
    onChange(next)
    setOpen(false)
    setQuery('')
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'h-10 w-full justify-between rounded-none font-normal normal-case tracking-normal',
              error && 'border-nyse-fail hover:bg-background'
            )}
          >
            <span className={cn(!value && 'text-muted-foreground')}>
              {value || placeholder}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}…`}
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>
                {canCreate ? 'No match — create a new alias.' : 'No alias found.'}
              </CommandEmpty>
              {canCreate ? (
                <CommandGroup>
                  <CommandItem value={`create-${query}`} onSelect={createValue}>
                    <Plus className="size-4 text-ice-blue" />
                    Create “{query.trim()}”
                  </CommandItem>
                </CommandGroup>
              ) : null}
              <CommandGroup heading="Known aliases">
                {filtered.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => selectValue(option)}
                  >
                    <Check
                      className={cn(
                        'size-4',
                        value === option ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error ? (
        <p id={errorId} className="text-xs text-nyse-fail">
          {error}
        </p>
      ) : null}
    </div>
  )
}
