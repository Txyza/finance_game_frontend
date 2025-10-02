import React from 'react'
import { NewsCard, NewsItem } from '../NewsCard'
import styles from './NewsList.module.css'

interface NewsListProps {
  news: NewsItem[]
  onNewsRead: (newsId: string) => void
  className?: string
  showOnlyUnread?: boolean
}

export const NewsList: React.FC<NewsListProps> = ({
  news,
  onNewsRead,
  className,
  showOnlyUnread = false
}) => {
  const filteredNews = showOnlyUnread
    ? news.filter(item => !item.isRead)
    : news

  const sortedNews = [...filteredNews].sort((a, b) => {
    // Сначала непрочитанные
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1
    }
    // Затем по дате (новые сверху)
    return b.date.getTime() - a.date.getTime()
  })

  if (sortedNews.length === 0) {
    return (
      <div className={`${styles.newsList} ${className || ''}`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <p className={styles.emptyText}>
            {showOnlyUnread ? 'Все новости прочитаны!' : 'Нет доступных новостей'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`${styles.newsList} ${className || ''}`}>
      <div className={styles.list}>
        {sortedNews.map((newsItem) => (
          <NewsCard
            key={newsItem.id}
            news={newsItem}
            onRead={onNewsRead}
            className={styles.newsCard}
          />
        ))}
      </div>
    </div>
  )
}