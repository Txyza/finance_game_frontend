import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGameStore, generateGameUUID } from '../../model/gameStore'
import { GameHeader } from '@shared/ui'
import { GameNavigation } from '../GameNavigation/GameNavigation'
import { GameBoard } from '../GameBoard/GameBoard'
import { GameEndModal } from '../GameEndModal/GameEndModal'
import { ParticleBackground } from '../../../../../shared/ui'
import styles from './Game2048Page.module.css'

export const Game2048Page: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { initGame, isGameOver, isWon } = useGameStore()
  const [showEndModal, setShowEndModal] = useState(false)

  // Mock данные игрока (в реальном приложении брать из глобального стора)
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500
  }

  useEffect(() => {
    // Get or generate game ID
    let gameId = searchParams.get('id')

    if (!gameId) {
      // Create new game if no ID provided
      gameId = generateGameUUID()
      setSearchParams({ id: gameId }, { replace: true })
    }

    // Initialize game with the ID
    initGame(gameId)
  }, [searchParams, setSearchParams, initGame])

  useEffect(() => {
    // Show end modal when game ends
    if (isGameOver || isWon) {
      const timer = setTimeout(() => {
        setShowEndModal(true)
      }, 1000) // Delay to show final board state

      return () => clearTimeout(timer)
    } else {
      setShowEndModal(false)
    }
  }, [isGameOver, isWon])

  const handleCloseEndModal = () => {
    setShowEndModal(false)
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeader
        variant="work"
        level={playerStats.level}
        currentExp={playerStats.currentExp}
        maxExp={playerStats.maxExp}
        energy={playerStats.energy}
        maxEnergy={playerStats.maxEnergy}
        money={playerStats.money}
      />

      <GameNavigation />

      <div className="common-game-content">
        <div className={styles.gameContainer}>
          <GameBoard />
        </div>

        <div className={styles.instructions}>
          <p className={styles.instructionText}>
            Используйте стрелки или свайпы для перемещения плиток
          </p>
        </div>
      </div>

      <GameEndModal
        isOpen={showEndModal}
        onClose={handleCloseEndModal}
      />
    </div>
  )
}