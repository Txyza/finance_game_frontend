import { FC, ReactNode } from 'react'
import styles from './Badge.module.css'

interface BadgeProps {
  count: number
  children: ReactNode
  variant?: 'red' | 'blue' | 'green'
  size?: 'small' | 'medium'
  maxCount?: number
}

export const Badge: FC<BadgeProps> = ({
  count,
  children,
  variant = 'red',
  size = 'medium',
  maxCount = 99
}) => {
  const shouldShow = count > 0
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  const badgeClass = [
    styles.badge,
    styles[variant],
    styles[size]
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.container}>
      {children}
      {shouldShow && (
        <span className={badgeClass}>
          {displayCount}
        </span>
      )}
    </div>
  )
}