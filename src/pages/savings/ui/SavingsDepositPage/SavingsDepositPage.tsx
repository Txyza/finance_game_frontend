import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser, useSavings } from '@shared/hooks'
import { SavingsAccount } from '@shared/api'
import styles from './SavingsDepositPage.module.css'

export const SavingsDepositPage: FC = () => {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { user } = useUser()
  const { deposit, isLoading, error: apiError } = useSavings()
  const [account, setAccount] = useState<SavingsAccount | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loadingAccount, setLoadingAccount] = useState(true)

  const userBalance = parseFloat(user?.debet_money || '0')

  useEffect(() => {
    const loadAccountData = async () => {
      if (!accountId) return

      setLoadingAccount(true)

      // Мок данные для демонстрации (на основе ID)
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

      setTimeout(() => {
        const accountData = mockAccountsData[accountId]
        if (accountData) {
          setAccount(accountData)
        }
        setLoadingAccount(false)
      }, 500)
    }

    loadAccountData()
  }, [accountId])

  const quickAmounts = [10000, 25000, 50000, 100000].filter(amt => amt <= userBalance)

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const getAccountTypeName = (type: string) => {
    return type === 'premium' ? 'Премиум' : 'Накопительный счет'
  }

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    setAmount(cleanValue)
    setError('')

    const numericValue = parseInt(cleanValue) || 0

    if (numericValue > userBalance) {
      setError('Сумма не может превышать баланс дебетовой карты')
    } else if (numericValue <= 0 && cleanValue !== '') {
      setError('Укажите сумму для пополнения')
    }
  }

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString())
    setError('')
  }

  const handleDeposit = async () => {
    const numericAmount = parseInt(amount) || 0

    if (!amount || numericAmount === 0) {
      setError('Укажите сумму для пополнения')
      return
    }

    if (numericAmount > userBalance) {
      setError('Сумма не может превышать баланс дебетовой карты')
      return
    }

    // Здесь будет API вызов для пополнения
    // const result = await deposit(accountId!, numericAmount)

    // Для демонстрации - просто переходим обратно
    alert(`Пополнение на ${formatAmount(numericAmount)} ₽ выполнено успешно!`)
    navigate(`/savings/account/${accountId}`)
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
          <div className={styles.container}>
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
              onClick={() => navigate(`/savings/account/${accountId}`)}
            >
              ← Назад
            </Button>

            <h1 className={styles.title}>Пополнение счета</h1>
          </div>

          <div className={`${styles.formCard} ${account.type === 'premium' ? styles.premium : ''}`}>
            <div className={styles.accountInfo}>
              <h2 className={styles.accountName}>
                {getAccountTypeName(account.type)}
              </h2>
              <p className={styles.accountNumber}>
                №{account.id.slice(-8).toUpperCase()}
              </p>
            </div>

            <div className={styles.balanceSection}>
              <div className={styles.balanceInfo}>
                <p className={styles.balanceLabel}>Доступно на дебетовой карте</p>
                <p className={styles.balanceAmount}>
                  {formatAmount(userBalance)} ₽
                </p>
              </div>
            </div>

            <div className={styles.field}>
              <p className={styles.label}>Сумма пополнения</p>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="Введите сумму"
                  className={`${styles.input} ${error ? styles.error : ''}`}
                />
                <span className={styles.currency}>₽</span>
              </div>
              {(error || apiError) && (
                <p className={styles.errorMessage}>{error || apiError}</p>
              )}
            </div>

            {quickAmounts.length > 0 && (
              <div className={styles.field}>
                <p className={styles.label}>Быстрый выбор суммы</p>
                <div className={styles.quickAmounts}>
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => handleQuickAmountSelect(quickAmount)}
                      className={`${styles.quickAmount} ${
                        amount === quickAmount.toString() ? styles.selected : ''
                      }`}
                    >
                      {formatAmount(quickAmount)} ₽
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="large"
                onClick={handleDeposit}
                disabled={!!error || !amount || isLoading}
              >
                {isLoading ? 'Пополняем...' : 'Пополнить'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}