import { FC, ReactNode, memo, useMemo, useCallback } from 'react'
import styles from './Bubble.module.css'

interface BubbleProps {
  variant?: 'primary' | 'mint' | 'raspberry' | 'violet' | 'black' | 'outline' | 'gradient-mint' | 'gradient-raspberry'
  size?: 'small' | 'medium' | 'large'
  children: ReactNode
  icon?: ReactNode
  onClick?: () => void
  className?: string
  addButton?: {
    onClick: () => void
  }
}

export const Bubble: FC<BubbleProps> = memo(({
  variant = 'primary',
  size = 'medium',
  children,
  icon,
  onClick,
  className = '',
  addButton
}) => {
  // Мемоизируем classNames чтобы избежать ненужных перерендеров
  const classNames = useMemo(() => [
    styles.bubble,
    styles[variant],
    styles[size],
    (onClick || addButton) && styles.clickable,
    addButton && styles.withAddButton,
    className
  ].filter(Boolean).join(' '), [variant, size, onClick, addButton, className])

  const Component = (onClick || addButton) ? 'button' : 'div'

  // Мемоизируем обработчик клика
  const handleClick = useCallback(() => {
    if (addButton) {
      addButton.onClick()
    } else if (onClick) {
      onClick()
    }
  }, [addButton, onClick])

  return (
    <Component className={classNames} onClick={handleClick}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>
      {addButton && (
        <span className={styles.addButton}>
          +
        </span>
      )}
    </Component>
  )
})

Bubble.displayName = 'Bubble'