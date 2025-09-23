import { FC, ReactNode, useState, useCallback, useEffect } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { BottomNavigation, TabType } from '@pages/main/ui/BottomNavigation'

interface MainLayoutProps {
  children?: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState<TabType>('character')

  // Определяем активную вкладку по текущему пути
  useEffect(() => {
    if (location.pathname === '/shop') {
      setActiveTab('shop')
    } else if (location.pathname === '/analytics') {
      setActiveTab('analytics')
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
    } else if (tab === 'character') {
      navigate('/')
    }
  }, [navigate])

  const handleCityClick = useCallback(() => {
    console.log('City clicked')
  }, [])

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
        />
      )}
    </>
  )
}