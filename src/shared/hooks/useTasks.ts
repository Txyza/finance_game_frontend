import { useState, useEffect, useCallback } from 'react'
import { taskApi, TaskListResponse, TaskListItem, ApiError } from '@shared/api'

interface UseTasksState {
  tasks: TaskListItem[]
  loading: boolean
  error: ApiError | null
}

interface UseTasksActions {
  refreshTasks: () => Promise<void>
  claimReward: (userTaskId: string) => Promise<boolean>
  clearError: () => void
}

type UseTasksReturn = UseTasksState & UseTasksActions

export const useTasks = (): UseTasksReturn => {
  const [state, setState] = useState<UseTasksState>({
    tasks: [],
    loading: false,
    error: null
  })

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const refreshTasks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('useTasks: Fetching tasks...')
      const response: TaskListResponse = await taskApi.getTasks()

      console.log('useTasks: Success, received tasks:', response.tasks.length)
      setState(prev => ({
        ...prev,
        tasks: response.tasks || [],
        loading: false
      }))
    } catch (error) {
      console.error('useTasks: Error fetching tasks:', error)
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
    }
  }, [])

  const claimReward = useCallback(async (userTaskId: string): Promise<boolean> => {
    try {
      console.log('useTasks: Claiming reward for task:', userTaskId)
      await taskApi.claimReward({ user_task_id: userTaskId })

      console.log('useTasks: Reward claimed successfully')

      // Обновляем локальное состояние, помечая задачу как получившую награду
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task =>
          task.user_task_id === userTaskId
            ? { ...task, rewarded: true }
            : task
        )
      }))

      return true
    } catch (error) {
      console.error('useTasks: Error claiming reward:', error)
      const apiError = error as ApiError
      setState(prev => ({ ...prev, error: apiError }))
      return false
    }
  }, [])

  // Загружаем задачи при монтировании хука
  useEffect(() => {
    refreshTasks()
  }, [refreshTasks])

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    refreshTasks,
    claimReward,
    clearError
  }
}