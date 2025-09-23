import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MonthSelector,
  CategoryProgressBar,
  AnalyticsCard,
  TransactionItem,
  ExpandableAnalyticsCard,
  ParticleBackground
} from '@shared/ui'
import { GameHeader } from '@shared/ui'
import styles from './AnalyticsPage.module.css'

type Period = 'week' | 'month' | 'year'

interface CategoryData {
  name: string
  amount: number
  color: string
  percentage: number
}

interface ChartSegment {
  name: string
  value: number
  percentage: number
  color: string
  icon?: string
}

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate()
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [expandedCard, setExpandedCard] = useState<'expenses' | 'income' | null>(null)

  // Mock данные игрока
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500,
    bankRate: 8.5,
    inflation: 4.2
  }

  // Mock данные для категорий трат
  const expenseCategories: CategoryData[] = [
    { name: 'Переводы', amount: 19183, color: '#58ffff', percentage: 25 },
    { name: 'НКО', amount: 12000, color: '#ffeb3b', percentage: 15 },
    { name: 'Супермаркеты', amount: 9278, color: '#ff5722', percentage: 12 },
    { name: 'Фастфуд', amount: 9013, color: '#ff9800', percentage: 12 },
    { name: 'Маркетплейсы', amount: 6483, color: '#e91e63', percentage: 8 },
    { name: 'Остальное', amount: 22000, color: '#9e9e9e', percentage: 28 }
  ]

  // Mock данные для категорий доходов
  const incomeCategories: CategoryData[] = [
    { name: 'Зарплата', amount: 75000, color: '#4caf50', percentage: 90 },
    { name: 'Фриланс', amount: 8000, color: '#2196f3', percentage: 10 }
  ]

  // Mock данные для транзакций
  const transactions = [
    { icon: '🔄', name: 'Перевод округлений', category: 'Переводы', amount: -21.20, isPositive: false },
    { icon: '🛒', name: 'Мария РА', category: 'Супермаркеты', amount: -128.80, isPositive: false },
    { icon: '💳', name: 'Дружище А.', category: 'Переводы', amount: -2000, isPositive: false },
    { icon: '🏪', name: 'ООО "Инвест Ресторация"', category: 'Супермаркеты', amount: -479.96, isPositive: false },
    { icon: '💰', name: 'Зарплата ООО "ТЕХ"', category: 'Доходы', amount: 75000, isPositive: true },
    { icon: '🍔', name: 'McDonald\'s', category: 'Фастфуд', amount: -245.50, isPositive: false },
    { icon: '🛍️', name: 'Wildberries', category: 'Маркетплейсы', amount: -1250, isPositive: false }
  ]

  // Подготовка данных для диаграммы
  const expenseSegments: ChartSegment[] = expenseCategories.map(cat => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    color: cat.color,
    icon: getIconForCategory(cat.name)
  }))

  const incomeSegments: ChartSegment[] = incomeCategories.map(cat => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    color: cat.color,
    icon: getIconForCategory(cat.name)
  }))

  function getIconForCategory(category: string): string {
    const icons: Record<string, string> = {
      'Переводы': '🔄',
      'НКО': '?',
      'Супермаркеты': '🛒',
      'Фастфуд': '🍔',
      'Маркетплейсы': '👑',
      'Остальное': '•••',
      'Зарплата': '💰',
      'Фриланс': '💻'
    }
    return icons[category] || '📊'
  }

  const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0)
  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0)

  const handleCardClick = (type: 'expenses' | 'income') => {
    setExpandedCard(expandedCard === type ? null : type)
  }

  const handleExpandedCardClick = (type: 'expenses' | 'income') => {
    setExpandedCard(null)
  }

  const handleMonthClear = () => {
    setSelectedMonth(null)
  }

  const handleMonthSelect = () => {
    // В реальном приложении здесь был бы селектор месяца
    console.log('Open month selector')
  }

  const handleTransactionClick = (transaction: any) => {
    console.log('Transaction clicked:', transaction.name)
  }



  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeader
        level={playerStats.level}
        currentExp={playerStats.currentExp}
        maxExp={playerStats.maxExp}
        energy={playerStats.energy}
        maxEnergy={playerStats.maxEnergy}
        money={playerStats.money}
        bankRate={playerStats.bankRate}
        inflation={playerStats.inflation}
      />

      <div className="common-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Операции</h1>

            <div className={styles.filters}>
              {selectedMonth && (
                <MonthSelector
                  month={selectedMonth}
                  onClear={handleMonthClear}
                  onClick={handleMonthSelect}
                />
              )}
            </div>
          </div>

          {/* Карточки аналитики */}
          {expandedCard ? (
            // Показываем только развернутую карточку на всю ширину
            <div className={styles.expandedCardContainer}>
              {expandedCard === 'expenses' ? (
                <ExpandableAnalyticsCard
                  amount={totalExpenses}
                  type="expenses"
                  segments={expenseSegments}
                  onClose={() => setExpandedCard(null)}
                  onClick={() => handleExpandedCardClick('expenses')}
                />
              ) : (
                <ExpandableAnalyticsCard
                  amount={totalIncome}
                  type="income"
                  segments={incomeSegments}
                  onClose={() => setExpandedCard(null)}
                  onClick={() => handleExpandedCardClick('income')}
                />
              )}
            </div>
          ) : (
            // Показываем обе обычные карточки в ряд
            <div className={styles.analyticsGrid}>
              <AnalyticsCard
                amount={totalExpenses}
                type="expenses"
                categories={expenseCategories}
                onClick={() => handleCardClick('expenses')}
              />
              <AnalyticsCard
                amount={totalIncome}
                type="income"
                categories={incomeCategories}
                onClick={() => handleCardClick('income')}
              />
            </div>
          )}

          {/* Список транзакций */}
          <div className={styles.transactionsSection}>
            <h2 className={styles.sectionTitle}>Вчера</h2>
            <div className={styles.transactionsList}>
              {transactions.map((transaction, index) => (
                <TransactionItem
                  key={index}
                  icon={transaction.icon}
                  name={transaction.name}
                  category={transaction.category}
                  amount={transaction.amount}
                  isPositive={transaction.isPositive}
                  onClick={() => handleTransactionClick(transaction)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}