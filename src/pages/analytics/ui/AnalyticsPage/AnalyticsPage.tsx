import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MonthSelector,
  CategoryProgressBar,
  AnalyticsCard,
  TransactionItem,
  ExpandableAnalyticsCard,
  ParticleBackground
} from '@shared/ui'
import { GameHeaderContainer } from '@shared/ui'
import { useTransactions, useAnalyticsSummary } from '@shared/hooks'
import { Transaction, AnalyticsSummaryCategory } from '@shared/api'
import { groupTransactionsByDate } from '@shared/lib/utils/dateUtils'
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
  const [expandedCard, setExpandedCard] = useState<'expenses' | 'income' | 'assets' | 'liabilities' | null>(null)
  const { transactions, loading, error, hasMore, loadMoreTransactions, refreshTransactions } = useTransactions()
  const { summary, loading: summaryLoading, error: summaryError } = useAnalyticsSummary()

  // Получаем категории из API или используем заглушки
  const expenseCategories: CategoryData[] = useMemo(() => {
    if (summary?.expenses?.categories) {
      return summary.expenses.categories.map(cat => ({
        name: cat.name,
        amount: cat.amount,
        color: cat.color || '#58ffff',
        percentage: cat.percentage || Math.round((cat.amount / (summary.expenses?.total || 1)) * 100)
      }))
    }
    return []
  }, [summary])

  const incomeCategories: CategoryData[] = useMemo(() => {
    if (summary?.income?.categories) {
      return summary.income.categories.map(cat => ({
        name: cat.name,
        amount: cat.amount,
        color: cat.color || '#4caf50',
        percentage: cat.percentage || Math.round((cat.amount / (summary.income?.total || 1)) * 100)
      }))
    }
    return []
  }, [summary])

  const assetsCategories: CategoryData[] = useMemo(() => {
    if (summary?.assets?.categories) {
      return summary.assets.categories.map(cat => ({
        name: cat.name,
        amount: cat.amount,
        color: cat.color || '#2196f3',
        percentage: cat.percentage || Math.round((cat.amount / (summary.assets?.total || 1)) * 100)
      }))
    }
    return []
  }, [summary])

  const liabilitiesCategories: CategoryData[] = useMemo(() => {
    if (summary?.liabilities?.categories) {
      return summary.liabilities.categories.map(cat => ({
        name: cat.name,
        amount: cat.amount,
        color: cat.color || '#f44336',
        percentage: cat.percentage || Math.round((cat.amount / (summary.liabilities?.total || 1)) * 100)
      }))
    }
    return []
  }, [summary])

  // Функция для получения иконки транзакции
  const getTransactionIcon = (transaction: Transaction): string => {
    const { type, name } = transaction

    // По типу транзакции
    if (type === 'bank') return '🏦'
    if (type === 'transfer') return '🔄'
    if (type === 'income') return '💰'

    // По названию
    if (name.toLowerCase().includes('зарплата')) return '💰'
    if (name.toLowerCase().includes('перевод')) return '🔄'
    if (name.toLowerCase().includes('магазин') || name.toLowerCase().includes('супермаркет')) return '🛒'
    if (name.toLowerCase().includes('ресторан') || name.toLowerCase().includes('кафе')) return '🍽️'
    if (name.toLowerCase().includes('бензин') || name.toLowerCase().includes('заправка')) return '⛽'
    if (name.toLowerCase().includes('аптека')) return '💊'

    return '📊'
  }

  // Группируем транзакции по датам
  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(transactions)
  }, [transactions])

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

  const assetsSegments: ChartSegment[] = assetsCategories.map(cat => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    color: cat.color,
    icon: getIconForCategory(cat.name)
  }))

  const liabilitiesSegments: ChartSegment[] = liabilitiesCategories.map(cat => ({
    name: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    color: cat.color,
    icon: getIconForCategory(cat.name)
  }))

  function getIconForCategory(category: string): string {
    const lowerCategory = category.toLowerCase()

    // По типам транзакций
    if (lowerCategory.includes('перевод')) return '🔄'
    if (lowerCategory.includes('супермаркет') || lowerCategory.includes('магазин')) return '🛒'
    if (lowerCategory.includes('фастфуд') || lowerCategory.includes('ресторан') || lowerCategory.includes('кафе')) return '🍔'
    if (lowerCategory.includes('маркетплейс') || lowerCategory.includes('wildberries') || lowerCategory.includes('ozon')) return '🛍️'
    if (lowerCategory.includes('зарплата')) return '💰'
    if (lowerCategory.includes('фриланс')) return '💻'

    // Инвестиции и финансы
    if (lowerCategory.includes('депозит')) return '🏦'
    if (lowerCategory.includes('акци')) return '📈'
    if (lowerCategory.includes('облигаци')) return '📄'
    if (lowerCategory.includes('крипто')) return '₿'

    // Кредиты и долги
    if (lowerCategory.includes('ипотека')) return '🏠'
    if (lowerCategory.includes('автокредит') || lowerCategory.includes('авто')) return '🚗'
    if (lowerCategory.includes('кредит')) return '💳'

    // Транспорт
    if (lowerCategory.includes('такси')) return '🚖'
    if (lowerCategory.includes('каршеринг')) return '🚙'
    if (lowerCategory.includes('бензин') || lowerCategory.includes('заправка')) return '⛽'

    // Услуги
    if (lowerCategory.includes('связь') || lowerCategory.includes('телефон')) return '📱'
    if (lowerCategory.includes('интернет')) return '🌐'
    if (lowerCategory.includes('подписк')) return '📺'

    // Здоровье
    if (lowerCategory.includes('аптека')) return '💊'
    if (lowerCategory.includes('медицин') || lowerCategory.includes('клиник')) return '🏥'

    // Развлечения
    if (lowerCategory.includes('кино')) return '🎬'
    if (lowerCategory.includes('игр')) return '🎮'
    if (lowerCategory.includes('спорт')) return '⚽'

    // Остальное
    if (lowerCategory.includes('остальное') || lowerCategory.includes('прочее')) return '•••'
    if (lowerCategory.includes('нко')) return '🏛️'

    return '📊'
  }

  const totalExpenses = summary?.expenses?.total || 0
  const totalIncome = summary?.income?.total || 0
  const totalAssets = summary?.assets?.total || 0
  const totalLiabilities = summary?.liabilities?.total || 0

  const handleCardClick = (type: 'expenses' | 'income' | 'assets' | 'liabilities') => {
    setExpandedCard(expandedCard === type ? null : type)
  }

  const handleExpandedCardClick = (type: 'expenses' | 'income' | 'assets' | 'liabilities') => {
    setExpandedCard(null)
  }

  const handleMonthClear = () => {
    setSelectedMonth(null)
  }

  const handleMonthSelect = () => {
    // В реальном приложении здесь был бы селектор месяца
    console.log('Open month selector')
  }

  const handleTransactionClick = (transaction: Transaction) => {
    console.log('Transaction clicked:', transaction.name)
  }

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      loadMoreTransactions()
    }
  }, [hasMore, loading, loadMoreTransactions])



  return (
    <div className="common-page-background">
      <ParticleBackground />

      <GameHeaderContainer />

      <div className="common-content">
        <div className={styles.container}>
          {/* Раздел Инструменты */}
          <div className={styles.toolsSection}>
            <h1 className={styles.title}>Инструменты</h1>

            {/* Развернутая карточка для инструментов */}
            {(expandedCard === 'assets' || expandedCard === 'liabilities') ? (
              <div className={styles.expandedCardContainer}>
                {expandedCard === 'assets' && (
                  <ExpandableAnalyticsCard
                    amount={totalAssets}
                    type="assets"
                    segments={assetsSegments}
                    onClose={() => setExpandedCard(null)}
                    onClick={() => handleExpandedCardClick('assets')}
                  />
                )}
                {expandedCard === 'liabilities' && (
                  <ExpandableAnalyticsCard
                    amount={totalLiabilities}
                    type="liabilities"
                    segments={liabilitiesSegments}
                    onClose={() => setExpandedCard(null)}
                    onClick={() => handleExpandedCardClick('liabilities')}
                  />
                )}
              </div>
            ) : (
              /* Обычные карточки инструментов - показываем всегда когда не развернуты карточки инструментов */
              (!['assets', 'liabilities'].includes(expandedCard as string)) && (
                <div className={styles.analyticsGrid}>
                  <AnalyticsCard
                    amount={totalAssets}
                    type="assets"
                    categories={assetsCategories}
                    onClick={() => handleCardClick('assets')}
                  />
                  <AnalyticsCard
                    amount={totalLiabilities}
                    type="liabilities"
                    categories={liabilitiesCategories}
                    onClick={() => handleCardClick('liabilities')}
                  />
                </div>
              )
            )}
          </div>

          {/* Раздел Операции */}
          <div className={styles.operationsSection}>
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
            {(expandedCard !== 'expenses' && expandedCard !== 'income') && (
              // Показываем обе обычные карточки в ряд только если не развернута карточка операций
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
          </div>

          {/* Развернутая карточка операций */}
          {(expandedCard === 'expenses' || expandedCard === 'income') && (
            <div className={styles.expandedCardContainer}>
              {expandedCard === 'expenses' && (
                <ExpandableAnalyticsCard
                  amount={totalExpenses}
                  type="expenses"
                  segments={expenseSegments}
                  onClose={() => setExpandedCard(null)}
                  onClick={() => handleExpandedCardClick('expenses')}
                />
              )}
              {expandedCard === 'income' && (
                <ExpandableAnalyticsCard
                  amount={totalIncome}
                  type="income"
                  segments={incomeSegments}
                  onClose={() => setExpandedCard(null)}
                  onClick={() => handleExpandedCardClick('income')}
                />
              )}
            </div>
          )}

          {/* Список транзакций - показываем всегда */}
          <div className={styles.transactionsSection}>
            {loading && transactions.length === 0 ? (
              <div className={styles.loadingState}>Загрузка транзакций...</div>
            ) : error ? (
              <div className={styles.errorState}>
                <div>Ошибка загрузки транзакций: {error.message}</div>
                <button onClick={refreshTransactions} className={styles.retryButton}>
                  Попробовать еще раз
                </button>
              </div>
            ) : groupedTransactions.length === 0 ? (
              <div className={styles.emptyState}>Транзакции не найдены</div>
            ) : (
              groupedTransactions.map((group) => (
                <div key={group.date} className={styles.transactionGroup}>
                  <h2 className={styles.sectionTitle}>{group.date}</h2>
                  <div className={styles.transactionsList}>
                    {group.transactions.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        icon={getTransactionIcon(transaction)}
                        name={transaction.name}
                        category={transaction.type}
                        amount={transaction.amount}
                        isPositive={transaction.amount > 0}
                        onClick={() => handleTransactionClick(transaction)}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}

            {/* Кнопка загрузки еще */}
            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={styles.loadMoreButton}
                >
                  {loading ? 'Загрузка...' : 'Загрузить еще'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}