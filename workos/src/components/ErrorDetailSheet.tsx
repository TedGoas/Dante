import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'

type ErrorDetailSheetProps = {
  configuredField: string
  payloadField: string
  sampleFileName: string
  fieldLabel: string
  onClose: () => void
  onConfirm: () => void
  onDecline: () => void
}

export function ErrorDetailSheet({
  configuredField,
  payloadField,
  sampleFileName,
  fieldLabel,
  onClose,
  onConfirm,
  onDecline,
}: ErrorDetailSheetProps) {
  return (
    <div className="mapping-assistant">
      <header className="mapping-assistant__header">
        <div className="mapping-assistant__header-copy">
          <p className="mapping-assistant__eyebrow">Assistant</p>
          <h2 className="mapping-assistant__title">Mapping help</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mapping-assistant__close"
        >
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </button>
      </header>

      <div className="mapping-assistant__thread">
        <article className="mapping-assistant__bubble" aria-label="Assistant message">
          <p>
            The payload in {sampleFileName} uses{' '}
            <span className="font-semibold">{payloadField}</span>, but {fieldLabel}{' '}
            is mapped to <span className="font-semibold">{configuredField}</span>.
            That is why validation returned null.
          </p>
          <p>
            Update the {fieldLabel.toLowerCase()} field to match the payload in{' '}
            {sampleFileName}?
          </p>
        </article>

        <div className="mapping-assistant__actions">
          <Button
            type="button"
            className="mapping-assistant__action-btn flex-1 normal-case tracking-normal"
            onClick={onConfirm}
          >
            Yes, update
          </Button>
          <Button
            type="button"
            variant="outline"
            className="mapping-assistant__action-btn flex-1 normal-case tracking-normal"
            onClick={onDecline}
          >
            No, leave as is
          </Button>
        </div>
      </div>

      <div className="mapping-assistant__composer" aria-hidden="true">
        <input
          type="text"
          disabled
          tabIndex={-1}
          placeholder="Message…"
          className="mapping-assistant__composer-input"
        />
      </div>
    </div>
  )
}
