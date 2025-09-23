import React from 'react'
import styles from './TransactionItem.module.css'

interface TransactionItemProps {
  icon: string
  name: string
  category: string
  amount: number
  isPositive?: boolean
  onClick?: () => void
  className?: string
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  icon,
  name,
  category,
  amount,
  isPositive = false,
  onClick,
  className
}) => {
  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toLocaleString('ru-RU')
    return isPositive ? `+${formatted} ₽` : `-${formatted} ₽`
  }

  return (
    <div
      className={`${styles.transactionItem} ${className || ''}`}
      onClick={onClick}
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
        <div className={styles.category}>
          {category}
        </div>
      </div>

      <div className={`${styles.amount} ${isPositive ? styles.positive : styles.negative}`}>
        {formatAmount(amount)}
      </div>
    </div>
  )
}