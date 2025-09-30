import { FC, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser, useDeposits } from '@shared/hooks'
import styles from './DepositsCreatePage.module.css'

type PaymentMethod = 'endOfTerm' | 'monthlyCapitalized' | 'monthlyToAccount'

interface DepositType {
  id: string
  name: string
  description: string
  rates: {
    [key: number]: {
      endOfTerm: number
      monthlyCapitalized: number
      monthlyToAccount: number
    }
  }
}

export const DepositsCreatePage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useUser()
  const { createDeposit, error } = useDeposits()
  const [isCreating, setIsCreating] = useState(false)

  const keyRate = parseFloat(user?.key_rate || '8.5')
  const depositTypeId = searchParams.get('type') || 'save'
  const amount = searchParams.get('amount') || ''
  const term = parseInt(searchParams.get('term') || '4')
  const paymentMethod = (searchParams.get('method') || 'endOfTerm') as PaymentMethod

  const depositTypes: Record<string, DepositType> = useMemo(() => ({
    save: {
      id: 'save',
      name: 'Вклад «Копить»',
      description: 'Без пополнения и снятия',
      rates: {
        1: { endOfTerm: keyRate - 0.5, monthlyCapitalized: keyRate - 0.7, monthlyToAccount: keyRate - 0.8 },
        2: { endOfTerm: keyRate - 0.8, monthlyCapitalized: keyRate - 1, monthlyToAccount: keyRate - 1 },
        3: { endOfTerm: keyRate - 1.0, monthlyCapitalized: keyRate - 1.2, monthlyToAccount: keyRate - 1.3 },
        6: { endOfTerm: keyRate - 1.2, monthlyCapitalized: keyRate - 1.5, monthlyToAccount: keyRate - 1.5 },
        8: { endOfTerm: keyRate - 2.3, monthlyCapitalized: keyRate - 2.6, monthlyToAccount: keyRate - 2.7 },
        10: { endOfTerm: keyRate - 2.6, monthlyCapitalized: keyRate - 2.9, monthlyToAccount: keyRate - 3 },
        12: { endOfTerm: keyRate - 3.5, monthlyCapitalized: keyRate - 3.8, monthlyToAccount: keyRate - 3.9 }
      }
    },
    plus: {
      id: 'plus',
      name: 'Вклад «В плюсе»',
      description: 'Без пополнения и снятия',
      rates: {
        1: { endOfTerm: keyRate - 0.6, monthlyCapitalized: keyRate - 0.8, monthlyToAccount: keyRate - 1.0 },
        2: { endOfTerm: keyRate - 0.85, monthlyCapitalized: keyRate - 1, monthlyToAccount: keyRate - 1.2 },
        3: { endOfTerm: keyRate - 0.9, monthlyCapitalized: keyRate - 1.1, monthlyToAccount: keyRate - 1.3 },
        6: { endOfTerm: keyRate - 0.7, monthlyCapitalized: keyRate - 0.8, monthlyToAccount: keyRate - 1 },
        8: { endOfTerm: keyRate - 2, monthlyCapitalized: keyRate - 2.2, monthlyToAccount: keyRate - 2.4 },
        10: { endOfTerm: keyRate - 2.1, monthlyCapitalized: keyRate - 2.4, monthlyToAccount: keyRate - 2.6 },
        12: { endOfTerm: keyRate - 3.2, monthlyCapitalized: keyRate - 3.4, monthlyToAccount: keyRate - 3.5 }
      }
    }
  }), [keyRate])

  const selectedDeposit = depositTypes[depositTypeId]

  const calculatedData = useMemo(() => {
    if (!amount || !selectedDeposit || !selectedDeposit.rates[term]) {
      return { total: 0, income: 0, rate: 0 }
    }

    const principal = parseInt(amount)
    const weeklyRate = selectedDeposit.rates[term][paymentMethod] / 100 / 52 // Годовая ставка -> недельная
    const termInWeeks = term

    let total = 0
    let income = 0

    if (paymentMethod === 'endOfTerm') {
      // Простые проценты с еженедельным начислением
      income = principal * weeklyRate * termInWeeks
      total = principal + income
    } else if (paymentMethod === 'monthlyCapitalized') {
      // Ежемесячная капитализация с еженедельным начислением
      let currentBalance = principal
      let accumulatedIncome = 0

      // Рассчитываем по неделям
      for (let week = 1; week <= termInWeeks; week++) {
        const weekIncome = currentBalance * weeklyRate
        accumulatedIncome += weekIncome

        // В конце каждого месяца (каждые 4 недели) капитализируем
        if (week % 4 === 0 || week === termInWeeks) {
          currentBalance += accumulatedIncome
          if (week !== termInWeeks) {
            accumulatedIncome = 0 // Сбрасываем накопленный доход после капитализации
          }
        }
      }

      total = currentBalance
      income = total - principal
    } else { // monthlyToAccount
      // Ежемесячная выплата на счет с еженедельным начислением
      // Доход каждую неделю с основной суммы
      income = principal * weeklyRate * termInWeeks
      total = principal + income
    }

    return {
      total: Math.round(total),
      income: Math.round(income),
      rate: selectedDeposit.rates[term][paymentMethod]
    }
  }, [amount, selectedDeposit, term, paymentMethod])

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const getPaymentMethodName = (method: PaymentMethod) => {
    switch (method) {
      case 'endOfTerm':
        return 'В конце срока'
      case 'monthlyCapitalized':
        return 'Ежемесячно с капитализацией'
      case 'monthlyToAccount':
        return 'Ежемесячно на счет'
    }
  }

  const getTermText = (weeks: number) => {
    if (weeks === 1) return '1 неделя'
    if (weeks < 5) return `${weeks} недели`
    return `${weeks} недель`
  }

  const handleCreate = async () => {
    setIsCreating(true)

    try {
      // Преобразуем метод выплаты в формат API
      const apiPaymentMethod = paymentMethod === 'endOfTerm' ? 'at_end' :
                               paymentMethod === 'monthlyCapitalized' ? 'monthly_capitalized' :
                               'monthly_to_account'

      // Определяем правильное имя депозита для API
      const apiDepositName = depositTypeId === 'save' ? 'kopit' :
                             depositTypeId === 'plus' ? 'v_pluse' :
                             selectedDeposit.name

      // Вызываем API для создания депозита
      const result = await createDeposit({
        deposit_name: apiDepositName,
        amount: parseInt(amount),
        term_days: term * 7, // Конвертируем недели в дни для API
        interest_rate: calculatedData.rate,
        interest_payment_method: apiPaymentMethod
      })

      if (result) {
        // Переходим на страницу успеха с данными депозита
        const searchQuery = new URLSearchParams({
          id: result.deposit_id,
          account_number: result.account_number,
          type: depositTypeId,
          amount: amount,
          term: term.toString(),
          method: paymentMethod,
          rate: calculatedData.rate.toString(),
          income: calculatedData.income.toString(),
          total: calculatedData.total.toString()
        }).toString()

        navigate(`/deposits/success?${searchQuery}`)
      }
    } catch (err) {
      console.error('Ошибка при создании депозита:', err)
    } finally {
      setIsCreating(false)
    }
  }

  const handleBack = () => {
    const searchQuery = new URLSearchParams({
      type: depositTypeId,
      amount: amount,
      term: term.toString(),
      method: paymentMethod
    }).toString()

    navigate(`/deposits/calculator?${searchQuery}`)
  }

  if (!selectedDeposit || !amount) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Недостаточно данных</h2>
              <Button onClick={() => navigate('/deposits/select')}>
                Начать сначала
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />
      <GameHeaderContainer />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Button
              variant="outline"
              size="small"
              onClick={handleBack}
              disabled={isCreating}
            >
              ← Назад
            </Button>

            <h1 className={styles.title}>Подтверждение вклада</h1>
          </div>

          <div className={styles.confirmationCard}>
            <div className={styles.depositInfo}>
              <h2 className={styles.depositName}>{selectedDeposit.name}</h2>
              <p className={styles.depositDescription}>{selectedDeposit.description}</p>
            </div>

            <div className={styles.details}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Сумма вклада</span>
                  <span className={styles.detailValue}>{formatAmount(parseInt(amount))} ₽</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Срок размещения</span>
                  <span className={styles.detailValue}>{getTermText(term)}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Процентная ставка</span>
                  <span className={styles.detailValue}>{calculatedData.rate.toFixed(1)}% годовых</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Выплата процентов</span>
                  <span className={styles.detailValue}>{getPaymentMethodName(paymentMethod)}</span>
                </div>
              </div>

              <div className={styles.incomeSection}>
                <h3 className={styles.incomeTitle}>Ваш доход</h3>
                <div className={styles.incomeGrid}>
                  <div className={styles.incomeItem}>
                    <span className={styles.incomeLabel}>Доход по вкладу</span>
                    <span className={styles.incomeValue}>+{formatAmount(calculatedData.income)} ₽</span>
                  </div>
                  <div className={styles.incomeItem}>
                    <span className={styles.incomeLabel}>К получению</span>
                    <span className={styles.totalValue}>{formatAmount(calculatedData.total)} ₽</span>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.terms}>
              <h4 className={styles.termsTitle}>Условия вклада</h4>
              <ul className={styles.termsList}>
                <li>Досрочное расторжение возможно в любой момент</li>
                <li>При досрочном расторжении проценты рассчитываются по ставке 0,01% годовых</li>
                <li>Пополнение вклада не предусмотрено</li>
                <li>Частичное снятие средств не предусмотрено</li>
                <li>Автоматическое продление на тот же срок при окончании</li>
              </ul>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="large"
                onClick={handleCreate}
                disabled={isCreating}
                style={{ width: '100%' }}
              >
                {isCreating ? 'Открываем вклад...' : 'Открыть вклад'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}