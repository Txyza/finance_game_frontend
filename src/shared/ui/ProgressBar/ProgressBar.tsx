import { FC, memo, useMemo } from 'react'
import styles from './ProgressBar.module.css'

interface ProgressBarProps {
  current: number
  max: number
  variant?: 'mint' | 'violet' | 'raspberry'
  size?: 'small' | 'medium' | 'large'
  showText?: boolean
  className?: string
}

export const ProgressBar: FC<ProgressBarProps> = memo(({
  current,
  max,
  variant = 'mint',
  size = 'medium',
  showText = false,
  className = ''
}) => {
  // Мемоизируем вычисления для предотвращения ненужных перерендеров
  const percentage = useMemo(() =>
    Math.min(Math.max((current / max) * 100, 0), 100),
    [current, max]
  )

  const classNames = useMemo(() => [
    styles.progressBar,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' '), [variant, size, className])

  const progressText = useMemo(() => `${current}/${max}`, [current, max])

  const fillStyle = useMemo(() => ({ width: `${percentage}%` }), [percentage])

  return (
    <div className={classNames}>
      <div
        className={styles.fill}
        style={fillStyle}
      />
      {showText && (
        <span className={styles.text}>
          {progressText}
        </span>
      )}
    </div>
  )
})

ProgressBar.displayName = 'ProgressBar'