import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGameStore } from '../../model/gameStore'
import { Button } from '../../../../../shared/ui'
import styles from './GameNavigation.module.css'

export const GameNavigation: React.FC = () => {
  const navigate = useNavigate()
  const { score, resetGame } = useGameStore()

  const handleBackClick = () => {
    navigate('/work')
  }

  const handleNewGame = () => {
    resetGame()
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
        <div className={styles.gameTitle}>2048</div>
        <div className={styles.scoreBlock}>
          <div className={styles.scoreLabel}>Очки</div>
          <div className={styles.scoreValue}>{score.toLocaleString()}</div>
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