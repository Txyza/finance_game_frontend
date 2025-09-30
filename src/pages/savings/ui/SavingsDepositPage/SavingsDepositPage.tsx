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
  const { getAccount, deposit, isLoading, error: apiError } = useSavings()
  const [account, setAccount] = useState<SavingsAccount | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loadingAccount, setLoadingAccount] = useState(true)

  const userBalance = parseFloat(user?.debet_money || '0')

  useEffect(() => {
    const loadAccountData = async () => {
      if (!accountId) return

      setLoadingAccount(true)

      try {
        const accountData = await getAccount(accountId)
        if (accountData) {
          setAccount(accountData)
        }
      } catch (error) {
        console.error('Ошибка загрузки счета:', error)
        setAccount(null)
      } finally {
        setLoadingAccount(false)
      }
    }

    loadAccountData()
  }, [accountId, getAccount])

  const quickAmounts = [10000, 25000, 50000, 100000].filter(amt => amt <= userBalance)

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const getAccountTypeName = () => {
    return 'Накопительный счет'
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

    try {
      const result = await deposit(accountId!, numericAmount)
      if (result) {
        // Операция успешна - перенаправляем на страницу счета
        navigate(`/savings/account/${accountId}`)
      } else {
        setError('Ошибка при пополнении счета')
      }
    } catch (error) {
      console.error('Ошибка пополнения:', error)
      setError('Ошибка при пополнении счета')
    }
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

          <div className={styles.formCard}>
            <div className={styles.accountInfo}>
              <h2 className={styles.accountName}>
                {getAccountTypeName()}
              </h2>
              <p className={styles.accountNumber}>
                №{account.account_number}
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