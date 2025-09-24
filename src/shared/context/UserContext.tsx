import React, { createContext, useContext, ReactNode } from 'react'
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

  return (
    <UserContext.Provider value={userState}>
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