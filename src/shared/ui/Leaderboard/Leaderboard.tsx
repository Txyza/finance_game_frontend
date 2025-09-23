import React from 'react'
import { LeaderboardItem } from '../LeaderboardItem'
import styles from './Leaderboard.module.css'

export interface LeaderboardPlayer {
  id: string
  nickname: string
  value: number
  position: number
}

interface LeaderboardProps {
  players: LeaderboardPlayer[]
  category: 'money' | 'game2048' | 'memory'
  currentPlayerId?: string
  onPlayerClick?: (player: LeaderboardPlayer) => void
  className?: string
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  players,
  category,
  currentPlayerId,
  onPlayerClick,
  className
}) => {
  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'money':
        return 'Количество денег'
      case 'game2048':
        return 'Игра 2048'
      case 'memory':
        return 'Игра "Память"'
      default:
        return 'Рейтинг'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'money':
        return '💰'
      case 'game2048':
        return '🎮'
      case 'memory':
        return '🧠'
      default:
        return '🏆'
    }
  }

  return (
    <div className={`${styles.leaderboard} ${className || ''}`}>
      <div className={styles.header}>
        <div className={styles.icon}>
          {getCategoryIcon(category)}
        </div>
        <h3 className={styles.title}>
          {getCategoryTitle(category)}
        </h3>
      </div>

      <div className={styles.list}>
        {players.length > 0 ? (
          players.map((player) => (
            <LeaderboardItem
              key={player.id}
              position={player.position}
              nickname={player.nickname}
              value={player.value}
              category={category}
              isCurrentPlayer={player.id === currentPlayerId}
              onClick={() => onPlayerClick?.(player)}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <p className={styles.emptyText}>
              Нет данных для отображения
            </p>
          </div>
        )}
      </div>
    </div>
  )
}