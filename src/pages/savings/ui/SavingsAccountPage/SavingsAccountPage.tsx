import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useSavings } from '@shared/hooks'
import { SavingsAccount, SavingsTransaction, savingsApi } from '@shared/api'
import styles from './SavingsAccountPage.module.css'

interface Operation {
  id: string
  type: 'deposit' | 'withdrawal' | 'interest'
  amount: number
  date: string
  description: string
}

export const SavingsAccountPage: FC = () => {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { getAccount, getOperations, isLoading, error } = useSavings()
  const [account, setAccount] = useState<SavingsAccount | null>(null)
  const [operations, setOperations] = useState<Operation[]>([])
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([])
  const [loadingAccount, setLoadingAccount] = useState(true)

  useEffect(() => {
    const loadAccountData = async () => {
      if (!accountId) return

      setLoadingAccount(true)

      try {
        // Загружаем данные счета и транзакции параллельно
        const [accountData, transactionsData] = await Promise.all([
          getAccount(accountId),
          savingsApi.getTransactions(accountId)
        ])

        if (accountData) {
          setAccount(accountData)
          setTransactions(transactionsData.transactions)
        }
      } catch (error) {
        console.error('Ошибка загрузки данных счета:', error)
        setAccount(null)
        setTransactions([])
      } finally {
        setLoadingAccount(false)
      }
    }

    loadAccountData()
  }, [accountId, getAccount])

  // Обновляем данные когда возвращаемся на страницу (например, после операций)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const loadAccountData = async () => {
          if (!accountId) return
          try {
            const [accountData, transactionsData] = await Promise.all([
              getAccount(accountId),
              savingsApi.getTransactions(accountId)
            ])
            if (accountData) {
              setAccount(accountData)
              setTransactions(transactionsData.transactions)
            }
          } catch (error) {
            console.error('Ошибка обновления данных:', error)
          }
        }
        loadAccountData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [accountId, getAccount])

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


  const getAccountTypeName = () => {
    if (account?.account_type === 'premium') {
      return 'Premium'
    }
    return 'Накопительный счет'
  }

  const isPremiumAccount = () => {
    return account?.account_type === 'premium'
  }

  const handleBack = () => {
    navigate('/savings')
  }

  const handleDeposit = () => {
    navigate(`/savings/deposit/${accountId}`)
  }

  const handleWithdraw = () => {
    navigate(`/savings/withdraw/${accountId}`)
  }


  if (loadingAccount) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.loading}>
              <p>Загрузка данных счета...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !account) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Ошибка загрузки</h2>
              <p>{error || 'Счет не найден'}</p>
              <Button variant="primary" onClick={handleBack}>
                Вернуться к счетам
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

            <h1 className={styles.title}>
              {getAccountTypeName()}
            </h1>
          </div>

          <div className={`${styles.accountCard} ${isPremiumAccount() ? styles.premiumCard : ''}`}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <div className={styles.accountNumber}>
                  Счет № {account.account_number}
                  {isPremiumAccount() && (
                    <span className={styles.premiumBadge}>
                      👑 Premium
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.accountStatus}>
                <span className={styles.statusIndicator}></span>
                <span className={styles.statusText}>Активен</span>
              </div>
            </div>

            <div className={styles.mainBalance}>
              <div className={styles.balanceLabel}>Баланс счета</div>
              <div className={styles.balanceAmount}>
                {formatAmount(account.balance)} ₽
              </div>
            </div>

            <div className={styles.accountDetails}>
              <div className={styles.detailCard}>
                <div className={styles.detailIcon}>📈</div>
                <div className={styles.detailContent}>
                  <div className={styles.detailLabel}>Процентная ставка</div>
                  <div className={styles.detailValue}>
                    {account.current_interest_rate.toFixed(1)}% годовых
                  </div>
                </div>
              </div>


              {account.expires_at && (
                <div className={styles.detailCard}>
                  <div className={styles.detailIcon}>⏰</div>
                  <div className={styles.detailContent}>
                    <div className={styles.detailLabel}>Действует до</div>
                    <div className={styles.detailValue}>
                      {formatDate(account.expires_at)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.actionsSection}>
            <div className={styles.actionsGrid}>
              <Button
                variant="primary"
                size="large"
                onClick={handleDeposit}
                className={styles.actionButton}
              >
                💰 Пополнить
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={handleWithdraw}
                className={styles.actionButton}
              >
                💳 Снять
              </Button>
            </div>
          </div>

          <div className={styles.operationsSection}>
            <h3 className={styles.operationsTitle}>История операций</h3>

            {transactions.length === 0 ? (
              <div className={styles.emptyOperations}>
                <p>Операций пока нет</p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}