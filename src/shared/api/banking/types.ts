export type InstrumentType = 'debit_card' | 'savings_account' | 'deposit'

export interface BankingInstrument {
  id: string
  type: InstrumentType
  name: string
  account_number: string
  balance: number
  interest_rate?: number | null
  opened_at: string
  expires_at?: string | null
  days_remaining?: number | null
}

export interface BankingInstrumentsResponse {
  debit_cards: BankingInstrument[]
  savings_accounts: BankingInstrument[]
  deposits: BankingInstrument[]
  total_balance: number
}