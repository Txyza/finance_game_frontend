import { apiClient } from './client'

export interface DepositTransaction {
  id: string
  name: string
  amount: number
  datetime_start: string
}

export interface DepositTransactionsResponse {
  deposit_id: string
  transactions: DepositTransaction[]
}

export interface DepositListItem {
  id: string
  deposit_name: string
  account_number: string
  current_interest_rate: number
  balance: number
  days_remaining: number
}

export interface DepositListResponse {
  deposits: DepositListItem[]
}

export interface DepositDetail {
  id: string
  deposit_name: string
  account_number: string
  current_interest_rate: number
  balance: number
  opened_at: string
  expires_at: string
  days_remaining: number
  interest_payment_method: 'at_end' | 'monthly_capitalized' | 'monthly_to_account'
}

export interface DepositCreateRequest {
  deposit_name: string
  amount: number
  term_days: number
  interest_rate: number
  interest_payment_method: 'at_end' | 'monthly_capitalized' | 'monthly_to_account'
}

export interface DepositCreateResponse {
  deposit_id: string
  account_number: string
  expires_at: string
}

export interface DepositCloseResponse {
  deposit_id: string
  transferred_amount: number
  penalty_applied: boolean
  penalty_message: string
}

export const depositsApi = {
  getDeposits: (): Promise<DepositListResponse> => {
    return apiClient.get<DepositListResponse>('/api/v1/deposits')
  },

  getDeposit: (depositId: string): Promise<DepositDetail> => {
    return apiClient.get<DepositDetail>(`/api/v1/deposits/${depositId}`)
  },

  createDeposit: (data: DepositCreateRequest): Promise<DepositCreateResponse> => {
    return apiClient.post<DepositCreateResponse>('/api/v1/deposits', data)
  },

  closeDeposit: (depositId: string): Promise<DepositCloseResponse> => {
    return apiClient.post<DepositCloseResponse>(`/api/v1/deposits/${depositId}/close`)
  },

  getTransactions: (depositId: string): Promise<DepositTransactionsResponse> => {
    return apiClient.get<DepositTransactionsResponse>(`/api/v1/deposits/${depositId}/transactions`)
  }
}