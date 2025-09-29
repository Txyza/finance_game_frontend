import { FC, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser, useSavings } from '@shared/hooks'
import { SavingsAccount } from '@shared/api'
import styles from './SavingsPage.module.css'

export const SavingsPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const { getAccounts, isLoading } = useSavings()
  const [accounts, setAccounts] = useState<SavingsAccount[]>([])

  const keyRate = parseFloat(user?.key_rate || '8.5')
  const savingsRate = keyRate - 1

  useEffect(() => {
    const loadAccounts = async () => {
      // Мок данные для демонстрации
      const mockAccounts: SavingsAccount[] = [
        {
          id: 'acc_12345678',
          type: 'basic',
          name: 'Накопительный счет',
          balance: 125000,
          interest_rate: 7.5,
          created_at: '2024-01-15T10:30:00Z',
          status: 'active'
        },
        {
          id: 'acc_87654321',
          type: 'premium',
          name: 'Премиум',
          balance: 750000,
          interest_rate: 7.0,
          created_at: '2024-02-20T14:45:00Z',
          status: 'active'
        },
        {
          id: 'acc_11223344',
          type: 'basic',
          name: 'Накопительный счет',
          balance: 45000,
          interest_rate: 7.5,
          created_at: '2024-03-10T09:15:00Z',
          status: 'active'
        }
      ]

      // Имитируем загрузку
      setTimeout(() => {
        setAccounts(mockAccounts)
      }, 1000)

      // Реальный API вызов (закомментирован)
      // const accountsData = await getAccounts()
      // setAccounts(accountsData)
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

  const getAccountTypeName = (type: string) => {
    return type === 'premium' ? 'Премиум' : 'Накопительный счет'
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />
      <GameHeaderContainer />

      <div className={styles.content}>
        <div className={styles.container}>
          <h1 className={styles.title}>Накопительные счета</h1>

          {isLoading ? (
            <div className={styles.loading}>
              <p>Загрузка счетов...</p>
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
                    className={`${styles.accountCard} ${
                      account.type === 'premium' ? styles.premium : ''
                    }`}
                    onClick={() => handleAccountClick(account.id)}
                  >
                    <div className={styles.accountHeader}>
                      <h3 className={styles.accountName}>
                        {getAccountTypeName(account.type)}
                      </h3>
                      <span className={styles.accountNumber}>
                        №{account.id.slice(-8).toUpperCase()}
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
                        {account.interest_rate.toFixed(1)}%
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