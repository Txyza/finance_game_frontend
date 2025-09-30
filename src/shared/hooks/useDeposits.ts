import { useState, useCallback } from 'react'
import {
  depositsApi,
  DepositListItem,
  DepositDetail,
  DepositCreateRequest,
  DepositCreateResponse,
  DepositCloseResponse
} from '@shared/api'

export const useDeposits = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getDeposits = useCallback(async (): Promise<DepositListItem[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await depositsApi.getDeposits()
      return response.deposits
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке вкладов'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getDeposit = useCallback(async (depositId: string): Promise<DepositDetail | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await depositsApi.getDeposit(depositId)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке вклада'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createDeposit = useCallback(async (data: DepositCreateRequest): Promise<DepositCreateResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await depositsApi.createDeposit(data)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при создании вклада'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const closeDeposit = useCallback(async (depositId: string): Promise<DepositCloseResponse | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await depositsApi.closeDeposit(depositId)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при закрытии вклада'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    getDeposits,
    getDeposit,
    createDeposit,
    closeDeposit,
    isLoading,
    error
  }
}