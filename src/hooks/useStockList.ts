import { useCallback, useEffect, useState } from 'react'
import type { StockOption } from '../utils/stockList'
import { fetchStockList } from '../utils/stockList'

type StockListState =
  | { status: 'loading' }
  | { status: 'ready'; list: StockOption[] }
  | { status: 'error'; message: string }

function toErrorMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : 'Fiyat alınamadı, manuel girebilirsiniz.'
}

export function useStockList() {
  const [state, setState] = useState<StockListState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchStockList()
      .then((list) => {
        if (!cancelled) setState({ status: 'ready', list })
      })
      .catch((err: unknown) => {
        if (!cancelled) setState({ status: 'error', message: toErrorMessage(err) })
      })
    return () => {
      cancelled = true
    }
  }, [attempt])

  const retry = useCallback(() => {
    setState({ status: 'loading' })
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, retry }
}
