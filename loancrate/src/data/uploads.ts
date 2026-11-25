/* Upload/processing queue seed for TaskRows (beautifului.dev "Task rows"). */

export type TaskStatus = 'queued' | 'running' | 'done' | 'failed'
export type Task = { id: string; name: string; detail?: string; status: TaskStatus; progress?: number }

export const uploadQueue: Record<string, Task[]> = {
  'loan-0': [
    { id: 'u1', name: 'Paystub_Nov10.pdf', detail: 'From borrower portal', status: 'running', progress: 35 },
    { id: 'u2', name: 'LOX_inquiry_signed.pdf', detail: 'From borrower portal', status: 'queued' },
    { id: 'u3', name: 'Statement_Nov.pdf', detail: 'From borrower portal', status: 'queued' },
    { id: 'u4', name: 'scan0008.pdf', detail: 'Password-protected PDF. Ask the borrower for an unlocked copy.', status: 'failed' },
  ],
}
