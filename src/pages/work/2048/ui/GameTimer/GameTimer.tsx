import React, { useEffect, useState } from 'react'
import styles from './GameTimer.module.css'

interface GameTimerProps {
  duration: number // Duration in seconds
  onTimeUp: () => void
  isActive: boolean
}

export const GameTimer: React.FC<GameTimerProps> = ({ duration, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (!isActive) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isActive, onTimeUp])

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