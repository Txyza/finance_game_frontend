import { FC, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import styles from './DepositsSuccessPage.module.css'

type PaymentMethod = 'endOfTerm' | 'monthlyCapitalized' | 'monthlyToAccount'

export const DepositsSuccessPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const depositData = useMemo(() => {
    const id = searchParams.get('id')
    const account_number = searchParams.get('account_number')
    const type = searchParams.get('type')
    const amount = searchParams.get('amount')
    const term = searchParams.get('term')
    const method = searchParams.get('method') as PaymentMethod
    const rate = searchParams.get('rate')
    const income = searchParams.get('income')
    const total = searchParams.get('total')

    if (!id || !account_number || !type || !amount || !term || !method || !rate || !income || !total) {
      return null
    }

    return {
      id,
      account_number,
      type,
      amount: parseInt(amount),
      term: parseInt(term),
      method,
      rate: parseFloat(rate),
      income: parseInt(income),
      total: parseInt(total)
    }
  }, [searchParams])

  const depositTypeNames = {
    save: 'Вклад «Копить»',
    plus: 'Вклад «В плюсе»'
  }

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

  const getMaturityDate = (days: number) => {
    const maturityDate = new Date()
    maturityDate.setDate(maturityDate.getDate() + days)
    return maturityDate.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const handleViewDeposits = () => {
    navigate('/deposits')
  }

  const handleGoHome = () => {
    navigate('/')
  }

  if (!depositData) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Данные не найдены</h2>
              <Button onClick={() => navigate('/deposits')}>
                Перейти к вкладам
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
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <div className={styles.checkmark}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.successContent}>
              <h1 className={styles.successTitle}>Вклад успешно открыт!</h1>
              <p className={styles.successDescription}>
                Ваш вклад активен и уже начал приносить доход
              </p>
            </div>

            <div className={styles.depositSummary}>
              <h2 className={styles.summaryTitle}>
                {depositTypeNames[depositData.type as keyof typeof depositTypeNames]}
              </h2>

              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Номер вклада</span>
                  <span className={styles.summaryValue}>№ {depositData.account_number}</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Сумма вклада</span>
                  <span className={styles.summaryValue}>{formatAmount(depositData.amount)} ₽</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Процентная ставка</span>
                  <span className={styles.summaryValue}>{depositData.rate.toFixed(1)}% годовых</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Срок размещения</span>
                  <span className={styles.summaryValue}>{getTermText(depositData.term)}</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Дата окончания</span>
                  <span className={styles.summaryValue}>{getMaturityDate(depositData.term)}</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Выплата процентов</span>
                  <span className={styles.summaryValue}>{getPaymentMethodName(depositData.method)}</span>
                </div>
              </div>

              <div className={styles.incomeHighlight}>
                <div className={styles.incomeItem}>
                  <span className={styles.incomeLabel}>Ожидаемый доход</span>
                  <span className={styles.incomeValue}>+{formatAmount(depositData.income)} ₽</span>
                </div>

                <div className={styles.incomeItem}>
                  <span className={styles.incomeLabel}>К получению</span>
                  <span className={styles.totalValue}>{formatAmount(depositData.total)} ₽</span>
                </div>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h3 className={styles.nextStepsTitle}>Что дальше?</h3>
              <ul className={styles.nextStepsList}>
                <li>Отслеживайте доходность в разделе "Вклады"</li>
                <li>Получайте уведомления о начислении процентов</li>
                <li>При необходимости можно расторгнуть вклад досрочно</li>
                <li>Автоматическое продление на тот же срок при окончании</li>
              </ul>
            </div>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="large"
                onClick={handleViewDeposits}
                style={{ flex: 1 }}
              >
                Мои вклады
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={handleGoHome}
                style={{ flex: 1 }}
              >
                На главную
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}