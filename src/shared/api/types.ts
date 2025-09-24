export interface UserProfileResponse {
  id: string
  debet_money: number
  capital: number
  energy: number
  experience: number
}

export interface UserCreateRequest {
  starter_card: string
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

export interface TaskRead {
  description: string
  type: 'daely' | 'weakly' | 'quest'
  reward: number
  reward_type: 'money' | 'exp'
  progress_max_points: number
  name: string
}

export interface UserTaskRead {
  progress: number
  rewarded: boolean
  id: string
  user_id: string
  task_name: string
}

export interface TaskListItem {
  user_task: UserTaskRead
  task: TaskRead
}

export interface TaskListResponse {
  tasks: TaskListItem[]
}

export interface TaskRewardRequest {
  user_task_id: string
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