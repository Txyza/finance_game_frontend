import { FC, ReactNode, useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useUserContext, useTourContext } from '@shared/context'
import { calculateLevel } from '@shared/utils/levelCalculator'
import { BottomNavigation, TabType } from '@pages/main/ui/BottomNavigation'

interface MainLayoutProps {
  children?: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useUserContext()
  const { isCityTourActive, setCityTourActive, setCityTourCompleted } = useTourContext()
  const [activeTab, setActiveTab] = useState<TabType>('character')

  const currentLevel = user ? calculateLevel(user.experience) : 1

  // Определяем активную вкладку по текущему пути
  useEffect(() => {
    if (location.pathname === '/shop') {
      setActiveTab('shop')
    } else if (location.pathname === '/analytics') {
      setActiveTab('analytics')
    } else if (location.pathname === '/accounts') {
      setActiveTab('accounts')
    } else if (location.pathname === '/' || location.pathname === '/tasks' || location.pathname === '/news' || location.pathname === '/leaderboard') {
      setActiveTab('character')
    }
  }, [location.pathname])

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)

    if (tab === 'shop') {
      navigate('/shop')
    } else if (tab === 'analytics') {
      navigate('/analytics')
    } else if (tab === 'accounts') {
      navigate('/accounts')
    } else if (tab === 'character') {
      navigate('/')
    }
  }, [navigate])

  const handleCityClick = useCallback(() => {
    // Если активен тур города, завершаем его
    if (isCityTourActive) {
      setCityTourActive(false)
      setCityTourCompleted()
    }
    navigate('/city')
  }, [navigate, isCityTourActive, setCityTourActive, setCityTourCompleted])

  const handleAccountsClick = useCallback(() => {
    navigate('/accounts')
  }, [navigate])

  // Не показываем навигацию на определенных страницах
  const hideNavigation = ['/brandbook', '/work/2048', '/work/memory'].includes(location.pathname)

  return (
    <>
      {children || <Outlet />}
      {!hideNavigation && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onCityClick={handleCityClick}
          onAccountsClick={handleAccountsClick}
          currentLevel={currentLevel}
        />
      )}
    </>
  )
}