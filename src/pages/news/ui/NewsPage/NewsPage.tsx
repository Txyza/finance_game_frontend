import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  NewsList,
  NewsItem,
  ParticleBackground
} from '@shared/ui'
import { GameHeaderContainer } from '@shared/ui'
import styles from './NewsPage.module.css'

export const NewsPage: React.FC = () => {
  const navigate = useNavigate()
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 'news-1',
      title: 'Центробанк повысил ключевую ставку до 8.5%',
      content: 'В связи с ростом инфляционных ожиданий и укреплением экономики, ЦБ принял решение о повышении ключевой ставки на 0.5 п.п. Это повлияет на доходность ваших вкладов и кредитные условия в игре.',
      type: 'rate',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      impact: {
        type: 'positive',
        description: 'Доходность вкладов +0.5%'
      }
    },
    {
      id: 'news-2',
      title: 'Глобальный экономический рост замедляется',
      content: 'Международные эксперты прогнозируют снижение темпов роста мировой экономики. Это может повлиять на доходы от инвестиций и стоимость товаров.',
      type: 'economy',
      date: new Date(Date.now() - 5 * 60 * 60 * 1000),
      isRead: false,
      impact: {
        type: 'negative',
        description: 'Инфляция +2%, доходы от работы -5%'
      }
    },
    {
      id: 'news-3',
      title: 'Новое обновление: Добавлена мини-игра "Инвестор"',
      content: 'Теперь вы можете инвестировать заработанные средства в акции и облигации! Изучайте рынок, принимайте решения и увеличивайте свой капитал.',
      type: 'game',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      icon: '🚀'
    },
    {
      id: 'news-4',
      title: 'Технологический бум увеличивает зарплаты в IT',
      content: 'Спрос на технологических специалистов растет. Если вы работаете в IT секторе, ваш доход увеличится на 15% в следующем месяце.',
      type: 'event',
      date: new Date(Date.now() - 48 * 60 * 60 * 1000),
      isRead: false,
      impact: {
        type: 'positive',
        description: 'Бонус к зарплате +15% для IT работников'
      }
    },
    {
      id: 'news-5',
      title: 'Корректировка инфляции на текущий месяц',
      content: 'По данным статистики, инфляция составила 4.2% годовых. Цены на товары и услуги в игре будут скорректированы соответственно.',
      type: 'rate',
      date: new Date(Date.now() - 72 * 60 * 60 * 1000),
      isRead: true,
      impact: {
        type: 'neutral',
        description: 'Цены на товары +0.35% в месяц'
      }
    }
  ])

  // Mock данные игрока
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500,
    bankRate: 8.5,
    inflation: 4.2
  }

  const handleNewsRead = useCallback((newsId: string) => {
    console.log('News marked as read:', newsId)

    setNews(prevNews =>
      prevNews.map(item =>
        item.id === newsId ? { ...item, isRead: true } : item
      )
    )
  }, [])



  const unreadCount = news.filter(item => !item.isRead).length

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeaderContainer
        bankRate={playerStats.bankRate}
        inflation={playerStats.inflation}
      />

      <div className="common-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Новости</h1>
            {unreadCount > 0 && (
              <div className={styles.unreadBadge}>
                {unreadCount} новых
              </div>
            )}
          </div>

          {/* Список новостей */}
          <div className={styles.newsContainer}>
            <NewsList
              news={news}
              onNewsRead={handleNewsRead}
            />
          </div>
        </div>
      </div>

    </div>
  )
}