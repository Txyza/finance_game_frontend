import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useMemoryGameStore, generateGameUUID } from '../../model/gameStore'
import { GameHeaderContainer } from '@shared/ui'
import { useWork } from '@shared/hooks'
import { useUserContext } from '@shared/context'
import { MemoryNavigation } from '../MemoryNavigation/MemoryNavigation'
import { MemoryBoard } from '../MemoryBoard/MemoryBoard'
import { MemoryEndModal } from '../MemoryEndModal/MemoryEndModal'
import { ParticleBackground } from '../../../../../shared/ui'
import styles from './MemoryPage.module.css'

export const MemoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { initGame, isGameEnded, score, setMultiplier } = useMemoryGameStore()
  const { stopWorkWithTransactionId, startWork, workList } = useWork()
  const { user, refetchUser } = useUserContext()
  const [showEndModal, setShowEndModal] = useState(false)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [gameEnded, setGameEnded] = useState(false)
  const [earnedAmount, setEarnedAmount] = useState<number | null>(null)
  const [workName, setWorkName] = useState<string | null>(null)

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

  // Определяем имя работы для игры память
  useEffect(() => {
    if (workList?.works) {
      const workMemory = workList.works.find(work =>
        work.name.toLowerCase().includes('память') ||
        work.name.toLowerCase().includes('memory') ||
        work.name.toLowerCase().includes('карта')
      )
      if (workMemory) {
        setWorkName(workMemory.name)
        // Устанавливаем multiplier для расчета заработанных денег
        setMultiplier(workMemory.amount_booster)
      }
    }
  }, [workList, setMultiplier])

  // Функция завершения игры
  const endGameSession = useCallback(async () => {
    if (gameEnded || !transactionId) return

    setGameEnded(true)

    console.log('Ending memory game with score:', score)

    try {
      const reward = await stopWorkWithTransactionId(transactionId, score)
      if (reward) {
        console.log('Memory game completed, reward received:', reward.amount)
        setEarnedAmount(reward.amount)
        // Обновляем данные пользователя
        await refetchUser()
      }
    } catch (error) {
      console.error('Failed to end memory game session:', error)
      setEarnedAmount(0) // Показываем 0 при ошибке
    }

    setShowEndModal(true)
  }, [gameEnded, transactionId, score, stopWorkWithTransactionId, refetchUser])

  useEffect(() => {
    // End game session when game ends
    if (isGameEnded && !gameEnded) {
      const timer = setTimeout(() => {
        endGameSession()
      }, 1000) // Delay to show final board state

      return () => clearTimeout(timer)
    }
  }, [isGameEnded, gameEnded, endGameSession])

  const handleCloseEndModal = () => {
    setShowEndModal(false)
    navigate('/work')
  }

  const handleNewGame = useCallback(async () => {
    if (!workName) {
      console.error('Work name not available for new memory game')
      navigate('/work')
      return
    }

    console.log('Starting new memory game session for work:', workName)

    try {
      // Запускаем новую работу
      const newTransactionId = await startWork(workName)

      if (!newTransactionId) {
        console.error('Failed to start new memory work session')
        navigate('/work')
        return
      }

      console.log('New memory work session started with transaction ID:', newTransactionId)

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

    } catch (error) {
      console.error('Error starting new memory game:', error)
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

      <MemoryNavigation onNewGame={handleNewGame} />

      <div className="common-game-content">
        <div className={styles.gameContainer}>
          <MemoryBoard gameEnded={gameEnded} />
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
        earnedAmount={earnedAmount}
        onNewGame={handleNewGame}
      />
    </div>
  )
}