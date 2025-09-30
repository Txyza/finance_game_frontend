import { FC, useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser, useDeposits } from '@shared/hooks'
import { DepositDetail, DepositTransaction, depositsApi } from '@shared/api'
import styles from './DepositDetailsPage.module.css'

export const DepositDetailsPage: FC = () => {
  const navigate = useNavigate()
  const { depositId } = useParams<{ depositId: string }>()
  const { user } = useUser()
  const { getDeposit, closeDeposit, isLoading: depositsLoading } = useDeposits()
  const [deposit, setDeposit] = useState<DepositDetail | null>(null)
  const [transactions, setTransactions] = useState<DepositTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)

  useEffect(() => {
    const loadDepositData = async () => {
      if (!depositId) return

      setIsLoading(true)

      try {
        // Load deposit details from API
        const depositData = await getDeposit(depositId)
        setDeposit(depositData)

        // Load transactions from API
        const transactionsData = await depositsApi.getTransactions(depositId)
        setTransactions(transactionsData.transactions)
      } catch (error) {
        console.error('Error loading deposit data:', error)
        setDeposit(null)
        setTransactions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadDepositData()
  }, [depositId, getDeposit])

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

  const getDepositDisplayName = (depositName: string) => {
    switch (depositName) {
      case 'kopit':
        return 'Вклад «Копить»'
      case 'v_pluse':
        return 'Вклад «В Плюсе»'
      default:
        return depositName
    }
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'at_end':
        return 'В конце срока'
      case 'monthly_capitalized':
        return 'Ежемесячно с капитализацией'
      case 'monthly_to_account':
        return 'Ежемесячно на счет'
      default:
        return method
    }
  }

  const getTermText = (days: number) => {
    if (days === 1) return '1 день'
    if (days < 5) return `${days} дня`
    return `${days} дней`
  }

  const getRemainingDays = useMemo(() => {
    if (!deposit) return 0
    return deposit.days_remaining
  }, [deposit])

  const getProgressPercentage = useMemo(() => {
    if (!deposit) return 0
    const now = new Date()
    const startDate = new Date(deposit.opened_at)
    const maturityDate = new Date(deposit.expires_at)

    const totalDuration = maturityDate.getTime() - startDate.getTime()
    const elapsed = now.getTime() - startDate.getTime()

    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    return Math.round(percentage)
  }, [deposit])

  const handleCloseDeposit = async () => {
    if (!depositId) return

    try {
      await closeDeposit(depositId)
      navigate('/deposits')
    } catch (error) {
      console.error('Error closing deposit:', error)
      setShowCloseConfirm(false)
    }
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
              ← Назад
            </Button>

            <h1 className={styles.title}>{getDepositDisplayName(deposit.deposit_name)}</h1>
          </div>

          <div className={styles.depositInfo}>
            <div className={styles.depositNumber}>
              Вклад № {deposit.account_number}
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
                <span>до {formatDate(deposit.expires_at)}</span>
              </div>
            </div>
          </div>

          <div className={styles.detailsGrid}>
            <div className={styles.detailCard}>
              <h3 className={styles.cardTitle}>Условия вклада</h3>
              <div className={styles.detailsList}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Процентная ставка</span>
                  <span className={styles.detailValue}>{deposit.current_interest_rate.toFixed(1)}% годовых</span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Выплата процентов</span>
                  <span className={styles.detailValue}>
                    {getPaymentMethodName(deposit.interest_payment_method)}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Дата открытия</span>
                  <span className={styles.detailValue}>
                    {formatDate(deposit.opened_at)}
                  </span>
                </div>

                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Дата погашения</span>
                  <span className={styles.detailValue}>
                    {formatDate(deposit.expires_at)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {transactions.length > 0 && (
            <div className={styles.transactionsSection}>
              <h3 className={styles.sectionTitle}>История операций</h3>
              <div className={styles.transactionsList}>
                {transactions.map((transaction) => (
                  <div key={transaction.id} className={styles.transactionItem}>
                    <div className={styles.transactionInfo}>
                      <div className={styles.transactionName}>
                        {transaction.name}
                      </div>
                      <div className={styles.transactionDate}>
                        {new Date(transaction.datetime_start).toLocaleDateString('ru-RU', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <div className={styles.transactionAmount}>
                      {formatAmount(transaction.amount)} ₽
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                  При досрочном закрытии могут применяться штрафы согласно условиям договора.
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