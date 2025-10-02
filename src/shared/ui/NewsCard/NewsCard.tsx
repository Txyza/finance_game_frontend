import React from 'react'
import { Button } from '../Button'
import styles from './NewsCard.module.css'

export interface NewsItem {
  id: string
  title: string
  content: string
  type: 'rate' | 'economy' | 'game' | 'event'
  date: Date
  isRead: boolean
  icon?: string
  impact?: {
    type: 'positive' | 'negative' | 'neutral'
    description: string
  }
}

interface NewsCardProps {
  news: NewsItem
  onRead: (newsId: string) => void
  className?: string
}

export const NewsCard: React.FC<NewsCardProps> = ({
  news,
  onRead,
  className
}) => {
  const getTypeIcon = (type: NewsItem['type']) => {
    switch (type) {
      case 'rate':
        return '📈'
      case 'economy':
        return '💹'
      case 'game':
        return '🎮'
      case 'event':
        return '🌍'
      default:
        return '📰'
    }
  }

  const getTypeLabel = (type: NewsItem['type']) => {
    switch (type) {
      case 'rate':
        return 'Ключевая ставка'
      case 'economy':
        return 'Экономика'
      case 'game':
        return 'Игровое событие'
      case 'event':
        return 'Мировые события'
      default:
        return 'Новость'
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

    if (diffHours < 1) {
      return 'Только что'
    } else if (diffHours < 24) {
      return `${diffHours} ч. назад`
    } else if (diffHours < 48) {
      return 'Вчера'
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      })
    }
  }

  const handleReadClick = () => {
    if (!news.isRead) {
      onRead(news.id)
    }
  }

  return (
    <div className={`${styles.newsCard} ${news.isRead ? styles.read : ''} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.typeSection}>
          <div className={styles.typeIcon}>
            {news.icon || getTypeIcon(news.type)}
          </div>
          <div className={styles.typeInfo}>
            <span className={styles.typeLabel}>
              {getTypeLabel(news.type)}
            </span>
            <span className={styles.date}>
              {formatDate(news.date)}
            </span>
          </div>
        </div>

        {!news.isRead && (
          <div className={styles.unreadBadge}>
            Новое
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          {news.title}
        </h3>
        <p className={styles.text}>
          {news.content}
        </p>

        {news.impact && (
          <div className={`${styles.impact} ${styles[news.impact.type]}`}>
            <div className={styles.impactIcon}>
              {news.impact.type === 'positive' ? '📈' :
               news.impact.type === 'negative' ? '📉' : '➖'}
            </div>
            <span className={styles.impactText}>
              {news.impact.description}
            </span>
          </div>
        )}
      </div>

      {!news.isRead && (
        <div className={styles.actions}>
          <Button
            onClick={handleReadClick}
            variant="gradient-mint"
            size="small"
            className={styles.readButton}
          >
            Прочитано
          </Button>
        </div>
      )}
    </div>
  )
}