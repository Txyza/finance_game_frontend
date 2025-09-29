import { apiClient } from './client'

export interface SavingsAccount {
  id: string
  type: 'basic' | 'premium'
  name: string
  balance: number
  interest_rate: number
  created_at: string
  status: 'active' | 'closed'
}

export interface CreateSavingsAccountRequest {
  type: 'basic' | 'premium'
  initial_amount: number
}

export interface CreateSavingsAccountResponse {
  account: SavingsAccount
}

export interface SavingsOperation {
  id: string
  account_id: string
  type: 'deposit' | 'withdrawal' | 'interest'
  amount: number
  date: string
  description: string
}

export const savingsApi = {
  createAccount: (data: CreateSavingsAccountRequest): Promise<CreateSavingsAccountResponse> => {
    return apiClient.post<CreateSavingsAccountResponse>('/api/v1/savings/create', data)
  },

  getAccounts: (): Promise<{ accounts: SavingsAccount[] }> => {
    return apiClient.get<{ accounts: SavingsAccount[] }>('/api/v1/savings/list')
  },

  getAccount: (accountId: string): Promise<{ account: SavingsAccount }> => {
    return apiClient.get<{ account: SavingsAccount }>(`/api/v1/savings/${accountId}`)
  },

  deposit: (accountId: string, amount: number): Promise<{ account: SavingsAccount }> => {
    return apiClient.post<{ account: SavingsAccount }>(`/api/v1/savings/${accountId}/deposit`, {
      amount
    })
  },

  withdraw: (accountId: string, amount: number): Promise<{ account: SavingsAccount }> => {
    return apiClient.post<{ account: SavingsAccount }>(`/api/v1/savings/${accountId}/withdraw`, {
      amount
    })
  },

  closeAccount: (accountId: string): Promise<void> => {
    return apiClient.post<void>(`/api/v1/savings/${accountId}/close`)
  },

  getOperations: (accountId: string): Promise<{ operations: SavingsOperation[] }> => {
    return apiClient.get<{ operations: SavingsOperation[] }>(`/api/v1/savings/${accountId}/operations`)
  }
}