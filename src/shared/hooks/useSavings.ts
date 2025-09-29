import { useState, useCallback } from 'react'
import { savingsApi, CreateSavingsAccountRequest, SavingsAccount, SavingsOperation } from '@shared/api'

export const useSavings = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createAccount = useCallback(async (data: CreateSavingsAccountRequest): Promise<SavingsAccount | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await savingsApi.createAccount(data)
      return response.account
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при создании счета'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAccounts = useCallback(async (): Promise<SavingsAccount[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await savingsApi.getAccounts()
      return response.accounts
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке счетов'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deposit = useCallback(async (accountId: string, amount: number): Promise<SavingsAccount | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await savingsApi.deposit(accountId, amount)
      return response.account
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при пополнении счета'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const withdraw = useCallback(async (accountId: string, amount: number): Promise<SavingsAccount | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await savingsApi.withdraw(accountId, amount)
      return response.account
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при снятии средств'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getAccount = useCallback(async (accountId: string): Promise<SavingsAccount | null> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await savingsApi.getAccount(accountId)
      return response.account
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке счета'
      setError(errorMessage)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getOperations = useCallback(async (accountId: string): Promise<SavingsOperation[]> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await savingsApi.getOperations(accountId)
      return response.operations
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Ошибка при загрузке операций'
      setError(errorMessage)
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    createAccount,
    getAccounts,
    getAccount,
    getOperations,
    deposit,
    withdraw,
    isLoading,
    error
  }
}