import { useMemo } from 'react'
import { useUserContext } from '@shared/context'
import { UserProfileResponse } from '@shared/api'

/**
 * Хук для получения стабильных данных пользователя без изменений при loading
 * Используется для предотвращения мигания header во время периодических обновлений
 */
export const useStableUser = () => {
  const { user, loading, error } = useUserContext()

  // Возвращаем стабильные данные - loading не влияет на мемоизацию
  const stableData = useMemo(() => ({
    user: user as UserProfileResponse | null,
    // Показываем loading только если нет пользователя (первоначальная загрузка)
    loading: loading && !user,
    error
  }), [user, error, loading])

  return stableData
}