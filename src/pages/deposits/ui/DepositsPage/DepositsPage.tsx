import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser, useDeposits } from '@shared/hooks'
import { DepositListItem } from '@shared/api'
import styles from './DepositsPage.module.css'

export const DepositsPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { getDeposits, isLoading, error } = useDeposits()
  const [deposits, setDeposits] = useState<DepositListItem[]>([])

  const keyRate = parseFloat(user?.key_rate || '8.5')
  const maxDepositRate = keyRate - 2

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        const depositsData = await getDeposits()
        setDeposits(depositsData)
      } catch (error) {
        console.error('Failed to load deposits:', error)
        setDeposits([])
      }
    }

    loadDeposits()
  }, [getDeposits])

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
              onClick={() => navigate('/city/district/safe')}
            >
              ← Назад
            </Button>
            <h1 className={styles.title}>Вклады</h1>
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <p>Загрузка вкладов...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <h2>Ошибка загрузки</h2>
              <p>{error}</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Повторить
              </Button>
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
                        {getDepositDisplayName(deposit.deposit_name)}
                      </h3>
                      <span className={styles.depositNumber}>
                        №{deposit.account_number}
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
                          {deposit.current_interest_rate.toFixed(1)}%
                        </span>
                      </div>

                      <div className={styles.depositMaturity}>
                        <span className={styles.maturityLabel}>Осталось</span>
                        <span className={styles.maturityDate}>
                          {getDaysRemainingText(deposit.days_remaining)}
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