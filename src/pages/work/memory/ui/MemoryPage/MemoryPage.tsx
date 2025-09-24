import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useMemoryGameStore, generateGameUUID } from '../../model/gameStore'
import { GameHeaderContainer } from '@shared/ui'
import { MemoryNavigation } from '../MemoryNavigation/MemoryNavigation'
import { MemoryBoard } from '../MemoryBoard/MemoryBoard'
import { MemoryEndModal } from '../MemoryEndModal/MemoryEndModal'
import { ParticleBackground } from '../../../../../shared/ui'
import styles from './MemoryPage.module.css'

export const MemoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { initGame, isGameEnded } = useMemoryGameStore()
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
    if (isGameEnded) {
      const timer = setTimeout(() => {
        setShowEndModal(true)
      }, 1000) // Delay to show final board state

      return () => clearTimeout(timer)
    } else {
      setShowEndModal(false)
    }
  }, [isGameEnded])

  const handleCloseEndModal = () => {
    setShowEndModal(false)
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeaderContainer
        variant="work"
      />

      <MemoryNavigation />

      <div className="common-game-content">
        <div className={styles.gameContainer}>
          <MemoryBoard />
        </div>

        <div className={styles.instructions}>
          <p className={styles.instructionText}>
            Найдите все пары карточек за 1.5 минуты!
          </p>
          <p className={styles.instructionText}>
            125 очков за каждую пару
          </p>
        </div>
      </div>

      <MemoryEndModal
        isOpen={showEndModal}
        onClose={handleCloseEndModal}
      />
    </div>
  )
}