import React from 'react'
import { CategoryProgressBar } from '../CategoryProgressBar'
import { formatMoney } from '@shared/lib/formatMoney'
import styles from './AnalyticsCard.module.css'

interface CategoryData {
  name: string
  amount: number
  color: string
  percentage: number
}

interface AnalyticsCardProps {
  amount: number
  type: 'expenses' | 'income' | 'assets' | 'liabilities'
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
  const getTypeText = (type: string) => {
    switch (type) {
      case 'expenses':
        return 'Траты'
      case 'income':
        return 'Доходы'
      case 'assets':
        return 'Активы'
      case 'liabilities':
        return 'Пассивы'
      default:
        return 'Данные'
    }
  }

  const typeText = getTypeText(type)

  return (
    <div
      className={`${styles.card} ${className || ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles.amount}>
          {formatMoney(amount)} ₽
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