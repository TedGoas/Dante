/** Sumble lead score pill. Tinted, so the primary action stays the only solid green. */
function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex h-5 min-w-9 items-center justify-center rounded-full bg-green-100 px-1.5 text-xs font-semibold text-green-900 tabular-nums">
      <span className="sr-only">Lead score </span>
      {score.toFixed(1)}
    </span>
  )
}

export { ScoreBadge }
