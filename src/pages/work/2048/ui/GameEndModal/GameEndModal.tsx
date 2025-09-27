import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../model/gameStore'
import { Button } from '../../../../../shared/ui'
import { formatMoney } from '../../../../../shared/lib/formatMoney'
import styles from './GameEndModal.module.css'

interface GameEndModalProps {
  isOpen: boolean
  onClose: () => void
  earnedAmount?: number | null
  onNewGame?: () => void
}

export const GameEndModal: React.FC<GameEndModalProps> = ({ isOpen, onClose, earnedAmount, onNewGame }) => {
  const navigate = useNavigate()
  const { isWon, resetGame, getStatistics } = useGameStore()

  if (!isOpen) return null

  const stats = getStatistics()
  const gameTimeMinutes = Math.floor(stats.gameTime / 60000)
  const gameTimeSeconds = Math.floor((stats.gameTime % 60000) / 1000)

  const handleNewGame = () => {
    if (onNewGame) {
      onNewGame()
    } else {
      // Фоллбэк - возвращаемся к работам
      navigate('/work')
    }
  }

  const handleBackToWork = () => {
    navigate('/work')
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            🎉 Победа!
          </h2>
        </div>

        <div className={styles.content}>
          {/* Заработанная сумма - самая важная информация */}
          {earnedAmount !== null && earnedAmount !== undefined && (
            <div className={styles.rewardSection}>
              <div className={styles.rewardLabel}>💰 Заработано</div>
              <div className={styles.rewardValue}>{formatMoney(earnedAmount)}</div>
            </div>
          )}

          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Очки</div>
              <div className={styles.statValue}>{stats.totalScore.toLocaleString()}</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statLabel}>Максимальная плитка</div>
              <div className={styles.statValue}>{stats.maxTile}</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statLabel}>Количество ходов</div>
              <div className={styles.statValue}>{stats.totalMoves}</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statLabel}>Время игры</div>
              <div className={styles.statValue}>
                {gameTimeMinutes > 0 ? `${gameTimeMinutes}м ` : ''}{gameTimeSeconds}с
              </div>
            </div>
          </div>

          {isWon && (
            <div className={styles.achievement}>
              <div className={styles.achievementText}>
                Поздравляем! Вы достигли плитки 2048!
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button
            variant="gradient-mint"
            size="medium"
            onClick={handleNewGame}
            className={styles.button}
          >
            Новая игра
          </Button>

          <Button
            variant="primary"
            size="medium"
            onClick={handleBackToWork}
            className={styles.button}
          >
            Вернуться к работам
          </Button>
        </div>
      </div>
    </div>
  )
}