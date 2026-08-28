export type MappingField = 'ticker' | 'order' | 'quantity' | 'price'

export const FIELD_LABELS: Record<MappingField, string> = {
  ticker: 'Ticker',
  order: 'Order',
  quantity: 'Quantity',
  price: 'Price',
}

export const ALIAS_SEEDS: Record<MappingField, string[]> = {
  ticker: [
    'stock ticker',
    'StockTicker',
    'symbol',
    'ticker',
    'tickerSymbol',
    'instrument',
    'security_id',
  ],
  order: [
    'type',
    'Type',
    'order',
    'orderType',
    'order_type',
    'side',
    'action',
  ],
  quantity: [
    'count',
    'quantity',
    'qty',
    'number shares',
    'numberShares',
    'shares',
    'size',
  ],
  price: [
    'price',
    'Price',
    'price per share',
    'pricePerShare',
    'limitPrice',
    'px',
    'unit_price',
  ],
}
