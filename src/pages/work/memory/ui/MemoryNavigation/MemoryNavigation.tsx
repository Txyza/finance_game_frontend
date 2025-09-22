import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useMemoryGameStore } from '../../model/gameStore'
import { Button } from '../../../../../shared/ui'
import styles from './MemoryNavigation.module.css'

export const MemoryNavigation: React.FC = () => {
  const navigate = useNavigate()
  const { score, timeLeft, currentRound, resetGame } = useMemoryGameStore()

  const handleBackClick = () => {
    navigate('/work')
  }

  const handleNewGame = () => {
    resetGame()
  }

  const formatTime = (timeMs: number) => {
    const totalSeconds = Math.ceil(timeMs / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.navigation}>
      <div className={styles.leftSection}>
        <Button
          variant="gradient-mint"
          size="small"
          onClick={handleBackClick}
          className={styles.backButton}
        >
          ← Назад
        </Button>
      </div>

      <div className={styles.centerSection}>
        <div className="common-game-title">Memory</div>
        <div className={styles.gameStats}>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>Очки</div>
            <div className={styles.statValue}>{score.toLocaleString()}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>Время</div>
            <div className={styles.statValue}>{formatTime(timeLeft)}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>Раунд</div>
            <div className={styles.statValue}>{currentRound}</div>
          </div>
        </div>
      </div>

      <div className={styles.rightSection}>
        <Button
          variant="gradient-mint"
          size="small"
          onClick={handleNewGame}
          className={styles.newGameButton}
        >
          Новая игра
        </Button>
      </div>
    </div>
  )
}