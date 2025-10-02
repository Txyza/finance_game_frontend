import { useState, useEffect, useCallback, useMemo } from 'react'
import { analyticsApi, AnalyticsSummaryResponse, AnalyticsSummaryCategory, ApiError } from '@shared/api'

interface ProcessedSummary {
  expenses: {
    total: number
    categories: AnalyticsSummaryCategory[]
  }
  income: {
    total: number
    categories: AnalyticsSummaryCategory[]
  }
  assets: {
    total: number
    categories: AnalyticsSummaryCategory[]
  }
  liabilities: {
    total: number
    categories: AnalyticsSummaryCategory[]
  }
}

interface UseAnalyticsSummaryState {
  summary: ProcessedSummary | null
  loading: boolean
  error: ApiError | null
}

interface UseAnalyticsSummaryActions {
  refreshSummary: () => Promise<void>
  clearError: () => void
}

type UseAnalyticsSummaryReturn = UseAnalyticsSummaryState & UseAnalyticsSummaryActions

// Функция для получения названия категории на русском
const getCategoryName = (groupName: string, itemName: string): string => {
  // Группы
  const groupNames: Record<string, string> = {
    work: 'Работа',
    bank: 'Банк',
    task: 'Задания',
    other: 'Прочее'
  }

  // Конкретные элементы
  const itemNames: Record<string, string> = {
    '2048': '2048',
    'daily_work_session': 'Ежедневная работа',
    'memory': 'Память'
  }

  // Если есть конкретное название элемента, используем его
  if (itemNames[itemName]) {
    return itemNames[itemName]
  }

  // Иначе комбинируем группу и элемент
  const groupLabel = groupNames[groupName] || groupName
  return `${groupLabel}: ${itemName}`
}

export const useAnalyticsSummary = (): UseAnalyticsSummaryReturn => {
  const [state, setState] = useState<UseAnalyticsSummaryState>({
    summary: null,
    loading: false,
    error: null
  })

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  const refreshSummary = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      console.log('useAnalyticsSummary: Fetching summary...')
      const response: AnalyticsSummaryResponse = await analyticsApi.getSummary()

      console.log('useAnalyticsSummary: Success, received summary:', response)

      // Цвета для категорий расходов
      const expenseColors = [
        '#ff5722', // оранжевый
        '#e91e63', // розовый
        '#9c27b0', // фиолетовый
        '#673ab7', // глубокий фиолетовый
        '#3f51b5', // индиго
        '#9e9e9e', // серый
      ]

      // Цвета для категорий доходов
      const incomeColors = [
        '#4caf50', // зеленый
        '#8bc34a', // светло-зеленый
        '#cddc39', // лайм
        '#00bcd4', // циан
        '#2196f3', // синий
        '#03a9f4', // светло-синий
      ]

      // Преобразуем вложенную структуру в плоский список категорий
      const processIncome = (): AnalyticsSummaryCategory[] => {
        const categories: AnalyticsSummaryCategory[] = []
        let colorIndex = 0

        Object.entries(response.income || {}).forEach(([groupName, groupData]) => {
          Object.entries(groupData).forEach(([itemName, amount]) => {
            const numAmount = typeof amount === 'number' ? amount : 0
            if (numAmount > 0) {
              categories.push({
                name: getCategoryName(groupName, itemName),
                amount: numAmount,
                color: incomeColors[colorIndex % incomeColors.length]
              })
              colorIndex++
            }
          })
        })

        return categories
      }

      const processExpenses = (): AnalyticsSummaryCategory[] => {
        const categories: AnalyticsSummaryCategory[] = []
        let colorIndex = 0

        Object.entries(response.expense || {}).forEach(([groupName, groupData]) => {
          Object.entries(groupData).forEach(([itemName, amount]) => {
            const numAmount = typeof amount === 'number' ? amount : 0
            if (numAmount > 0) {
              categories.push({
                name: getCategoryName(groupName, itemName),
                amount: numAmount,
                color: expenseColors[colorIndex % expenseColors.length]
              })
              colorIndex++
            }
          })
        })

        return categories
      }

      const incomeCategories = processIncome()
      const expenseCategories = processExpenses()

      // Считаем общие суммы
      const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.amount, 0)
      const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.amount, 0)

      // Добавляем проценты
      incomeCategories.forEach(cat => {
        cat.percentage = totalIncome > 0 ? Math.round((cat.amount / totalIncome) * 100) : 0
      })

      expenseCategories.forEach(cat => {
        cat.percentage = totalExpenses > 0 ? Math.round((cat.amount / totalExpenses) * 100) : 0
      })

      const processedSummary: ProcessedSummary = {
        income: {
          total: totalIncome,
          categories: incomeCategories
        },
        expenses: {
          total: totalExpenses,
          categories: expenseCategories
        },
        assets: {
          total: 0,
          categories: []
        },
        liabilities: {
          total: 0,
          categories: []
        }
      }

      setState(prev => ({
        ...prev,
        summary: processedSummary,
        loading: false
      }))
    } catch (error) {
      console.error('useAnalyticsSummary: Error fetching summary:', error)
      const apiError = error as ApiError
      setState(prev => ({
        ...prev,
        loading: false,
        error: apiError
      }))
    }
  }, [])

  // Загружаем сводку при монтировании хука
  useEffect(() => {
    refreshSummary()
  }, [refreshSummary])

  return {
    summary: state.summary,
    loading: state.loading,
    error: state.error,
    refreshSummary,
    clearError
  }
}