import { apiClient } from './client'

export interface SavingsAccount {
  id: string
  account_number: string
  account_type?: string
  current_interest_rate: number
  balance: number
  opened_at: string
  expires_at: string | null
}

export interface CreateSavingsAccountRequest {
  account_type: string
  initial_deposit: number
}

export interface CreateSavingsAccountResponse {
  account_id: string
  account_number: string
}

export interface SavingsOperation {
  id: string
  account_id: string
  type: 'deposit' | 'withdrawal' | 'interest'
  amount: number
  date: string
  description: string
}

export interface SavingsTransaction {
  id: string
  name: string
  amount: number
  datetime_start: string
}

export interface SavingsTransactionsResponse {
  account_id: string
  transactions: SavingsTransaction[]
}

export const savingsApi = {
  createAccount: (data: CreateSavingsAccountRequest): Promise<CreateSavingsAccountResponse> => {
    return apiClient.post<CreateSavingsAccountResponse>('/api/v1/savings', data)
  },

  getAccounts: (): Promise<{ accounts: SavingsAccount[] }> => {
    return apiClient.get<{ accounts: SavingsAccount[] }>('/api/v1/savings')
  },

  getAccount: (accountId: string): Promise<SavingsAccount> => {
    return apiClient.get<SavingsAccount>(`/api/v1/savings/${accountId}`)
  },

  deposit: (accountId: string, amount: number): Promise<{ message?: string }> => {
    return apiClient.post<{ message?: string }>(`/api/v1/savings/${accountId}/deposit`, {
      amount
    })
  },

  withdraw: (accountId: string, amount: number): Promise<{ message?: string }> => {
    return apiClient.post<{ message?: string }>(`/api/v1/savings/${accountId}/withdraw`, {
      amount
    })
  },

  closeAccount: (accountId: string): Promise<void> => {
    return apiClient.post<void>(`/api/v1/savings/${accountId}/close`)
  },

  getOperations: (accountId: string): Promise<{ operations: SavingsOperation[] }> => {
    return apiClient.get<{ operations: SavingsOperation[] }>(`/api/v1/savings/${accountId}/operations`)
  },

  getTransactions: (accountId: string): Promise<SavingsTransactionsResponse> => {
    return apiClient.get<SavingsTransactionsResponse>(`/api/v1/savings/${accountId}/transactions`)
  }
}