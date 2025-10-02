import React from 'react'
import { formatMoney } from '@shared/lib/formatMoney'
import styles from './LeaderboardItem.module.css'

interface LeaderboardItemProps {
  position: number
  nickname: string
  value: number
  category: 'money' | 'game2048' | 'memory'
  isCurrentPlayer?: boolean
  onClick?: () => void
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  position,
  nickname,
  value,
  category,
  isCurrentPlayer = false,
  onClick
}) => {
  const formatValue = (value: number, category: string) => {
    switch (category) {
      case 'money':
        return `${formatMoney(value)} ₽`
      case 'game2048':
        return `${value.toLocaleString('ru-RU')} очков`
      case 'memory':
        return `${value.toLocaleString('ru-RU')} очков`
      default:
        return value.toString()
    }
  }

  const getPositionDisplay = (position: number) => {
    if (position <= 3) {
      return position === 1 ? '🥇' : position === 2 ? '🥈' : '🥉'
    }
    return position.toString()
  }

  return (
    <div
      className={`${styles.item} ${isCurrentPlayer ? styles.currentPlayer : ''}`}
      onClick={onClick}
    >
      <div className={styles.position}>
        {getPositionDisplay(position)}
      </div>

      <div className={styles.nickname}>
        {nickname}
      </div>

      <div className={styles.value}>
        {formatValue(value, category)}
      </div>
    </div>
  )
}