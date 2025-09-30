import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useSavings } from '@shared/hooks'
import { SavingsAccount } from '@shared/api'
import styles from './SavingsWithdrawPage.module.css'

export const SavingsWithdrawPage: FC = () => {
  const { accountId } = useParams<{ accountId: string }>()
  const navigate = useNavigate()
  const { getAccount, withdraw, isLoading, error: apiError } = useSavings()
  const [account, setAccount] = useState<SavingsAccount | null>(null)
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loadingAccount, setLoadingAccount] = useState(true)

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

  const quickAmounts = account
    ? [5000, 10000, 25000, 50000].filter(amt => amt <= account.balance)
    : []

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

    if (account && numericValue > account.balance) {
      setError('Сумма не может превышать баланс счета')
    } else if (numericValue <= 0 && cleanValue !== '') {
      setError('Укажите сумму для снятия')
    }
  }

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString())
    setError('')
  }

  const handleWithdraw = async () => {
    if (!account) return

    const numericAmount = parseInt(amount) || 0

    if (!amount || numericAmount === 0) {
      setError('Укажите сумму для снятия')
      return
    }

    if (numericAmount > account.balance) {
      setError('Сумма не может превышать баланс счета')
      return
    }

    try {
      const result = await withdraw(accountId!, numericAmount)
      if (result) {
        // Операция успешна - перенаправляем на страницу счета
        navigate(`/savings/account/${accountId}`)
      } else {
        setError('Ошибка при снятии средств')
      }
    } catch (error) {
      console.error('Ошибка снятия:', error)
      setError('Ошибка при снятии средств')
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

            <h1 className={styles.title}>Снятие со счета</h1>
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
                <p className={styles.balanceLabel}>Доступно на счете</p>
                <p className={styles.balanceAmount}>
                  {formatAmount(account.balance)} ₽
                </p>
              </div>
            </div>

            <div className={styles.warning}>
              <span className={styles.warningIcon}>⚠️</span>
              <p className={styles.warningText}>
                Средства будут переведены на дебетовую карту. При снятии основной суммы вклада проценты могут пересчитываться.
              </p>
            </div>

            <div className={styles.field}>
              <p className={styles.label}>Сумма для снятия</p>
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
                onClick={handleWithdraw}
                disabled={!!error || !amount || isLoading}
              >
                {isLoading ? 'Снимаем...' : 'Снять'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}