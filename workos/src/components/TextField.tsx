import { cn } from '@/lib/utils'

type TextFieldProps = {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  autoComplete?: string
}

export function TextField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  autoComplete = 'off',
}: TextFieldProps) {
  const errorId = `${id}-error`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          'h-10 w-full rounded-none border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring',
          error && 'border-nyse-fail'
        )}
      />
      {error ? (
        <p id={errorId} className="text-xs text-nyse-fail">
          {error}
        </p>
      ) : null}
    </div>
  )
}
