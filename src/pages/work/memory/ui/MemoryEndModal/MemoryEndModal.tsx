import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemoryGameStore } from '../../model/gameStore'
import { Button } from '../../../../../shared/ui'
import styles from './MemoryEndModal.module.css'

interface MemoryEndModalProps {
  isOpen: boolean
  onClose: () => void
  earnedAmount?: number | null
  onNewGame?: () => void
}

export const MemoryEndModal: React.FC<MemoryEndModalProps> = ({ isOpen, onClose, earnedAmount, onNewGame }) => {
  const navigate = useNavigate()
  const { resetGame, getStatistics } = useMemoryGameStore()

  if (!isOpen) return null

  const stats = getStatistics()
  const gameTimeMinutes = Math.floor(stats.totalTime / 60000)
  const gameTimeSeconds = Math.floor((stats.totalTime % 60000) / 1000)

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
            🧠 Время вышло!
          </h2>
        </div>

        <div className={styles.content}>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Итоговые очки</div>
              <div className={styles.statValue}>{stats.totalScore.toLocaleString()}</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statLabel}>Раундов завершено</div>
              <div className={styles.statValue}>{stats.roundsCompleted}</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statLabel}>Пар найдено</div>
              <div className={styles.statValue}>{stats.matchedPairs}</div>
            </div>

            <div className={styles.statItem}>
              <div className={styles.statLabel}>Точность</div>
              <div className={styles.statValue}>{stats.accuracy}%</div>
            </div>
          </div>

          {stats.totalScore > 0 && (
            <div className={styles.achievement}>
              <div className={styles.achievementText}>
                {stats.roundsCompleted > 0
                  ? `Отличная память! Вы завершили ${stats.roundsCompleted} раундов!`
                  : 'Продолжайте тренировать память!'
                }
              </div>
            </div>
          )}

          {earnedAmount !== null && earnedAmount !== undefined && (
            <div className={styles.reward}>
              <div className={styles.rewardText}>
                💰 Заработано: {earnedAmount.toLocaleString()} ₽
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