import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser } from '@shared/hooks'
import styles from './SavingsSelectPage.module.css'

interface SavingsOption {
  id: string
  name: string
  description: string
  minAmount: number
  minTerm: string
  maxRate: number
  baseRate: number
  features: string[]
  isPremium: boolean
}

export const SavingsSelectPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const keyRate = parseFloat(user?.key_rate || '8.5')

  const savingsOptions: SavingsOption[] = [
    {
      id: 'basic',
      name: 'Накопительный счет',
      description: 'с пополнением, со снятием начисленных процентов',
      minAmount: 0,
      minTerm: 'Любой',
      maxRate: keyRate - 1,
      baseRate: keyRate - 3,
      features: [
        `Максимальная ставка <strong>${(keyRate - 1).toFixed(1)}%</strong>`,
        '24/7 - доступ к счету/деньгам',
        'Онлайн оформление',
        'Повышенная ставка - для новых клиентов в первые <strong>два дня</strong> при открытии счета онлайн',
        'Выплата процентов - каждый день'
      ],
      isPremium: false
    },
    {
      id: 'premium',
      name: 'Премиум',
      description: 'с пополнением, повышенным процентом, со снятием начисленных процентов',
      minAmount: 100000,
      minTerm: 'Любой',
      maxRate: keyRate - 1.5,
      baseRate: keyRate - 3,
      features: [
        `Максимальная ставка <strong>${(keyRate - 1.5).toFixed(1)}%</strong>`,
        'Повышенная ставка на сумму до <strong>1 млн ₽</strong>, на сумму выше действует базовая ставка',
        'При наличие премиум дебетовой карты = <strong>+1%</strong> к накопительному счету',
        'Выплата процентов - каждый день',
        '24/7 - доступ к счету/деньгам',
        'Надбавка за остаток на счету'
      ],
      isPremium: true
    }
  ]

  const handleSelectAccount = (accountId: string) => {
    navigate(`/savings/create?type=${accountId}`)
  }

  const toggleDetails = (accountId: string) => {
    setExpandedCard(expandedCard === accountId ? null : accountId)
  }

  const formatAmount = (amount: number) => {
    if (amount === 0) return 'Любая'
    return `${(amount / 1000).toFixed(0)}к ₽`
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
              ← Назад
            </Button>

            <h1 className={styles.title}>Выберите накопительный счет</h1>
          </div>

          <div className={styles.optionsGrid}>
            {savingsOptions.map((option) => (
              <div
                key={option.id}
                className={`${styles.optionCard} ${
                  expandedCard === option.id ? styles.expanded : ''
                } ${option.isPremium ? styles.premium : ''}`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.optionName}>{option.name}</h3>
                </div>

                <p className={styles.optionDescription}>{option.description}</p>

                <div className={styles.optionDetails}>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Минимальный срок</span>
                    <span className={styles.detailValue}>{option.minTerm}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Минимальная сумма</span>
                    <span className={styles.detailValue}>
                      {formatAmount(option.minAmount)}
                    </span>
                  </div>
                </div>

                {expandedCard === option.id && (
                  <div className={styles.expandedContent}>
                    <div className={styles.featuresList}>
                      {option.features.map((feature, index) => (
                        <div key={index} className={styles.feature}>
                          <span className={styles.featureIcon}>✓</span>
                          <span
                            className={styles.featureText}
                            dangerouslySetInnerHTML={{ __html: feature }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className={styles.baseRate}>
                      <span className={styles.baseRateLabel}>Базовая ставка счета:</span>
                      <span className={styles.baseRateValue}>
                        {option.baseRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => handleSelectAccount(option.id)}
                  >
                    Оформить
                  </Button>
                  <Button
                    variant="outline"
                    size="medium"
                    onClick={() => toggleDetails(option.id)}
                  >
                    {expandedCard === option.id ? 'Скрыть' : 'Подробнее'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}