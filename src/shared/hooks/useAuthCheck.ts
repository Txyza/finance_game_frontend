import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '@shared/context'

export const useAuthCheck = () => {
  const navigate = useNavigate()
  const { user, loading, error } = useUserContext()

  useEffect(() => {
    if (!loading && error && error.status === 401) {
      navigate('/onboarding')
    }
  }, [error, loading, navigate])

  return {
    user,
    loading,
    error,
    isAuthenticated: !loading && !error && !!user
  }
}