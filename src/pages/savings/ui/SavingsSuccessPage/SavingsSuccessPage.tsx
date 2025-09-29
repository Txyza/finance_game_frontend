import { FC, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser } from '@shared/hooks'
import styles from './SavingsSuccessPage.module.css'

export const SavingsSuccessPage: FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useUser()

  const accountType = searchParams.get('type') || 'basic'
  const amount = parseInt(searchParams.get('amount') || '0')

  const accountInfo = useMemo(() => {
    const keyRate = parseFloat(user?.key_rate || '8.5')

    if (accountType === 'premium') {
      return {
        name: 'Премиум',
        description: 'с пополнением, повышенным процентом, со снятием начисленных процентов',
        maxRate: keyRate - 1.5,
        isPremium: true
      }
    }

    return {
      name: 'Накопительный счет',
      description: 'с пополнением, со снятием начисленных процентов',
      maxRate: keyRate - 1,
      isPremium: false
    }
  }, [accountType, user?.key_rate])

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value)
  }

  const handleGoToSavings = () => {
    navigate('/savings')
  }

  const handleGoToCity = () => {
    navigate('/city')
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />
      <GameHeaderContainer />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.successSection}>
            <div className={styles.successContent}>
              <div className={styles.checkmark}>✓</div>

              <h1 className={styles.title}>Счет открыт!</h1>

              <p className={styles.subtitle}>
                Поздравляем! Ваш накопительный счет успешно открыт и готов к использованию.
              </p>

              <div className={styles.accountCard}>
                <div className={styles.accountHeader}>
                  <h3 className={styles.accountName}>{accountInfo.name}</h3>
                  {accountInfo.isPremium && (
                    <div className={styles.premiumBadge}>ПРЕМИУМ</div>
                  )}
                </div>

                <div className={styles.accountDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Валюта</span>
                    <span className={styles.detailValue}>RUB</span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Начальная сумма</span>
                    <span className={`${styles.detailValue} ${styles.amount}`}>
                      {formatAmount(amount)} ₽
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Максимальная ставка</span>
                    <span className={`${styles.detailValue} ${styles.rate}`}>
                      {accountInfo.maxRate.toFixed(1)}% годовых
                    </span>
                  </div>

                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Статус</span>
                    <span className={styles.detailValue}>Активен</span>
                  </div>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleGoToSavings}
                  className={styles.primaryButton}
                >
                  Перейти к счетам
                </Button>

                <Button
                  variant="outline"
                  size="large"
                  onClick={handleGoToCity}
                >
                  Вернуться в город
                </Button>
              </div>

              <p className={styles.note}>
                Проценты начисляются ежедневно. Вы можете пополнять счет или снимать начисленные проценты в любое время.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}