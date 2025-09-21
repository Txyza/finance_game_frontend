import { FC, ReactNode } from 'react'
import styles from './Bubble.module.css'

interface BubbleProps {
  variant?: 'primary' | 'mint' | 'raspberry' | 'violet' | 'black' | 'outline' | 'gradient-mint' | 'gradient-raspberry'
  size?: 'small' | 'medium' | 'large'
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

export const Bubble: FC<BubbleProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  icon,
  onClick,
  className = ''
}) => {
  const classNames = [
    styles.bubble,
    styles[variant],
    styles[size],
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ')

  const Component = onClick ? 'button' : 'div'

  return (
    <Component className={classNames} onClick={onClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>
    </Component>
  )
}