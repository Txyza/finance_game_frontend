import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useSavings } from '@shared/hooks'
import { SavingsAccount } from '@shared/api'
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
  const { isLoading, error } = useSavings()
  const [account, setAccount] = useState<SavingsAccount | null>(null)
  const [operations, setOperations] = useState<Operation[]>([])
  const [loadingAccount, setLoadingAccount] = useState(true)

  useEffect(() => {
    const loadAccountData = async () => {
      if (!accountId) return

      setLoadingAccount(true)

      // Мок данные на основе ID счета для демонстрации
      const mockAccountsData: { [key: string]: SavingsAccount } = {
        'acc_12345678': {
          id: 'acc_12345678',
          type: 'basic',
          name: 'Накопительный счет',
          balance: 125000,
          interest_rate: 7.5,
          created_at: '2024-01-15T10:30:00Z',
          status: 'active'
        },
        'acc_87654321': {
          id: 'acc_87654321',
          type: 'premium',
          name: 'Премиум',
          balance: 750000,
          interest_rate: 7.0,
          created_at: '2024-02-20T14:45:00Z',
          status: 'active'
        },
        'acc_11223344': {
          id: 'acc_11223344',
          type: 'basic',
          name: 'Накопительный счет',
          balance: 45000,
          interest_rate: 7.5,
          created_at: '2024-03-10T09:15:00Z',
          status: 'active'
        }
      }

      const mockOperationsData: { [key: string]: Operation[] } = {
        'acc_12345678': [
          {
            id: '1',
            type: 'deposit',
            amount: 100000,
            date: '2024-01-15T10:30:00Z',
            description: 'Первоначальное пополнение'
          },
          {
            id: '2',
            type: 'deposit',
            amount: 25000,
            date: '2024-01-22T14:15:00Z',
            description: 'Пополнение счета'
          },
          {
            id: '3',
            type: 'interest',
            amount: 856,
            date: '2024-02-01T00:00:00Z',
            description: 'Начисление процентов за январь'
          },
          {
            id: '4',
            type: 'interest',
            amount: 924,
            date: '2024-03-01T00:00:00Z',
            description: 'Начисление процентов за февраль'
          }
        ],
        'acc_87654321': [
          {
            id: '1',
            type: 'deposit',
            amount: 500000,
            date: '2024-02-20T14:45:00Z',
            description: 'Первоначальное пополнение (Премиум)'
          },
          {
            id: '2',
            type: 'deposit',
            amount: 200000,
            date: '2024-02-25T10:30:00Z',
            description: 'Дополнительное пополнение'
          },
          {
            id: '3',
            type: 'interest',
            amount: 4110,
            date: '2024-03-01T00:00:00Z',
            description: 'Начисление процентов за февраль'
          },
          {
            id: '4',
            type: 'deposit',
            amount: 50000,
            date: '2024-03-15T16:20:00Z',
            description: 'Пополнение счета'
          }
        ],
        'acc_11223344': [
          {
            id: '1',
            type: 'deposit',
            amount: 45000,
            date: '2024-03-10T09:15:00Z',
            description: 'Первоначальное пополнение'
          },
          {
            id: '2',
            type: 'interest',
            amount: 180,
            date: '2024-04-01T00:00:00Z',
            description: 'Начисление процентов за март'
          }
        ]
      }

      setTimeout(() => {
        const accountData = mockAccountsData[accountId]
        const operationsData = mockOperationsData[accountId] || []

        if (accountData) {
          setAccount(accountData)
          setOperations(operationsData)
        }

        setLoadingAccount(false)
      }, 800)
    }

    loadAccountData()
  }, [accountId])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOperationTypeLabel = (type: Operation['type']) => {
    switch (type) {
      case 'deposit':
        return 'Пополнение'
      case 'withdrawal':
        return 'Снятие'
      case 'interest':
        return 'Начисление процентов'
      default:
        return 'Операция'
    }
  }

  const getAccountTypeName = (type: string) => {
    return type === 'premium' ? 'Премиум' : 'Накопительный счет'
  }

  if (loadingAccount) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.loading}>
            <p>Загрузка данных счета...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.error}>
            <p>Счет не найден</p>
            <Button onClick={() => navigate('/savings')}>
              Вернуться к счетам
            </Button>
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
              onClick={() => navigate('/savings')}
            >
              ← Назад к счетам
            </Button>

            <h1 className={styles.title}>Детали счета</h1>
          </div>

          <div className={`${styles.accountCard} ${account.type === 'premium' ? styles.premium : ''}`}>
            <div className={styles.accountHeader}>
              <h2 className={styles.accountName}>
                {getAccountTypeName(account.type)}
              </h2>
              <span className={styles.accountNumber}>
                №{account.id.slice(-8).toUpperCase()}
              </span>
            </div>

            <div className={styles.accountDetails}>
              <div className={`${styles.detailCard} ${styles.balanceCard}`}>
                <p className={styles.detailLabel}>Баланс счета</p>
                <p className={styles.detailValue}>
                  {formatAmount(account.balance)} ₽
                </p>
              </div>

              <div className={`${styles.detailCard} ${styles.rateCard}`}>
                <p className={styles.detailLabel}>Процентная ставка</p>
                <p className={styles.detailValue}>
                  {account.interest_rate.toFixed(1)}% годовых
                </p>
              </div>

            </div>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="medium"
                onClick={() => navigate(`/savings/deposit/${account.id}`)}
              >
                Пополнить
              </Button>
              <Button
                variant="outline"
                size="medium"
                onClick={() => navigate(`/savings/withdraw/${account.id}`)}
              >
                Снять
              </Button>
              <Button variant="outline" size="medium">
                Закрыть счет
              </Button>
            </div>
          </div>

          <div className={styles.operationsSection}>
            <h3 className={styles.sectionTitle}>История операций</h3>

            {operations.length === 0 ? (
              <div className={styles.emptyOperations}>
                <p>Операции по счету отсутствуют</p>
              </div>
            ) : (
              <div className={styles.operationsList}>
                {operations.map((operation) => (
                  <div key={operation.id} className={styles.operationItem}>
                    <div className={styles.operationInfo}>
                      <p className={styles.operationType}>
                        {getOperationTypeLabel(operation.type)}
                      </p>
                      <p className={styles.operationDate}>
                        {formatDate(operation.date)}
                      </p>
                    </div>
                    <div
                      className={`${styles.operationAmount} ${
                        operation.type === 'withdrawal' ? styles.negative : styles.positive
                      }`}
                    >
                      {operation.type === 'withdrawal' ? '-' : '+'}
                      {formatAmount(operation.amount)} ₽
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