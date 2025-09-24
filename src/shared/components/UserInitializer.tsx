import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useUserContext } from '@shared/context'

interface UserInitializerProps {
  children: React.ReactNode
}

export const UserInitializer: React.FC<UserInitializerProps> = ({ children }) => {
  const location = useLocation()
  const { refetchUser, user, loading, error } = useUserContext()

  useEffect(() => {
    // Если мы на странице онбординга, не делаем запрос
    if (location.pathname === '/onboarding') {
      return
    }

    // Если пользователя нет и нет активной загрузки, делаем запрос
    if (!user && !loading && !error) {
      refetchUser()
    }
  }, [location.pathname, user, loading, error, refetchUser])

  return <>{children}</>
}