import React from 'react'
import styles from './PeriodSelector.module.css'

export type Period = 'week' | 'month' | 'year'

interface PeriodSelectorProps {
  selectedPeriod: Period
  onPeriodChange: (period: Period) => void
  className?: string
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
  className
}) => {
  const periods: { key: Period; label: string }[] = [
    { key: 'week', label: 'Нед' },
    { key: 'month', label: 'Мес' },
    { key: 'year', label: 'Год' }
  ]

  return (
    <div className={`${styles.periodSelector} ${className || ''}`}>
      {periods.map((period) => (
        <button
          key={period.key}
          className={`${styles.periodButton} ${
            selectedPeriod === period.key ? styles.active : ''
          }`}
          onClick={() => onPeriodChange(period.key)}
          type="button"
        >
          {period.label}
        </button>
      ))}
    </div>
  )
}