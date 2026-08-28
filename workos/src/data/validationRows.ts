export type CellStatus = 'ok' | 'fail'

export type FieldCell = {
  value: string
  status: CellStatus
}

export type ValidationRow = {
  id: string
  ticker: FieldCell
  order: FieldCell
  quantity: FieldCell
  price: FieldCell
}

export type ValidationScenario = 'all-pass' | 'column-fail'

export type MappingFieldKey = 'ticker' | 'order' | 'quantity' | 'price'

type BaseRow = {
  id: string
  ticker: string
  order: string
  quantity: string
  price: string
}

/** Column that fails in the column-fail scenario (entire column red). */
export const FAILED_COLUMN: MappingFieldKey = 'quantity'

function cell(value: string, status: CellStatus = 'ok'): FieldCell {
  return { value, status }
}

const BASE_ROWS: BaseRow[] = [
  { id: 'ord-01', ticker: 'SNAP', order: 'BUY', quantity: '100', price: '32.01' },
  { id: 'ord-02', ticker: 'AAPL', order: 'SELL', quantity: '50', price: '178.45' },
  { id: 'ord-03', ticker: 'MSFT', order: 'BUY', quantity: '25', price: '412.30' },
  { id: 'ord-04', ticker: 'TSLA', order: 'BUY', quantity: '10', price: '245.18' },
  { id: 'ord-05', ticker: 'AMZN', order: 'SELL', quantity: '75', price: '186.02' },
  { id: 'ord-06', ticker: 'GOOGL', order: 'BUY', quantity: '40', price: '141.75' },
  { id: 'ord-07', ticker: 'META', order: 'SELL', quantity: '15', price: '502.10' },
  { id: 'ord-08', ticker: 'NVDA', order: 'BUY', quantity: '8', price: '875.55' },
  { id: 'ord-09', ticker: 'NFLX', order: 'SELL', quantity: '20', price: '421.30' },
  { id: 'ord-10', ticker: 'AMD', order: 'BUY', quantity: '75', price: '118.90' },
]

function buildRows(failColumn: MappingFieldKey | null): ValidationRow[] {
  return BASE_ROWS.map((row) => ({
    id: row.id,
    ticker: cell(row.ticker, failColumn === 'ticker' ? 'fail' : 'ok'),
    order: cell(row.order, failColumn === 'order' ? 'fail' : 'ok'),
    quantity: cell(row.quantity, failColumn === 'quantity' ? 'fail' : 'ok'),
    price: cell(row.price, failColumn === 'price' ? 'fail' : 'ok'),
  }))
}

export function getValidationRows(scenario: ValidationScenario): ValidationRow[] {
  if (scenario === 'all-pass') {
    return buildRows(null)
  }
  return buildRows(FAILED_COLUMN)
}

/** Default rows for layouts without a scenario toggle. */
export const VALIDATION_ROWS = getValidationRows('all-pass')
