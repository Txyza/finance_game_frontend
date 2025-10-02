import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useUserContext } from '@shared/context'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, error } = useUserContext()

  useEffect(() => {
    // Если мы уже на странице онбординга, не редиректим
    if (location.pathname === '/onboarding') {
      return
    }

    // Если получили 401 ошибку, редиректим на онбординг
    if (!loading && error && error.status === 401) {
      navigate('/onboarding', { replace: true })
    }
  }, [error, loading, navigate, location.pathname])

  // Показываем детей во всех случаях - загрузка, ошибка или успех
  // Редирект происходит в useEffect, но контент может отображаться
  return <>{children}</>
}