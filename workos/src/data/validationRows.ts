export type ValidationStatus = 'pass' | 'warning' | 'fail'

export type ValidationRow = {
  id: string
  name: string
  status: ValidationStatus
  notes?: string
  detail?: {
    title: string
    summary: string
    field?: string
    suggestion?: string
  }
}

export const VALIDATION_ROWS: ValidationRow[] = [
  {
    id: 'ord-1001',
    name: 'ORD-1001',
    status: 'pass',
  },
  {
    id: 'ord-1002',
    name: 'ORD-1002',
    status: 'pass',
    notes: 'Mapped via symbol alias',
  },
  {
    id: 'ord-1003',
    name: 'ORD-1003',
    status: 'warning',
    notes: 'Unexpected casing on order field',
    detail: {
      title: 'Unexpected casing on order field',
      summary:
        'The sample used “Type” for the order field. Your mapping expects “type”. The order still validated, but casing differences can break some payloads.',
      field: 'Order',
      suggestion:
        'Confirm with the brokerage whether the field is always capitalized, or add “Type” as an additional alias.',
    },
  },
  {
    id: 'ord-1004',
    name: 'ORD-1004',
    status: 'pass',
  },
  {
    id: 'ord-1005',
    name: 'ORD-1005',
    status: 'fail',
    notes: 'Quantity could not be parsed',
    detail: {
      title: 'Quantity could not be parsed',
      summary:
        'Expected a numeric quantity under “count”, but received “N/A”. Without a parseable share count, this order cannot be accepted.',
      field: 'Quantity',
      suggestion:
        'Ask the brokerage for a numeric sample, or update the mapping if they send quantity under a different key.',
    },
  },
  {
    id: 'ord-1006',
    name: 'ORD-1006',
    status: 'pass',
  },
  {
    id: 'ord-1007',
    name: 'ORD-1007',
    status: 'fail',
    notes: 'Missing mapped ticker field',
    detail: {
      title: 'Missing mapped ticker field',
      summary:
        'No value was found for “stock ticker” in this sample payload. All four mapped fields are required before an order can pass.',
      field: 'Ticker',
      suggestion:
        'Verify the brokerage is sending the ticker under the mapped name, or create a new alias that matches their payload.',
    },
  },
  {
    id: 'ord-1008',
    name: 'ORD-1008',
    status: 'warning',
    notes: 'Price precision beyond 4 decimals',
    detail: {
      title: 'Price precision beyond 4 decimals',
      summary:
        'The sample price used 6 decimal places. NYSE typically accepts up to 4 for this order type. Extra precision was truncated for the test run.',
      field: 'Price',
      suggestion:
        'Confirm whether the brokerage will round prices before send, or whether you need to support higher precision.',
    },
  },
  {
    id: 'ord-1009',
    name: 'ORD-1009',
    status: 'pass',
  },
  {
    id: 'ord-1010',
    name: 'ORD-1010',
    status: 'pass',
    notes: 'Buy side normalized',
  },
  {
    id: 'ord-1011',
    name: 'ORD-1011',
    status: 'fail',
    notes: 'Unknown order side value',
    detail: {
      title: 'Unknown order side value',
      summary:
        'Received “X” for the mapped order field. Supported values for this test harness are buy, sell, Buy, and Sell.',
      field: 'Order',
      suggestion:
        'Ask the brokerage what “X” means in their format, then map it to a supported side or reject it upstream.',
    },
  },
  {
    id: 'ord-1012',
    name: 'ORD-1012',
    status: 'pass',
  },
]
