import { useState, useEffect, useCallback } from 'react'
import { workApi, WorkListResponse, WorkStartRequest, WorkStartResponse, WorkStopResponse, WorkStopRequest, ApiError } from '@shared/api'

interface UseWorkState {
  workList: WorkListResponse | null
  activeGame: {
    transactionId: string
    startTime: number
  } | null
  loading: boolean
  error: ApiError | null
}

interface UseWorkActions {
  fetchWorkList: () => Promise<void>
  startWork: (workName: string) => Promise<string | null>
  stopWork: (points: number) => Promise<WorkStopResponse | null>
  stopWorkWithTransactionId: (transactionId: string, points: number) => Promise<WorkStopResponse | null>
  clearError: () => void
}

type UseWorkReturn = UseWorkState & UseWorkActions

export const useWork = (): UseWorkReturn => {
  const [state, setState] = useState<UseWorkState>({
    workList: null,
    activeGame: null,
    loading: false,
    error: null,
  })

  const fetchWorkList = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const workList = await workApi.getWorkList()
      console.log('useWork: Work list received:', workList)
      setState(prev => ({ ...prev, workList, loading: false }))
    } catch (error) {
      const apiError = error as ApiError
      console.log('useWork: Error fetching work list:', apiError)
      setState(prev => ({
        ...prev,
        error: apiError,
        loading: false
      }))
    }
  }, [])

  const startWork = useCallback(async (workName: string): Promise<string | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const request: WorkStartRequest = { work_name: workName }
      const response = await workApi.startWork(request)
      console.log('useWork: Work started with transaction ID:', response.transaction_id, 'for work:', workName)

      const activeGame = {
        transactionId: response.transaction_id,
        startTime: Date.now()
      }

      setState(prev => ({
        ...prev,
        activeGame,
        loading: false
      }))

      return response.transaction_id
    } catch (error) {
      const apiError = error as ApiError
      console.log('useWork: Error starting work:', apiError)
      setState(prev => ({
        ...prev,
        error: apiError,
        loading: false
      }))
      return null
    }
  }, [])

  const stopWork = useCallback(async (points: number): Promise<WorkStopResponse | null> => {
    if (!state.activeGame) {
      console.warn('useWork: No active game to stop')
      return null
    }

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const stopRequest: WorkStopRequest = {
        transaction_id: state.activeGame.transactionId,
        points: points
      }

      const response = await workApi.stopWork(stopRequest)
      console.log('useWork: Work stopped, reward:', response.amount)

      setState(prev => ({
        ...prev,
        activeGame: null,
        loading: false
      }))

      return response
    } catch (error) {
      const apiError = error as ApiError
      console.log('useWork: Error stopping work:', apiError)
      setState(prev => ({
        ...prev,
        error: apiError,
        loading: false
      }))
      return null
    }
  }, [state.activeGame])

  const stopWorkWithTransactionId = useCallback(async (transactionId: string, points: number): Promise<WorkStopResponse | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const stopRequest: WorkStopRequest = {
        transaction_id: transactionId,
        points: points
      }

      const response = await workApi.stopWork(stopRequest)
      console.log('useWork: Work stopped with transaction ID:', transactionId, 'reward:', response.amount)

      setState(prev => ({
        ...prev,
        activeGame: null,
        loading: false
      }))

      return response
    } catch (error) {
      const apiError = error as ApiError
      console.log('useWork: Error stopping work with transaction ID:', transactionId, apiError)
      setState(prev => ({
        ...prev,
        error: apiError,
        loading: false
      }))
      return null
    }
  }, [])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Автоматически загружаем список работ при инициализации
  useEffect(() => {
    fetchWorkList()
  }, [fetchWorkList])

  return {
    workList: state.workList,
    activeGame: state.activeGame,
    loading: state.loading,
    error: state.error,
    fetchWorkList,
    startWork,
    stopWork,
    stopWorkWithTransactionId,
    clearError,
  }
}