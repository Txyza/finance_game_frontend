import { FC } from 'react'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  current: number
  max: number
  variant?: 'mint' | 'violet' | 'raspberry'
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  className?: string
}

export const ProgressBar: FC<ProgressBarProps> = ({
  current,
  max,
  variant = 'mint',
  size = 'medium',
  showText = false,
  className = ''
}) => {
  const percentage = Math.min(Math.max((current / max) * 100, 0), 100)

  const classNames = [
    styles.progressBar,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={classNames}>
      <div
        className={styles.fill}
        style={{ width: `${percentage}%` }}
      />
      {showText && (
        <span className={styles.text}>
          {current}/{max}
        </span>
      )}
    </div>
  )
}