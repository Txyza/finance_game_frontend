import { useState, useEffect, useCallback } from 'react'
import { analyticsApi, TransactionsResponse, Transaction, ApiError } from '@shared/api'

interface UseTransactionsState {
  transactions: Transaction[]
  loading: boolean
  error: ApiError | null
  nextCursor: string | null
  hasMore: boolean
}

interface UseTransactionsActions {
  refreshTransactions: () => Promise<void>
  loadMoreTransactions: () => Promise<void>
  clearError: () => void
}

type UseTransactionsReturn = UseTransactionsState & UseTransactionsActions

export const useTransactions = (): UseTransactionsReturn => {
  const [state, setState] = useState<UseTransactionsState>({
    transactions: [],
    loading: false,
    error: null,
    nextCursor: null,
    hasMore: true
  })

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const refreshTransactions = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('useTransactions: Fetching transactions...')
      const response: TransactionsResponse = await analyticsApi.getTransactions({ limit: 20 })

      console.log('useTransactions: Success, received transactions:', response.transactions.length)
      setState(prev => ({
        ...prev,
        transactions: response.transactions || [],
        nextCursor: response.next_cursor,
        hasMore: !!response.next_cursor,
        loading: false
      }))
    } catch (error) {
      console.error('useTransactions: Error fetching transactions:', error)
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
    }
  }, [])

  const loadMoreTransactions = useCallback(async () => {
    if (!state.hasMore || state.loading || !state.nextCursor) {
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('useTransactions: Loading more transactions with cursor:', state.nextCursor)
      const response: TransactionsResponse = await analyticsApi.getTransactions({
        limit: 20,
        cursor: state.nextCursor
      })

      console.log('useTransactions: Success, received more transactions:', response.transactions.length)
      setState(prev => ({
        ...prev,
        transactions: [...prev.transactions, ...response.transactions],
        nextCursor: response.next_cursor,
        hasMore: !!response.next_cursor,
        loading: false
      }))
    } catch (error) {
      console.error('useTransactions: Error loading more transactions:', error)
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
    }
  }, [state.nextCursor, state.hasMore, state.loading])

  // Загружаем транзакции при монтировании хука
  useEffect(() => {
    refreshTransactions()
  }, [refreshTransactions])

  return {
    transactions: state.transactions,
    loading: state.loading,
    error: state.error,
    nextCursor: state.nextCursor,
    hasMore: state.hasMore,
    refreshTransactions,
    loadMoreTransactions,
    clearError
  }
}