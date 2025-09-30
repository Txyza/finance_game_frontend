import { apiClient } from '../client'
import type { BankingInstrumentsResponse } from './types'

export const bankingApi = {
  /**
   * Получить все банковские инструменты пользователя
   */
  getInstruments: async (): Promise<BankingInstrumentsResponse> => {
    const response = await apiClient.get<BankingInstrumentsResponse>('/api/v1/banking/instruments')
    return response.data
  }
}