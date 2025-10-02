import { apiClient } from './client'
import { TaskListResponse, TaskRewardRequest } from './types'

export const taskApi = {
  /**
   * Получить список задач пользователя
   */
  getTasks: (): Promise<TaskListResponse> => {
    return apiClient.get<TaskListResponse>('/api/v1/task/list')
  },

  /**
   * Получить награду за выполненную задачу
   */
  claimReward: (data: TaskRewardRequest): Promise<void> => {
    return apiClient.post<void>('/api/v1/task/get_reward', data)
  },
}