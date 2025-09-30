import { FC, useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser } from '@shared/hooks'
import styles from './DepositsCalculatorPage.module.css'

interface DepositType {
  id: string
  name: string
  description: string
  minAmount: number
  maxAmount: number
  rates: {
    [key: number]: {
      endOfTerm: number
      monthlyCapitalized: number
      monthlyToAccount: number
    }
  }
}

type PaymentMethod = 'endOfTerm' | 'monthlyCapitalized' | 'monthlyToAccount'

export const DepositsCalculatorPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useUser()
  const [amount, setAmount] = useState<string>('')
  const [term, setTerm] = useState<number>(4)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('endOfTerm')

  const keyRate = parseFloat(user?.key_rate || '8.5')
  const depositTypeId = searchParams.get('type') || 'save'
  const userBalance = parseFloat(user?.debet_money || '0')

  const depositTypes: Record<string, DepositType> = useMemo(() => ({
    save: {
      id: 'save',
      name: 'Вклад «Копить»',
      description: 'Без пополнения и снятия',
      minAmount: 15000,
      maxAmount: 10000000,
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
      minAmount: 25000,
      maxAmount: 10000000,
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

  const availableTerms = Object.keys(selectedDeposit?.rates || {}).map(Number).sort((a, b) => a - b)

  const quickAmounts = useMemo(() => {
    const amounts = []
    if (userBalance >= 25000) amounts.push(25000)
    if (userBalance >= 50000) amounts.push(50000)
    if (userBalance >= 100000) amounts.push(100000)
    if (userBalance >= 500000) amounts.push(500000)
    if (userBalance >= 1000000) amounts.push(1000000)
    return amounts
  }, [userBalance])

  useEffect(() => {
    if (availableTerms.length > 0 && !availableTerms.includes(term)) {
      setTerm(availableTerms[0])
    }
  }, [availableTerms, term])

  const calculateIncome = useMemo(() => {
    if (!amount || !selectedDeposit || !selectedDeposit.rates[term]) {
      return {
        total: 0,
        income: 0,
        rate: 0
      }
    }

    const principal = parseFloat(amount)
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

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '')
    if (numericValue === '' || parseInt(numericValue) <= selectedDeposit.maxAmount) {
      setAmount(numericValue)
    }
  }

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString())
  }

  const handleContinue = () => {
    navigate(`/deposits/create?type=${depositTypeId}&amount=${amount}&term=${term}&method=${paymentMethod}`)
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

  if (!selectedDeposit) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Тип вклада не найден</h2>
              <Button onClick={() => navigate('/deposits/select')}>
                Вернуться к выбору
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isValidAmount = amount && parseInt(amount) >= selectedDeposit.minAmount

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
              onClick={() => navigate('/deposits/select')}
            >
              ← Назад
            </Button>

            <h1 className={styles.title}>Рассчитайте доход от вклада</h1>
          </div>

          <div className={styles.depositInfo}>
            <h2 className={styles.depositName}>{selectedDeposit.name}</h2>
            <p className={styles.depositDescription}>{selectedDeposit.description}</p>
          </div>

          <div className={styles.calculator}>
            <div className={styles.inputSection}>
              <div className={styles.amountInput}>
                <label className={styles.label}>Сумма вклада</label>
                <div className={styles.inputWrapper}>
                  <input
                    type="text"
                    value={amount ? formatAmount(parseInt(amount)) : ''}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={`от ${formatAmount(selectedDeposit.minAmount)}`}
                    className={styles.input}
                  />
                  <span className={styles.currency}>₽</span>
                </div>
                <p className={styles.hint}>
                  Минимальная сумма: {formatAmount(selectedDeposit.minAmount)} ₽
                </p>
              </div>

              {quickAmounts.length > 0 && (
                <div className={styles.quickAmountsSection}>
                  <label className={styles.label}>Быстрый выбор суммы</label>
                  <div className={styles.quickAmounts}>
                    {quickAmounts.map((quickAmount) => (
                      <button
                        key={quickAmount}
                        onClick={() => handleQuickAmountSelect(quickAmount)}
                        className={`${styles.quickAmount} ${
                          amount === quickAmount.toString() ? styles.selected : ''
                        }`}
                        type="button"
                      >
                        {formatAmount(quickAmount)} ₽
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.termSelect}>
                <label className={styles.label}>Срок вклада</label>
                <div className={styles.termButtons}>
                  {availableTerms.map((termOption) => (
                    <button
                      key={termOption}
                      className={`${styles.termButton} ${term === termOption ? styles.active : ''}`}
                      onClick={() => setTerm(termOption)}
                    >
                      {getTermText(termOption)}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.paymentMethod}>
                <label className={styles.label}>Способ выплаты процентов</label>
                <div className={styles.paymentOptions}>
                  {(['endOfTerm', 'monthlyCapitalized', 'monthlyToAccount'] as PaymentMethod[]).map((method) => (
                    <label key={method} className={styles.paymentOption}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className={styles.radio}
                      />
                      <span className={styles.paymentLabel}>
                        {getPaymentMethodName(method)}
                      </span>
                      <span className={styles.paymentRate}>
                        {selectedDeposit.rates[term]?.[method]?.toFixed(1)}%
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {isValidAmount && (
              <div className={styles.results}>
                <div className={styles.resultCard}>
                  <h3 className={styles.resultTitle}>Расчет дохода</h3>

                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Сумма вклада</span>
                      <span className={styles.resultValue}>{formatAmount(parseInt(amount))} ₽</span>
                    </div>

                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Ставка</span>
                      <span className={styles.resultValue}>{calculateIncome.rate.toFixed(1)}%</span>
                    </div>

                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Срок</span>
                      <span className={styles.resultValue}>{getTermText(term)}</span>
                    </div>

                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Доход</span>
                      <span className={`${styles.resultValue} ${styles.income}`}>
                        +{formatAmount(calculateIncome.income)} ₽
                      </span>
                    </div>

                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>К получению</span>
                      <span className={`${styles.resultValue} ${styles.total}`}>
                        {formatAmount(calculateIncome.total)} ₽
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="large"
                onClick={handleContinue}
                disabled={!isValidAmount}
                style={{ width: '100%' }}
              >
                Продолжить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}