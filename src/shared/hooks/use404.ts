import { useEffect } from 'react'

/**
 * Hook для установки правильного статуса 404 для поисковых систем
 * Использует meta-тег для указания поисковикам, что страница не найдена
 */
export const use404 = () => {
  useEffect(() => {
    // Добавляем meta-тег для поисковиков
    const metaRobots = document.querySelector('meta[name="robots"]')
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, nofollow')
    } else {
      const meta = document.createElement('meta')
      meta.name = 'robots'
      meta.content = 'noindex, nofollow'
      document.head.appendChild(meta)
    }

    // Добавляем специальный meta-тег для указания статуса
    const metaStatus = document.createElement('meta')
    metaStatus.name = 'prerender-status-code'
    metaStatus.content = '404'
    document.head.appendChild(metaStatus)

    // Обновляем title
    const originalTitle = document.title
    document.title = '404 - Страница не найдена | Cash-lvl'

    // Cleanup при unmount
    return () => {
      document.title = originalTitle
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow')
      }
      const statusMeta = document.querySelector('meta[name="prerender-status-code"]')
      if (statusMeta) {
        statusMeta.remove()
      }
    }
  }, [])
}