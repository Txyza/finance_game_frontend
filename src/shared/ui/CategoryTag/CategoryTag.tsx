import React from 'react'
import styles from './CategoryTag.module.css'

interface CategoryTagProps {
  icon: string
  name: string
  amount: number
  color: string
  onClick?: () => void
  className?: string
}

export const CategoryTag: React.FC<CategoryTagProps> = ({
  icon,
  name,
  amount,
  color,
  onClick,
  className
}) => {
  const formatAmount = (amount: number) => {
    return `${amount.toLocaleString('ru-RU')} ₽`
  }

  return (
    <div
      className={`${styles.categoryTag} ${className || ''}`}
      onClick={onClick}
      style={{ '--category-color': color } as React.CSSProperties}
    >
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          {icon}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.name}>
          {name}
        </div>
        <div className={styles.amount}>
          {formatAmount(amount)}
        </div>
      </div>
    </div>
  )
}