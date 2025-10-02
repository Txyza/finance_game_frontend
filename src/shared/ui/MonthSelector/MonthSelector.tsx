import React from 'react'
import styles from './MonthSelector.module.css'

interface MonthSelectorProps {
  month: string
  onClear?: () => void
  onClick?: () => void
  className?: string
}

export const MonthSelector: React.FC<MonthSelectorProps> = ({
  month,
  onClear,
  onClick,
  className
}) => {
  const handleClearClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClear?.()
  }

  return (
    <div
      className={`${styles.monthSelector} ${className || ''}`}
      onClick={onClick}
    >
      <span className={styles.monthText}>{month}</span>
      {onClear && (
        <button
          className={styles.clearButton}
          onClick={handleClearClick}
          type="button"
        >
          ×
        </button>
      )}
    </div>
  )
}