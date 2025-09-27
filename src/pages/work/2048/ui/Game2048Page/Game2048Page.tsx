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
  const { stopWorkWithTransactionId, startWork, workList } = useWork()
  const { user, refetchUser } = useUserContext()
  const [showEndModal, setShowEndModal] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [earnedAmount, setEarnedAmount] = useState<number | null>(null)
  const [workName, setWorkName] = useState<string | null>(null)
  const [timerResetKey, setTimerResetKey] = useState<number>(0)

  const GAME_DURATION = 1 * 5 // 5 minutes in seconds

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
      setSearchParams(prev => ({ ...Object.fromEntries(prev), id: gameId! }), { replace: true })
    }

    // Initialize game with the ID
    initGame(gameId)
  }, [searchParams, setSearchParams, initGame, navigate])

  // Определяем имя работы для игры 2048
  useEffect(() => {
    if (workList?.works) {
      const work2048 = workList.works.find(work =>
        work.name.toLowerCase().includes('2048') ||
        work.name.toLowerCase().includes('плитки')
      )
      if (work2048) {
        setWorkName(work2048.name)
      }
    }
  }, [workList])

  // Функция завершения игры
  const endGameSession = useCallback(async () => {
    if (gameEnded || !transactionId) return

    setGameEnded(true)

    console.log('Ending game with score:', score)

    try {
      const reward = await stopWorkWithTransactionId(transactionId, score)
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
  }, [gameEnded, transactionId, score, stopWorkWithTransactionId, refetchUser])

  useEffect(() => {
    // End game session when player wins or loses
    if ((isGameOver || isWon) && !gameEnded) {
      const timer = setTimeout(() => {
        endGameSession()
      }, 1000) // Delay to show final board state

      return () => clearTimeout(timer)
    }
  }, [isGameOver, isWon, gameEnded, endGameSession])

  // Обработчик окончания времени
  const handleTimeUp = useCallback(() => {
    console.log('Time is up!')
    endGameSession()
  }, [endGameSession])

  const handleCloseEndModal = () => {
    setShowEndModal(false)
    navigate('/work')
  }

  const handleNewGame = useCallback(async () => {
    if (!workName) {
      console.error('Work name not available for new game')
      navigate('/work')
      return
    }

    console.log('Starting new game session for work:', workName)

    try {
      // Запускаем новую работу
      const newTransactionId = await startWork(workName)

      if (!newTransactionId) {
        console.error('Failed to start new work session')
        navigate('/work')
        return
      }

      console.log('New work session started with transaction ID:', newTransactionId)

      // Закрываем модальное окно
      setShowEndModal(false)

      // Сбрасываем состояние игры
      setGameEnded(false)
      setEarnedAmount(null)
      setTransactionId(newTransactionId)

      // Генерируем новый ID игры и перезапускаем игру
      const newGameId = generateGameUUID()
      setSearchParams(prev => ({
        ...Object.fromEntries(prev),
        id: newGameId,
        transactionId: newTransactionId
      }), { replace: true })

      // Инициализируем новую игру
      initGame(newGameId)

      // Сбрасываем таймер
      setTimerResetKey(prev => prev + 1)

    } catch (error) {
      console.error('Error starting new game:', error)
      navigate('/work')
    }
  }, [workName, startWork, navigate, setSearchParams, initGame])

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeaderContainer
        bankRate={user?.key_rate ? parseFloat(user.key_rate) : undefined}
        inflation={user?.inflation ? parseFloat(user.inflation) : undefined}
      />

      <GameNavigation onNewGame={handleNewGame} />

      <div className="common-game-content">
        {/* Таймер игры */}
        <GameTimer
          duration={GAME_DURATION}
          onTimeUp={handleTimeUp}
          isActive={!gameEnded && !isGameOver && !isWon}
          resetKey={timerResetKey}
        />

        <div className={styles.gameContainer}>
          <GameBoard gameEnded={gameEnded} />
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
        onNewGame={handleNewGame}
      />
    </div>
  )
}