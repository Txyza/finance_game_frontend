import React from 'react'
import { CategoryProgressBar } from '../CategoryProgressBar'
import styles from './AnalyticsCard.module.css'

interface CategoryData {
  name: string
  amount: number
  color: string
  percentage: number
}

interface AnalyticsCardProps {
  amount: number
  type: 'expenses' | 'income'
  categories: CategoryData[]
  onClick?: () => void
  className?: string
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  amount,
  type,
  categories,
  onClick,
  className
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU')
  }

  const typeText = type === 'expenses' ? 'Траты' : 'Доходы'

  return (
    <div
      className={`${styles.card} ${className || ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles.amount}>
          {formatAmount(amount)} ₽
        </div>
        <div className={styles.type}>
          {typeText}
        </div>
      </div>

      <div className={styles.progressContainer}>
        <CategoryProgressBar categories={categories} />
      </div>
    </div>
  )
}