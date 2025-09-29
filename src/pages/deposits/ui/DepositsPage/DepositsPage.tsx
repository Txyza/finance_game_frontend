import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser } from '@shared/hooks'
import styles from './DepositsPage.module.css'

interface Deposit {
  id: string
  type: 'save' | 'plus'
  name: string
  balance: number
  maturity_date: string
  interest_rate: number
  created_at: string
  status: 'active' | 'closed'
}

export const DepositsPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const [deposits, setDeposits] = useState<Deposit[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const keyRate = parseFloat(user?.key_rate || '8.5')
  const maxDepositRate = keyRate - 2

  useEffect(() => {
    const loadDeposits = async () => {
      // Мок данные для демонстрации
      const mockDeposits: Deposit[] = [
        {
          id: 'dep_12345678',
          type: 'save',
          name: 'Вклад «Копить»',
          balance: 150000,
          maturity_date: '2025-04-15T00:00:00Z',
          interest_rate: 7.7,
          created_at: '2024-01-15T10:30:00Z',
          status: 'active'
        },
        {
          id: 'dep_87654321',
          type: 'plus',
          name: 'Вклад «В плюсе»',
          balance: 250000,
          maturity_date: '2025-05-20T00:00:00Z',
          interest_rate: 7.8,
          created_at: '2024-02-20T14:45:00Z',
          status: 'active'
        },
        {
          id: 'dep_11223344',
          type: 'save',
          name: 'Вклад «Копить»',
          balance: 75000,
          maturity_date: '2025-03-10T00:00:00Z',
          interest_rate: 8.0,
          created_at: '2024-03-10T09:15:00Z',
          status: 'active'
        }
      ]

      // Имитируем загрузку
      setTimeout(() => {
        setDeposits(mockDeposits)
        setIsLoading(false)
      }, 1000)
    }

    loadDeposits()
  }, [])

  const handleOpenDeposit = () => {
    navigate('/deposits/select')
  }

  const handleDepositClick = (depositId: string) => {
    navigate(`/deposits/deposit/${depositId}`)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDaysRemaining = (maturityDate: string) => {
    const now = new Date()
    const endDate = new Date(maturityDate)
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const getDaysRemainingText = (days: number) => {
    if (days === 0) return 'Срок истек'
    if (days === 1) return '1 день'
    if (days < 5) return `${days} дня`
    if (days < 21) return `${days} дней`
    const lastDigit = days % 10
    const lastTwoDigits = days % 100
    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${days} дней`
    if (lastDigit === 1) return `${days} день`
    if (lastDigit >= 2 && lastDigit <= 4) return `${days} дня`
    return `${days} дней`
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />
      <GameHeaderContainer />

      <div className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Вклады</h1>

          {isLoading ? (
            <div className={styles.loading}>
              <p>Загрузка вкладов...</p>
            </div>
          ) : deposits.length === 0 ? (
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeContent}>
                <div className={styles.inviteCard}>
                  <div className={styles.inviteIcon}>🏦</div>

                  <h2 className={styles.inviteTitle}>
                    Откройте свой первый вклад
                  </h2>

                  <p className={styles.inviteDescription}>
                    Накапливайте средства под выгодный процент
                  </p>

                  <div className={styles.rateInfo}>
                    <span className={styles.rateText}>
                      Ставка до <strong>{maxDepositRate.toFixed(1)}%</strong> годовых
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleOpenDeposit}
                    className={styles.openButton}
                  >
                    Открыть вклад
                  </Button>

                  <p className={styles.note}>
                    * Для открытия первого вклада
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.depositsSection}>
              <div className={styles.depositsGrid}>
                {deposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className={styles.depositCard}
                    onClick={() => handleDepositClick(deposit.id)}
                  >
                    <div className={styles.depositHeader}>
                      <h3 className={styles.depositName}>
                        {deposit.name}
                      </h3>
                      <span className={styles.depositNumber}>
                        №{deposit.id.slice(-8).toUpperCase()}
                      </span>
                    </div>

                    <div className={styles.depositBalance}>
                      <span className={styles.balanceLabel}>Сумма вклада</span>
                      <span className={styles.balanceAmount}>
                        {formatAmount(deposit.balance)} ₽
                      </span>
                    </div>

                    <div className={styles.depositDetails}>
                      <div className={styles.depositRate}>
                        <span className={styles.rateLabel}>Ставка</span>
                        <span className={styles.rateValue}>
                          {deposit.interest_rate.toFixed(1)}%
                        </span>
                      </div>

                      <div className={styles.depositMaturity}>
                        <span className={styles.maturityLabel}>Осталось</span>
                        <span className={styles.maturityDate}>
                          {getDaysRemainingText(getDaysRemaining(deposit.maturity_date))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.addDepositSection}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleOpenDeposit}
                  className={styles.addButton}
                >
                  + Добавить вклад
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}