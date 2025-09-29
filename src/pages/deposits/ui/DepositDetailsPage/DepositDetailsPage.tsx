import { FC, useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser } from '@shared/hooks'
import styles from './DepositDetailsPage.module.css'

interface Deposit {
  id: string
  type: 'save' | 'plus'
  name: string
  balance: number
  initial_amount: number
  maturity_date: string
  interest_rate: number
  created_at: string
  status: 'active' | 'closed'
  payment_method: 'endOfTerm' | 'monthlyCapitalized' | 'monthlyToAccount'
  term_days: number
  total_income: number
}

type PaymentMethod = 'endOfTerm' | 'monthlyCapitalized' | 'monthlyToAccount'

export const DepositDetailsPage: FC = () => {
  const navigate = useNavigate()
  const { depositId } = useParams<{ depositId: string }>()
  const { user } = useUser()
  const [deposit, setDeposit] = useState<Deposit | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  useEffect(() => {
    const loadDeposit = async () => {
      // Мок данные для демонстрации
      const mockDeposits: Record<string, Deposit> = {
        'dep_12345678': {
          id: 'dep_12345678',
          type: 'save',
          name: 'Вклад «Копить»',
          balance: 150000,
          initial_amount: 150000,
          maturity_date: '2025-04-15T00:00:00Z',
          interest_rate: 7.7,
          created_at: '2024-01-15T10:30:00Z',
          status: 'active',
          payment_method: 'endOfTerm',
          term_days: 90,
          total_income: 2850
        },
        'dep_87654321': {
          id: 'dep_87654321',
          type: 'plus',
          name: 'Вклад «В плюсе»',
          balance: 250000,
          initial_amount: 250000,
          maturity_date: '2025-05-20T00:00:00Z',
          interest_rate: 7.8,
          created_at: '2024-02-20T14:45:00Z',
          status: 'active',
          payment_method: 'monthlyCapitalized',
          term_days: 180,
          total_income: 9750
        },
        'dep_11223344': {
          id: 'dep_11223344',
          type: 'save',
          name: 'Вклад «Копить»',
          balance: 75000,
          initial_amount: 75000,
          maturity_date: '2025-03-10T00:00:00Z',
          interest_rate: 8.0,
          created_at: '2024-03-10T09:15:00Z',
          status: 'active',
          payment_method: 'monthlyToAccount',
          term_days: 60,
          total_income: 1000
        }
      }

      setTimeout(() => {
        const foundDeposit = depositId ? mockDeposits[depositId] : null
        setDeposit(foundDeposit)
        setIsLoading(false)
      }, 800)
    }

    loadDeposit()
  }, [depositId])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
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

  const getRemainingDays = useMemo(() => {
    if (!deposit) return 0
    const now = new Date()
    const maturityDate = new Date(deposit.maturity_date)
    const diffTime = maturityDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }, [deposit])

  const getProgressPercentage = useMemo(() => {
    if (!deposit) return 0
    const now = new Date()
    const startDate = new Date(deposit.created_at)
    const maturityDate = new Date(deposit.maturity_date)

    const totalDuration = maturityDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()

    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    return Math.round(percentage)
  }, [deposit])

  const handleCloseDeposit = async () => {
    setShowCloseConfirm(false)
    navigate('/deposits')
  }

  const handleBack = () => {
    navigate('/deposits')
  }

  if (isLoading) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.loading}>
              <p>Загрузка данных вклада...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!deposit) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Вклад не найден</h2>
              <Button onClick={handleBack}>
                Вернуться к вкладам
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
            >
              ← Вклады
            </Button>

            <h1 className={styles.title}>{deposit.name}</h1>
          </div>

          <div className={styles.depositInfo}>
            <div className={styles.depositNumber}>
              Вклад № {deposit.id.slice(-8).toUpperCase()}
            </div>

            <div className={styles.balanceSection}>
              <h2 className={styles.balanceTitle}>Текущая сумма вклада</h2>
              <div className={styles.balanceAmount}>
                {formatAmount(deposit.balance)} ₽
              </div>
            </div>

            <div className={styles.progressSection}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>Прогресс по сроку</span>
                <span className={styles.progressPercent}>{getProgressPercentage}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${getProgressPercentage}%` }}
                />
              </div>
              <div className={styles.progressInfo}>
                <span>Осталось {getRemainingDays} дней</span>
                <span>до {formatDate(deposit.maturity_date)}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <h3 className={styles.cardTitle}>Условия вклада</h3>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Первоначальная сумма</span>
                  <span className={styles.detailValue}>{formatAmount(deposit.initial_amount)} ₽</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Процентная ставка</span>
                  <span className={styles.detailValue}>{deposit.interest_rate.toFixed(1)}% годовых</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Срок размещения</span>
                  <span className={styles.detailValue}>{getTermText(deposit.term_days)}</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Выплата процентов</span>
                  <span className={styles.detailValue}>
                    {getPaymentMethodName(deposit.payment_method)}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Дата открытия</span>
                  <span className={styles.detailValue}>
                    {formatDate(deposit.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h3 className={styles.cardTitle}>Доходность</h3>
              <div className={styles.incomeInfo}>
                <div className={styles.incomeItem}>
                  <span className={styles.incomeLabel}>Ожидаемый доход</span>
                  <span className={styles.incomeValue}>
                    +{formatAmount(deposit.total_income)} ₽
                  </span>
                </div>

                <div className={styles.incomeItem}>
                  <span className={styles.incomeLabel}>К получению в итоге</span>
                  <span className={styles.totalValue}>
                    {formatAmount(deposit.balance + deposit.total_income)} ₽
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actionsSection}>
            <div className={styles.warning}>
              <h4 className={styles.warningTitle}>Досрочное закрытие</h4>
              <p className={styles.warningText}>
                При досрочном закрытии проценты рассчитываются по ставке 0,01% годовых.
                Вы получите только первоначальную сумму.
              </p>
            </div>

            <Button
              variant="outline"
              size="large"
              onClick={() => setShowCloseConfirm(true)}
              className={styles.closeButton}
            >
              Закрыть вклад досрочно
            </Button>
          </div>

          {showCloseConfirm && (
            <div className={styles.modal}>
              <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>Подтвердите закрытие</h3>
                <p className={styles.modalText}>
                  Вы действительно хотите закрыть вклад досрочно?
                  Вы получите только первоначальную сумму {formatAmount(deposit.initial_amount)} ₽.
                </p>

                <div className={styles.modalActions}>
                  <Button
                    variant="outline"
                    onClick={() => setShowCloseConfirm(false)}
                  >
                    Отменить
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleCloseDeposit}
                  >
                    Закрыть вклад
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}