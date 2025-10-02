import { FC, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './FeatureLockedTooltip.module.css'

interface FeatureLockedTooltipProps {
  message: string
  onClose: () => void
  duration?: number
}

export const FeatureLockedTooltip: FC<FeatureLockedTooltipProps> = ({
  message,
  onClose,
  duration = 1000
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])

  return createPortal(
    <div className={styles.tooltip}>
      <span className={styles.icon}>🔒</span>
      <p className={styles.message}>{message}</p>
    </div>,
    document.body
  )
}