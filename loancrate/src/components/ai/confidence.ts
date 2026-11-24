/** Single source of truth for confidence thresholds (0–1). */
export const CONFIDENCE = { high: 0.9, medium: 0.7 } as const

export type ConfidenceLevel = 'high' | 'medium' | 'low'

export function confidenceLevel(value: number): ConfidenceLevel {
  if (value >= CONFIDENCE.high) return 'high'
  if (value >= CONFIDENCE.medium) return 'medium'
  return 'low'
}

export const confidenceLabel: Record<ConfidenceLevel, string> = {
  high: 'High confidence',
  medium: 'Medium confidence',
  low: 'Low confidence',
}
