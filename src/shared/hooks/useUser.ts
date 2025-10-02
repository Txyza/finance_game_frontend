import { useState, useEffect, useCallback } from 'react'
import { userApi, UserProfileResponse, ApiError } from '@shared/api'

// Функция для глубокого сравнения объектов пользователей
const isUserDataEqual = (user1: UserProfileResponse | null, user2: UserProfileResponse | null): boolean => {
  if (user1 === user2) return true
  if (!user1 || !user2) return false

  // Сравниваем основные поля, которые влияют на UI
  // Используем строгое сравнение для числовых значений
  const isBasicDataEqual = (
    user1.id === user2.id &&
    Number(user1.experience) === Number(user2.experience) &&
    Number(user1.energy) === Number(user2.energy) &&
    Number(user1.max_energy) === Number(user2.max_energy) &&
    Number(user1.capital) === Number(user2.capital) &&
    String(user1.key_rate || '') === String(user2.key_rate || '') &&
    String(user1.inflation || '') === String(user2.inflation || '') &&
    String(user1.name || '') === String(user2.name || '')
  )

  // Сравниваем ready_to_reward_tasks_counts
  const isTaskCountsEqual = (() => {
    const tasks1 = user1.ready_to_reward_tasks_counts || {}
    const tasks2 = user2.ready_to_reward_tasks_counts || {}

    const keys1 = Object.keys(tasks1)
    const keys2 = Object.keys(tasks2)

    if (keys1.length !== keys2.length) return false

    return keys1.every(key => tasks1[key] === tasks2[key])
  })()

  return isBasicDataEqual && isTaskCountsEqual
}

interface UseUserState {
  user: UserProfileResponse | null
  loading: boolean
  error: ApiError | null
  isInitialLoad: boolean
}

interface UseUserActions {
  refetchUser: () => Promise<void>
  clearError: () => void
}

type UseUserReturn = UseUserState & UseUserActions

export const useUser = (): UseUserReturn => {
  const [state, setState] = useState<UseUserState>({
    user: null,
    loading: false,
    error: null,
    isInitialLoad: true,
  })

  const fetchUser = useCallback(async (isInitial = false) => {
    console.log('useUser: Starting fetch, isInitial:', isInitial)

    // Показываем loading только для первоначальной загрузки
    setState(prev => ({
      ...prev,
      loading: isInitial ? true : prev.loading,
      error: null
    }))

    try {
      const newUser = await userApi.getCurrentUser()
      console.log('useUser: Success, user data received')

      setState(prev => {
        // Сравниваем новые данные с текущими
        if (isUserDataEqual(prev.user, newUser)) {
          console.log('useUser: Data unchanged, skipping state update')
          // Данные не изменились, отмечаем что загрузка завершена но пользователя не меняем
          return {
            ...prev,
            loading: false,
            isInitialLoad: false
          }
        }

        console.log('useUser: Data changed, updating state')
        return {
          ...prev,
          user: newUser,
          loading: false,
          isInitialLoad: false
        }
      })
    } catch (error) {
      const apiError = error as ApiError
      console.log('useUser: Error received:', apiError)
      setState(prev => ({
        ...prev,
        error: apiError,
        loading: false,
        isInitialLoad: false
      }))
    }
  }, [])

  // Автоматическое обновление данных пользователя каждые 10 секунд
  useEffect(() => {
    // Загружаем данные при монтировании - это первоначальная загрузка
    fetchUser(true)

    // Устанавливаем интервал для обновления каждые 10 секунд - это НЕ первоначальная загрузка
    const interval = setInterval(() => {
      fetchUser(false)
    }, 10000)

    // Очищаем интервал при размонтировании
    return () => clearInterval(interval)
  }, [fetchUser])

  const refetchUser = useCallback(async () => {
    await fetchUser(false)
  }, [fetchUser])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isInitialLoad: state.isInitialLoad,
    refetchUser,
    clearError,
  }
}