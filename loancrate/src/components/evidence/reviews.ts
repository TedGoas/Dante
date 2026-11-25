import * as React from 'react'

import type { AiSuggestionState } from '@/components/ai/AiSuggestion'
import type { ExtractedField } from '@/data/documents'

/** Human review state of one extracted field. */
export type FieldReview = {
  state: AiSuggestionState
  value: string
  originalValue?: string
  rejectReason?: string
}

export type FieldReviews = Record<string, FieldReview>

export function initialReview(field: ExtractedField): FieldReview {
  return { state: field.review, value: field.value }
}

/**
 * Review state for any number of extracted fields, keyed by field id.
 * Lift this to the screen level so the viewer, the Data tab, and tables all
 * see the same decisions.
 */
export function useFieldReviews() {
  const [reviews, setReviews] = React.useState<FieldReviews>({})

  const get = React.useCallback((field: ExtractedField) => reviews[field.id] ?? initialReview(field), [reviews])

  const update = React.useCallback((field: ExtractedField, next: Partial<FieldReview>) => {
    setReviews((all) => ({ ...all, [field.id]: { ...(all[field.id] ?? initialReview(field)), ...next } }))
  }, [])

  /** Handlers to spread onto <AiSuggestion>. */
  const handlersFor = React.useCallback(
    (field: ExtractedField) => {
      const review = get(field)
      return {
        ...review,
        onAccept: () => update(field, { state: 'accepted' }),
        onModify: (value: string) => update(field, { state: 'modified', value, originalValue: field.value }),
        onReject: (reason?: string) => update(field, { state: 'rejected', rejectReason: reason }),
        onReset: () => update(field, { state: 'pending', value: field.value, originalValue: undefined, rejectReason: undefined }),
      }
    },
    [get, update]
  )

  return { reviews, get, update, handlersFor }
}
