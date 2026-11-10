import { SparklesIcon } from 'lucide-react'
import * as React from 'react'

/** Shared top row of the brief tile. */
export function TileLabel({
  label,
  detail,
  right,
}: {
  label: string
  detail?: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex h-5 shrink-0 items-center gap-1.5 text-xs text-slate-600">
      <SparklesIcon aria-hidden className="size-3.5 text-green-700" />
      <span className="font-semibold tracking-wide uppercase">{label}</span>
      {detail ? <span>· {detail}</span> : null}
      {right ? <span className="ml-auto">{right}</span> : null}
    </div>
  )
}
