import { FC, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import styles from './SavingsAccountSuccessPage.module.css'

export const SavingsAccountSuccessPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const accountData = useMemo(() => {
    const type = searchParams.get('type')
    const amount = searchParams.get('amount')
    const accountId = searchParams.get('accountId')

    if (!type || !amount || !accountId) {
      return null
    }

    return {
      type,
      amount: parseInt(amount),
      accountId
    }
  }, [searchParams])

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const getAccountTypeName = (type: string) => {
    return type === 'premium' ? 'Премиум' : 'Накопительный счет'
  }

  const handleGoToAccounts = () => {
    navigate('/savings')
  }

  const handleViewAccount = () => {
    if (accountData?.accountId) {
      navigate(`/savings/account/${accountData.accountId}`)
    }
  }

  if (!accountData) {
    return (
      <div className="common-page-background">
        <ParticleBackground />
        <GameHeaderContainer />
        <div className={styles.content}>
          <div className={styles.container}>
            <div className={styles.error}>
              <h2>Данные не найдены</h2>
              <Button onClick={() => navigate('/savings')}>
                Перейти к счетам
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
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <div className={styles.checkmark}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div className={styles.successContent}>
              <h1 className={styles.successTitle}>Счет успешно открыт!</h1>
              <p className={styles.successDescription}>
                Ваш накопительный счет активен и готов к использованию
              </p>
            </div>

            <div className={styles.accountSummary}>
              <h2 className={styles.summaryTitle}>
                {getAccountTypeName(accountData.type)}
              </h2>

              <div className={styles.summaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Номер счета</span>
                  <span className={styles.summaryValue}>
                    № {accountData.accountId.slice(-8).toUpperCase()}
                  </span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Начальный баланс</span>
                  <span className={styles.summaryValue}>
                    {formatAmount(accountData.amount)} ₽
                  </span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Валюта</span>
                  <span className={styles.summaryValue}>Российский рубль (RUB)</span>
                </div>

                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Статус</span>
                  <span className={styles.summaryValue}>Активен</span>
                </div>
              </div>

              <div className={styles.rateHighlight}>
                <div className={styles.rateInfo}>
                  <span className={styles.rateLabel}>Процентная ставка</span>
                  <span className={styles.rateValue}>
                    {accountData.type === 'premium' ? '7.0' : '7.5'}% годовых
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.nextSteps}>
              <h3 className={styles.nextStepsTitle}>Что дальше?</h3>
              <ul className={styles.nextStepsList}>
                <li>Пополняйте счет для увеличения доходности</li>
                <li>Отслеживайте начисление процентов</li>
                <li>Управляйте средствами в личном кабинете</li>
                <li>Снимайте средства в любое время</li>
              </ul>
            </div>

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="large"
                onClick={handleViewAccount}
                style={{ flex: 1 }}
              >
                Перейти к счету
              </Button>
              <Button
                variant="outline"
                size="large"
                onClick={handleGoToAccounts}
                style={{ flex: 1 }}
              >
                Все счета
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}