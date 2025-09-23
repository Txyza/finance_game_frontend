import React from 'react'
import { PieChart, ChartSegment } from '../PieChart'
import { CategoryTag } from '../CategoryTag'
import styles from './ExpandableAnalyticsCard.module.css'

interface ExpandableAnalyticsCardProps {
  amount: number
  type: 'expenses' | 'income'
  segments: ChartSegment[]
  onClose: () => void
  onClick?: () => void
  className?: string
}

export const ExpandableAnalyticsCard: React.FC<ExpandableAnalyticsCardProps> = ({
  amount,
  type,
  segments,
  onClose,
  onClick,
  className
}) => {
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU')
  }

  const typeText = type === 'expenses' ? 'Траты' : 'Доходы'

  const handleCardClick = (e: React.MouseEvent) => {
    // Не срабатывает при клике на кнопку закрытия или теги категорий
    if ((e.target as HTMLElement).closest('.close-button, .category-tag')) {
      return
    }
    onClick?.()
  }

  return (
    <div
      className={`${styles.expandedCard} ${className || ''}`}
      onClick={handleCardClick}
    >
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <div className={styles.amount}>
            {formatAmount(amount)} ₽
          </div>
          <div className={styles.type}>
            {typeText}
          </div>
        </div>

        <button
          className={`${styles.closeButton} close-button`}
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
          type="button"
        >
          ×
        </button>
      </div>

      <div className={styles.chartContainer}>
        <PieChart
          segments={segments}
          size={180}
          strokeWidth={16}
        />
      </div>

      <div className={styles.categoriesGrid}>
        {segments.map((segment, index) => (
          <div key={`${segment.name}-${index}`} className="category-tag">
            <CategoryTag
              icon={segment.icon || '📊'}
              name={segment.name}
              amount={segment.value}
              color={segment.color}
            />
          </div>
        ))}
      </div>
    </div>
  )
}