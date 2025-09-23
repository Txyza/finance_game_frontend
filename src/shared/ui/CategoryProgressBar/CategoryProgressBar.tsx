import React from 'react'
import styles from './CategoryProgressBar.module.css'

interface CategoryData {
  name: string
  amount: number
  color: string
  percentage: number
}

interface CategoryProgressBarProps {
  categories: CategoryData[]
  className?: string
}

export const CategoryProgressBar: React.FC<CategoryProgressBarProps> = ({
  categories,
  className
}) => {
  return (
    <div className={`${styles.progressBar} ${className || ''}`}>
      {categories.map((category, index) => (
        <div
          key={`${category.name}-${index}`}
          className={styles.segment}
          style={{
            width: `${category.percentage}%`,
            backgroundColor: category.color
          }}
          title={`${category.name}: ${category.amount.toLocaleString('ru-RU')} ₽`}
        />
      ))}
    </div>
  )
}