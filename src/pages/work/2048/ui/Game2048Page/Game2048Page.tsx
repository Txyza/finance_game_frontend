import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useGameStore, generateGameUUID } from '../../model/gameStore'
import { GameHeaderContainer } from '@shared/ui'
import { useWork } from '@shared/hooks'
import { useUserContext } from '@shared/context'
import { GameNavigation } from '../GameNavigation/GameNavigation'
import { GameBoard } from '../GameBoard/GameBoard'
import { GameEndModal } from '../GameEndModal/GameEndModal'
import { GameTimer } from '../GameTimer/GameTimer'
import { ParticleBackground } from '../../../../../shared/ui'
import styles from './Game2048Page.module.css'

export const Game2048Page: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { initGame, isGameOver, isWon, score } = useGameStore()
  const { stopWork } = useWork()
  const { refetchUser } = useUserContext()
  const [showEndModal, setShowEndModal] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [earnedAmount, setEarnedAmount] = useState<number | null>(null)

  const GAME_DURATION = 5 * 60 // 5 minutes in seconds

  useEffect(() => {
    // Get transaction ID from URL params
    const transactionIdFromUrl = searchParams.get('transactionId')

    if (transactionIdFromUrl) {
      setTransactionId(transactionIdFromUrl)
    } else {
      console.error('No transaction ID provided')
      navigate('/work')
      return
    }

    // Get or generate game ID
    let gameId = searchParams.get('id')
    if (!gameId) {
      gameId = generateGameUUID()
      setSearchParams(prev => ({ ...Object.fromEntries(prev), id: gameId }), { replace: true })
    }

    // Initialize game with the ID
    initGame(gameId)
  }, [searchParams, setSearchParams, initGame, navigate])

  useEffect(() => {
    // End game session when player wins or loses
    if ((isGameOver || isWon) && !gameEnded) {
      const timer = setTimeout(() => {
        endGameSession()
      }, 1000) // Delay to show final board state

      return () => clearTimeout(timer)
    }
  }, [isGameOver, isWon, gameEnded, endGameSession])

  // Функция завершения игры
  const endGameSession = useCallback(async () => {
    if (gameEnded || !transactionId) return

    setGameEnded(true)

    console.log('Ending game with score:', score)

    try {
      const reward = await stopWork(score)
      if (reward) {
        console.log('Game completed, reward received:', reward.amount)
        setEarnedAmount(reward.amount)
        // Обновляем данные пользователя
        await refetchUser()
      }
    } catch (error) {
      console.error('Failed to end game session:', error)
      setEarnedAmount(0) // Показываем 0 при ошибке
    }

    setShowEndModal(true)
  }, [gameEnded, transactionId, score, stopWork, refetchUser])

  // Обработчик окончания времени
  const handleTimeUp = useCallback(() => {
    console.log('Time is up!')
    endGameSession()
  }, [endGameSession])

  const handleCloseEndModal = () => {
    setShowEndModal(false)
    navigate('/work')
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeaderContainer
        variant="work"
      />

      <GameNavigation />

      <div className="common-game-content">
        {/* Таймер игры */}
        <GameTimer
          duration={GAME_DURATION}
          onTimeUp={handleTimeUp}
          isActive={!gameEnded && !isGameOver && !isWon}
        />

        <div className={styles.gameContainer}>
          <GameBoard />
        </div>

        <div className={styles.instructions}>
          <p className={styles.instructionText}>
            Используйте стрелки или свайпы для перемещения плиток
          </p>
          <p className={styles.instructionText}>
            У вас есть 5 минут на игру!
          </p>
        </div>
      </div>

      <GameEndModal
        isOpen={showEndModal}
        onClose={handleCloseEndModal}
        earnedAmount={earnedAmount}
      />
    </div>
  )
}