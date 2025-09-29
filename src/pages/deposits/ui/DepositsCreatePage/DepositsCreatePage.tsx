import { FC, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser } from '@shared/hooks'
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
        2: { endOfTerm: keyRate - 0.8, monthlyCapitalized: keyRate - 1, monthlyToAccount: keyRate - 1 },
        4: { endOfTerm: keyRate - 1.2, monthlyCapitalized: keyRate - 1.4, monthlyToAccount: keyRate - 1.5 },
        6: { endOfTerm: keyRate - 1.2, monthlyCapitalized: keyRate - 1.5, monthlyToAccount: keyRate - 1.5 },
        8: { endOfTerm: keyRate - 2.3, monthlyCapitalized: keyRate - 2.6, monthlyToAccount: keyRate - 2.7 },
        10: { endOfTerm: keyRate - 2.6, monthlyCapitalized: keyRate - 2.9, monthlyToAccount: keyRate - 3 },
        12: { endOfTerm: keyRate - 3.5, monthlyCapitalized: keyRate - 3.8, monthlyToAccount: keyRate - 3.9 },
        15: { endOfTerm: keyRate - 4.6, monthlyCapitalized: keyRate - 5, monthlyToAccount: keyRate - 5.1 }
      }
    },
    plus: {
      id: 'plus',
      name: 'Вклад «В плюсе»',
      description: 'Без пополнения и снятия',
      rates: {
        2: { endOfTerm: keyRate - 0.85, monthlyCapitalized: keyRate - 1, monthlyToAccount: keyRate - 1.2 },
        4: { endOfTerm: keyRate - 0.75, monthlyCapitalized: keyRate - 0.9, monthlyToAccount: keyRate - 1.1 },
        6: { endOfTerm: keyRate - 0.7, monthlyCapitalized: keyRate - 0.8, monthlyToAccount: keyRate - 1 },
        8: { endOfTerm: keyRate - 2, monthlyCapitalized: keyRate - 2.2, monthlyToAccount: keyRate - 2.4 },
        10: { endOfTerm: keyRate - 2.1, monthlyCapitalized: keyRate - 2.4, monthlyToAccount: keyRate - 2.6 },
        12: { endOfTerm: keyRate - 3.2, monthlyCapitalized: keyRate - 3.4, monthlyToAccount: keyRate - 3.5 },
        15: { endOfTerm: keyRate - 4.3, monthlyCapitalized: keyRate - 4.6, monthlyToAccount: keyRate - 4.8 }
      }
    }
  }), [keyRate])

  const selectedDeposit = depositTypes[depositTypeId]

  const calculatedData = useMemo(() => {
    if (!amount || !selectedDeposit || !selectedDeposit.rates[term]) {
      return { total: 0, income: 0, rate: 0 }
    }

    const principal = parseInt(amount)
    const dailyRate = selectedDeposit.rates[term][paymentMethod] / 100 // Ставка уже дневная

    let total = 0
    let income = 0

    if (paymentMethod === 'endOfTerm') {
      // Простые проценты с ежедневным начислением
      income = principal * dailyRate * term
      total = principal + income
    } else if (paymentMethod === 'monthlyCapitalized') {
      // Ежемесячная капитализация с ежедневным начислением
      let currentBalance = principal
      let accumulatedIncome = 0

      // Рассчитываем по дням
      for (let day = 1; day <= term; day++) {
        const dayIncome = currentBalance * dailyRate
        accumulatedIncome += dayIncome

        // В конце каждого месяца (каждые 30 дней) капитализируем
        if (day % 30 === 0 || day === term) {
          currentBalance += accumulatedIncome
          if (day !== term) {
            accumulatedIncome = 0 // Сбрасываем накопленный доход после капитализации
          }
        }
      }

      total = currentBalance
      income = total - principal
    } else { // monthlyToAccount
      // Ежемесячная выплата на счет с ежедневным начислением
      // Доход каждый день с основной суммы
      income = principal * dailyRate * term
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

  const getTermText = (days: number) => {
    if (days === 1) return '1 день'
    if (days < 5) return `${days} дня`
    return `${days} дней`
  }

  const handleCreate = async () => {
    setIsCreating(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Navigate to success page with deposit data
    const depositId = `deposit_${Date.now()}`
    const searchQuery = new URLSearchParams({
      id: depositId,
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