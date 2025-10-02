import React, { createContext, useContext, ReactNode, useMemo } from 'react'
import { useUser } from '@shared/hooks/useUser'
import { UserProfileResponse, ApiError } from '@shared/api'

interface UserContextValue {
  user: UserProfileResponse | null
  loading: boolean
  error: ApiError | null
  refetchUser: () => Promise<void>
  clearError: () => void
}

const UserContext = createContext<UserContextValue | null>(null)

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userState = useUser()

  // Мемоизируем значение контекста для предотвращения ненужных перерендеров
  const contextValue = useMemo(() => ({
    user: userState.user,
    loading: userState.loading,
    error: userState.error,
    refetchUser: userState.refetchUser,
    clearError: userState.clearError
  }), [
    userState.user,
    userState.loading,
    userState.error,
    userState.refetchUser,
    userState.clearError
  ])

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = (): UserContextValue => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within UserProvider')
  }
  return context
}