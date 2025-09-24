import { useState, useEffect, useCallback } from 'react'
import { userApi, UserProfileResponse, ApiError } from '@shared/api'

interface UseUserState {
  user: UserProfileResponse | null
  loading: boolean
  error: ApiError | null
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
  })

  const fetchUser = useCallback(async () => {
    console.log('useUser: Starting fetch')
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      const user = await userApi.getCurrentUser()
      console.log('useUser: Success, user data received')
      setState(prev => ({ ...prev, user, loading: false }))
    } catch (error) {
      const apiError = error as ApiError
      console.log('useUser: Error received:', apiError)
      setState(prev => ({
        ...prev,
        error: apiError,
        loading: false
      }))
    }
  }, [])

  const refetchUser = useCallback(async () => {
    await fetchUser()
  }, [fetchUser])

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    refetchUser,
    clearError,
  }
}