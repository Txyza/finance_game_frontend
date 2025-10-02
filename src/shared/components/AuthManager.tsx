import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserContext } from '@shared/context'

interface AuthManagerProps {
  children: React.ReactNode
}

export const AuthManager: React.FC<AuthManagerProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { refetchUser, user, loading, error } = useUserContext()

  useEffect(() => {
    console.log('AuthManager state:', {
      pathname: location.pathname,
      user: !!user,
      loading,
      error: error ? { status: error.status, message: error.message } : null
    })

    // Если мы на странице онбординга, не делаем ничего
    if (location.pathname === '/onboarding') {
      console.log('On onboarding page, skipping auth logic')
      return
    }

    // Если пользователя нет, загрузки нет и ошибки нет - делаем запрос
    if (!user && !loading && !error) {
      console.log('No user data, making API request')
      refetchUser()
      return
    }

    // Если получили любую ошибку авторизации - редиректим на онбординг
    if (!loading && error) {
      const isAuthError = error.status === 401 ||
                         error.status === 0 ||
                         error.message.includes('401') ||
                         error.message.includes('Unauthorized')

      if (isAuthError) {
        console.log('Auth error detected, redirecting to onboarding', error)
        navigate('/onboarding', { replace: true })
        return
      }
    }
  }, [location.pathname, user, loading, error, refetchUser, navigate])

  return <>{children}</>
}