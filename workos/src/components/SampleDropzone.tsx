import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'
import { FileJson, Upload, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { SampleFile } from '@/data/sampleFiles'
import { cn } from '@/lib/utils'

const SIMULATED_FILES: SampleFile[] = [
  { id: 'schwab', name: 'schwab-sample-orders.json' },
  { id: 'fidelity', name: 'fidelity-sample-orders.json' },
]

type SampleDropzoneProps = {
  files: SampleFile[]
  onFilesChange: Dispatch<SetStateAction<SampleFile[]>>
}

export function SampleDropzone({ files, onFilesChange }: SampleDropzoneProps) {
  const [dragging, setDragging] = useState(false)

  function simulateUpload() {
    onFilesChange(SIMULATED_FILES)
  }

  function removeFile(id: string) {
    onFilesChange((current) => current.filter((file) => file.id !== id))
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        className={cn(
          'flex w-full flex-col items-center justify-center gap-2 rounded-none border border-dashed border-nyse-border bg-background px-4 py-8 text-center transition-colors',
          dragging && 'border-ice-blue bg-accent'
        )}
        onClick={simulateUpload}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
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
