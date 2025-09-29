export interface UserProfileResponse {
  id: string
  debet_money: number
  capital: number
  energy: number
  max_energy: number
  experience: number
  key_rate: string
  inflation: string
  name: string
  ready_to_reward_tasks_counts: Record<string, number>
}

export interface UserCreateRequest {
  starter_card: string
  name: string
}

export interface WorkListItem {
  name: string
  description: string
  energy: number
  amount_booster: number
}

export interface WorkListResponse {
  works: WorkListItem[]
}

export interface WorkStartRequest {
  work_name: string
}

export interface WorkStartResponse {
  transaction_id: string
}

export interface WorkStopRequest {
  transaction_id: string
  points: number
}

export interface WorkStopResponse {
  amount: number
}

export interface StoreItem {
  name: string
  description: string
  price: number
  image?: string | null
  exists: boolean
}

export interface StoreListResponse {
  items: StoreItem[]
}

export interface StoreBuyRequest {
  name: string
}

export interface TaskListItem {
  user_task_id: string
  name: string
  description: string
  type: 'daely' | 'weakly' | 'quest'
  reward_type: 'money' | 'exp'
  reward: number
  progress_max_points: number
  progress: number
  rewarded: boolean
}

export interface TaskListResponse {
  tasks: TaskListItem[]
}

export interface TaskRewardRequest {
  user_task_id: string
}

// Analytics API types
export interface Transaction {
  instrument_id: string
  amount: number
  datetime_start: string
  datetime_end: string
  type: string
  name: string
  id: string
  user_id: string
}

export interface TransactionsResponse {
  transactions: Transaction[]
  next_cursor: string | null
}

export interface TransactionsRequest {
  limit?: number
  cursor?: string
}

// Analytics Summary types
export interface AnalyticsSummaryCategory {
  name: string
  amount: number
  percentage?: number
  color?: string
}

export interface AnalyticsSummaryGroup {
  [key: string]: number
}

export interface AnalyticsSummaryData {
  work: AnalyticsSummaryGroup
  bank: AnalyticsSummaryGroup
  task: AnalyticsSummaryGroup
  other: AnalyticsSummaryGroup
}

export interface AnalyticsSummaryResponse {
  income: AnalyticsSummaryData
  expense: AnalyticsSummaryData
}

export interface HTTPValidationError {
  detail?: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

export interface ApiError {
  message: string
  status: number
}