import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView, trackGoal, YandexMetrikaGoals } from '@shared/lib/analytics'

/**
 * Hook для автоматического отслеживания переходов между страницами
 */
export const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    // Отслеживаем просмотр страницы
    trackPageView(location.pathname + location.search, {
      title: document.title,
      referer: document.referrer
    })

    // Отслеживаем специальные страницы как цели
    const pageGoals: Record<string, string> = {
      '/analytics': YandexMetrikaGoals.PAGE_ANALYTICS,
      '/shop': YandexMetrikaGoals.PAGE_SHOP,
      '/tasks': YandexMetrikaGoals.PAGE_TASKS,
      '/leaderboard': YandexMetrikaGoals.PAGE_LEADERBOARD,
      '/city': YandexMetrikaGoals.PAGE_CITY,
    }

    const goal = pageGoals[location.pathname]
    if (goal) {
      trackGoal(goal, {
        page: location.pathname,
        search: location.search
      })
    }

    // Отслеживаем игровые страницы
    if (location.pathname === '/work/2048') {
      trackGoal(YandexMetrikaGoals.GAME_2048_STARTED, {
        transactionId: new URLSearchParams(location.search).get('transactionId')
      })
    }

    if (location.pathname === '/work/memory') {
      trackGoal(YandexMetrikaGoals.GAME_MEMORY_STARTED, {
        transactionId: new URLSearchParams(location.search).get('transactionId')
      })
    }

  }, [location.pathname, location.search])
}