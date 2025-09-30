import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser, useSavings } from '@shared/hooks'
import { SavingsAccount } from '@shared/api'
import styles from './SavingsPage.module.css'

export const SavingsPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { getAccounts, isLoading, error } = useSavings()
  const [accounts, setAccounts] = useState<SavingsAccount[]>([])

  const keyRate = parseFloat(user?.key_rate || '8.5')
  const savingsRate = keyRate - 1

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const accountsData = await getAccounts()
        setAccounts(accountsData)
      } catch (error) {
        console.error('Failed to load accounts:', error)
        // Fallback to empty array if API fails
        setAccounts([])
      }
    }

    loadAccounts()
  }, [getAccounts])

  const handleOpenAccount = () => {
    navigate('/savings/select')
  }

  const handleAccountClick = (accountId: string) => {
    navigate(`/savings/account/${accountId}`)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  const getAccountTypeName = () => {
    return 'Накопительный счет'
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
            <h1 className={styles.title}>Накопительные счета</h1>
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <p>Загрузка счетов...</p>
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
          ) : accounts.length === 0 ? (
            <div className={styles.welcomeSection}>
              <div className={styles.welcomeContent}>
                <div className={styles.inviteCard}>
                  <div className={styles.inviteIcon}>💰</div>

                  <h2 className={styles.inviteTitle}>
                    Откройте свой первый накопительный счет
                  </h2>

                  <p className={styles.inviteDescription}>
                    Начните накапливать средства под выгодный процент
                  </p>

                  <div className={styles.rateInfo}>
                    <span className={styles.rateText}>
                      Ставка до <strong>{savingsRate.toFixed(1)}%</strong> годовых
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleOpenAccount}
                    className={styles.openButton}
                  >
                    Открыть счет
                  </Button>

                  <p className={styles.note}>
                    * Для открытия первого накопительного счета
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.accountsSection}>
              <div className={styles.accountsGrid}>
                {accounts.map((account) => (
                  <div
                    key={account.id}
                    className={styles.accountCard}
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <div className={styles.accountHeader}>
                      <h3 className={styles.accountName}>
                        {getAccountTypeName()}
                      </h3>
                      <span className={styles.accountNumber}>
                        №{account.account_number}
                      </span>
                    </div>

                    <div className={styles.accountBalance}>
                      <span className={styles.balanceLabel}>Баланс</span>
                      <span className={styles.balanceAmount}>
                        {formatAmount(account.balance)} ₽
                      </span>
                    </div>

                    <div className={styles.accountRate}>
                      <span className={styles.rateLabel}>Ставка</span>
                      <span className={styles.rateValue}>
                        {account.current_interest_rate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.addAccountSection}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleOpenAccount}
                  className={styles.addButton}
                >
                  Добавить счет
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}