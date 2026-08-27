import type { Dispatch, DragEvent, SetStateAction } from 'react'
import { useState } from 'react'
import { FileJson, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { SampleFile } from '@/data/sampleFiles'
import { cn } from '@/lib/utils'

const SIMULATED_FILES: SampleFile[] = [
  { id: 'schwab', name: 'schwab-sample-orders.json' },
  { id: 'fidelity', name: 'fidelity-sample-orders.json' },
]

type SampleDropzoneUploadProps = {
  mode?: 'upload'
  files: SampleFile[]
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
  fill?: boolean
  className?: string
}

type SampleDropzoneSimulateProps = {
  mode: 'simulate'
  fill?: boolean
  className?: string
  onSimulateValid: () => void
  onSimulateIncomplete: () => void
  onClearInputs: () => void
}

type SampleDropzoneProps = SampleDropzoneUploadProps | SampleDropzoneSimulateProps

export function SampleDropzone(props: SampleDropzoneProps) {
  const fill = props.fill ?? false
  const className = props.className

  if (props.mode === 'simulate') {
    return (
      <div
        className={cn(
          'flex flex-col',
          fill && 'h-full min-h-64',
          className
        )}
      >
        <div
          className={cn(
            'flex w-full flex-col rounded-none border border-dashed border-nyse-border bg-[#fafafa] px-4 text-center',
            fill ? 'min-h-64 flex-1 py-6' : 'py-8'
          )}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <Upload
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Drop a sample or transcript
              </span>
              <span className="text-xs text-muted-foreground">
                Simulate parsing a brokerage sample to fill field mappings
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <button
              type="button"
              onClick={props.onSimulateValid}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Simulate valid input
            </button>
            <button
              type="button"
              onClick={props.onSimulateIncomplete}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Simulate incomplete input
            </button>
            <button
              type="button"
              onClick={props.onClearInputs}
              className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Clear inputs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <UploadDropzone
      files={props.files}
      onFilesChange={props.onFilesChange}
      fill={fill}
      className={className}
    />
  )
}

function UploadDropzone({
  files,
  onFilesChange,
  fill,
  className,
}: {
  files: SampleFile[]
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
  fill: boolean
  className?: string
}) {
  const [dragging, setDragging] = useState(false)

  function simulateUpload() {
    onFilesChange(SIMULATED_FILES)
  }

  function removeFile(fileId: string) {
    onFilesChange((current) => current.filter((file) => file.id !== fileId))
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        fill && 'h-full min-h-64',
        className
      )}
    >
      <button
        type="button"
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded-none border border-dashed border-nyse-border bg-background px-4 text-center transition-colors',
          fill ? 'min-h-64 flex-1 py-10' : 'py-8',
          dragging && 'border-ice-blue bg-accent'
        )}
        onClick={simulateUpload}
        onDragEnter={(event: DragEvent) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event: DragEvent) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event: DragEvent) => {
          event.preventDefault()
          setDragging(false)
          simulateUpload()
        }}
      >
        <Upload
          className={cn(
            'size-5 text-muted-foreground',
            dragging && 'text-ice-blue'
          )}
          aria-hidden="true"
        />
        <span className="text-sm font-semibold text-foreground">
          Drop a sample or transcript
        </span>
        <span className="text-xs text-muted-foreground">
          Drag a file here, or click to simulate an upload
        </span>
      </button>

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-2 rounded-none border border-border bg-background px-3 py-2"
            >
              <FileJson className="size-4 text-ice-blue" aria-hidden="true" />
              <a
                href="#sample"
                className="flex-1 truncate text-sm text-ice-blue underline-offset-2 hover:underline"
                onClick={(event) => event.preventDefault()}
              >
                {file.name}
              </a>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => removeFile(file.id)}
                aria-label={`Remove ${file.name}`}
              >
                <X className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
