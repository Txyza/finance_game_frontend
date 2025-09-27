import React, { useEffect, useState, useRef } from 'react'
import styles from './GameTimer.module.css'

interface GameTimerProps {
  duration: number // Duration in seconds
  onTimeUp: () => void
  isActive: boolean
  resetKey?: string | number // Ключ для принудительного сброса таймера
}

export const GameTimer: React.FC<GameTimerProps> = ({ duration, onTimeUp, isActive, resetKey }) => {
  const [timeLeft, setTimeLeft] = useState(duration)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hasCalledOnTimeUp = useRef(false)

  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // Инициализируем время начала только один раз
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now()
      hasCalledOnTimeUp.current = false
    }

    // Создаем асинхронный таймер на основе реального времени
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return

      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      const remaining = Math.max(0, duration - elapsed)

      setTimeLeft(remaining)

      if (remaining <= 0 && !hasCalledOnTimeUp.current) {
        hasCalledOnTimeUp.current = true
        onTimeUp()
      }
    }, 100) // Обновляем каждые 100ms для плавности

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isActive, duration, onTimeUp])

  // Сброс таймера при изменении duration или resetKey
  useEffect(() => {
    startTimeRef.current = null
    hasCalledOnTimeUp.current = false
    setTimeLeft(duration)
  }, [duration, resetKey])

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage for visual indicator
  const progress = ((duration - timeLeft) / duration) * 100

  return (
    <div className={styles.timer}>
      <div className={styles.timerDisplay}>
        <span className={styles.timeText}>⏱️ {formatTime(timeLeft)}</span>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}