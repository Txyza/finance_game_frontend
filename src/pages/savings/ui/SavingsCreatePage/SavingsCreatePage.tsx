import { FC, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser, useSavings } from '@shared/hooks'
import styles from './SavingsCreatePage.module.css'

export const SavingsCreatePage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useUser()
  const { createAccount, isLoading, error: apiError } = useSavings()
  const [amount, setAmount] = useState<string>('')
  const [error, setError] = useState<string>('')

  const accountType = searchParams.get('type') || 'basic'
  const userBalance = parseFloat(user?.debet_money || '0')

  const accountInfo = useMemo(() => {
    const keyRate = parseFloat(user?.key_rate || '8.5')

    if (accountType === 'premium') {
      return {
        name: 'Премиум',
        description: 'с пополнением, повышенным процентом, со снятием начисленных процентов',
        minAmount: 100000,
        maxRate: keyRate - 1.5
      }
    }

    return {
      name: 'Накопительный счет',
      description: 'с пополнением, со снятием начисленных процентов',
      minAmount: 0,
      maxRate: keyRate - 1
    }
  }, [accountType, user?.key_rate])

  const quickAmounts = useMemo(() => {
    const amounts = []
    if (userBalance >= 10000) amounts.push(10000)
    if (userBalance >= 50000) amounts.push(50000)
    if (userBalance >= 100000) amounts.push(100000)
    if (userBalance >= 500000) amounts.push(500000)
    if (userBalance >= 1000000) amounts.push(1000000)
    return amounts
  }, [userBalance])

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    setAmount(cleanValue)
    setError('')

    const numericValue = parseInt(cleanValue) || 0

    if (numericValue > userBalance) {
      setError('Сумма не может превышать баланс дебетовой карты')
    } else if (numericValue < accountInfo.minAmount) {
      if (accountInfo.minAmount > 0) {
        setError(`Минимальная сумма для этого счета: ${formatAmount(accountInfo.minAmount)} ₽`)
      }
    }
  }

  const handleQuickAmountSelect = (value: number) => {
    setAmount(value.toString())
    setError('')
  }

  const handleCreateAccount = async () => {
    const numericAmount = parseInt(amount) || 0

    if (!amount || numericAmount === 0) {
      setError('Укажите сумму для открытия счета')
      return
    }

    if (numericAmount > userBalance) {
      setError('Сумма не может превышать баланс дебетовой карты')
      return
    }

    if (numericAmount < accountInfo.minAmount) {
      if (accountInfo.minAmount > 0) {
        setError(`Минимальная сумма для этого счета: ${formatAmount(accountInfo.minAmount)} ₽`)
        return
      }
    }

    const account = await createAccount({
      type: accountType as 'basic' | 'premium',
      initial_amount: numericAmount
    })

    if (account) {
      navigate(`/savings/success?type=${accountType}&amount=${amount}&accountId=${account.id}`)
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
              onClick={() => navigate('/savings/select')}
            >
              ← Назад
            </Button>

            <h1 className={styles.title}>Открытие счета</h1>
          </div>

          <div className={styles.formCard}>
            <div className={styles.field}>
              <p className={styles.label}>Название счета</p>
              <div className={styles.value}>{accountInfo.name}</div>
            </div>

            <div className={styles.field}>
              <p className={styles.label}>Валюта</p>
              <div className={styles.value}>Российский рубль (RUB)</div>
            </div>

            <div className={styles.field}>
              <p className={styles.label}>Стоимость открытия</p>
              <div className={styles.value}>Бесплатно</div>
            </div>

            <div className={styles.balanceInfo}>
              <span className={styles.balanceLabel}>Доступно на дебетовой карте</span>
              <span className={styles.balanceAmount}>
                {formatAmount(userBalance)} ₽
              </span>
            </div>

            <div className={styles.field}>
              <p className={styles.label}>Сумма счета</p>
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
                onClick={handleCreateAccount}
                disabled={!!error || !amount || isLoading}
              >
                {isLoading ? 'Создание...' : 'Открыть счет'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}