/** Sumble lead score pill. */
function ScoreBadge({ score }: { score: number }) {
  return (
    <span className="inline-flex h-5 min-w-7 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground tabular-nums">
      <span className="sr-only">Lead score </span>
      {score}
    </span>
  )
}

export { ScoreBadge }
