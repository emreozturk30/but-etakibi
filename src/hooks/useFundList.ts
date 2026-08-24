import { useCallback, useEffect, useState } from 'react'
import type { FundOption } from '../utils/fundList'
import { fetchFundList } from '../utils/fundList'

type FundListState =
  | { status: 'loading' }
  | { status: 'ready'; list: FundOption[] }
  | { status: 'error'; message: string }

function toErrorMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : 'Fiyat alınamadı, manuel girebilirsiniz.'
}

export function useFundList() {
  const [state, setState] = useState<FundListState>({ status: 'loading' })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchFundList()
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
