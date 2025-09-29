import { apiClient } from './client'
import { TransactionsResponse, TransactionsRequest, AnalyticsSummaryResponse } from './types'

export const analyticsApi = {
  /**
   * Получить список транзакций пользователя
   */
  getTransactions: (params?: TransactionsRequest): Promise<TransactionsResponse> => {
    const queryParams = new URLSearchParams()

    if (params?.limit) {
      queryParams.append('limit', params.limit.toString())
    } else {
      queryParams.append('limit', '20')
    }

    if (params?.cursor) {
      queryParams.append('cursor', params.cursor)
    }

    const url = `/api/v1/analytics/transactions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    return apiClient.get<TransactionsResponse>(url)
  },

  /**
   * Получить сводку по аналитике (инструменты и операции)
   */
  getSummary: (): Promise<AnalyticsSummaryResponse> => {
    return apiClient.get<AnalyticsSummaryResponse>('/api/v1/analytics/summary')
  },
}