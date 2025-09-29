import { FC, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUser } from '@shared/hooks'
import styles from './DepositsSelectPage.module.css'

interface DepositOption {
  id: string
  name: string
  description: string
  minAmount: number
  minTerm: string
  features: string[]
  rates: {
    [key: number]: {
      endOfTerm: number
      monthlyCapitalized: number
      monthlyToAccount: number
    }
  }
}

export const DepositsSelectPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUser()
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const keyRate = parseFloat(user?.key_rate || '8.5')

  const depositOptions: DepositOption[] = useMemo(() => [
    {
      id: 'save',
      name: 'Вклад «Копить»',
      description: 'Без пополнения и снятия',
      minAmount: 15000,
      minTerm: 'от 2 дней',
      features: [
        `Максимальная ставка <strong>${(keyRate - 0.8).toFixed(1)}%</strong> за 4 дня`,
        '<strong>15 000 ₽</strong> - минимальная сумма при открытии в мобильном приложении',
        'Надбавка <strong>+0,2%</strong> - новым клиентам',
        'Онлайн оформление',
        'Выплата процентов - каждый день'
      ],
      rates: {
        2: { endOfTerm: keyRate - 0.8, monthlyCapitalized: keyRate - 1, monthlyToAccount: keyRate - 1 },
        4: { endOfTerm: keyRate - 1.2, monthlyCapitalized: keyRate - 1.4, monthlyToAccount: keyRate - 1.5 },
        6: { endOfTerm: keyRate - 1.2, monthlyCapitalized: keyRate - 1.5, monthlyToAccount: keyRate - 1.5 },
        8: { endOfTerm: keyRate - 2.3, monthlyCapitalized: keyRate - 2.6, monthlyToAccount: keyRate - 2.7 },
        10: { endOfTerm: keyRate - 2.6, monthlyCapitalized: keyRate - 2.9, monthlyToAccount: keyRate - 3 },
        12: { endOfTerm: keyRate - 3.5, monthlyCapitalized: keyRate - 3.8, monthlyToAccount: keyRate - 3.9 },
        15: { endOfTerm: keyRate - 4.6, monthlyCapitalized: keyRate - 5, monthlyToAccount: keyRate - 5.1 }
      }
    },
    {
      id: 'plus',
      name: 'Вклад «В плюсе»',
      description: 'Без пополнения и снятия',
      minAmount: 25000,
      minTerm: 'от 4 дней',
      features: [
        `Максимальная ставка <strong>${(keyRate - 0.7).toFixed(1)}%</strong>`,
        'При наличии премиум дебетовой карты = <strong>+0.5%</strong> к вкладу',
        'Надбавка <strong>+0,2%</strong> - если открывается первый раз',
        'Пополнение - Нет',
        'Частичное снятие - Нет'
      ],
      rates: {
        2: { endOfTerm: keyRate - 0.85, monthlyCapitalized: keyRate - 1, monthlyToAccount: keyRate - 1.2 },
        4: { endOfTerm: keyRate - 0.75, monthlyCapitalized: keyRate - 0.9, monthlyToAccount: keyRate - 1.1 },
        6: { endOfTerm: keyRate - 0.7, monthlyCapitalized: keyRate - 0.8, monthlyToAccount: keyRate - 1 },
        8: { endOfTerm: keyRate - 2, monthlyCapitalized: keyRate - 2.2, monthlyToAccount: keyRate - 2.4 },
        10: { endOfTerm: keyRate - 2.1, monthlyCapitalized: keyRate - 2.4, monthlyToAccount: keyRate - 2.6 },
        12: { endOfTerm: keyRate - 3.2, monthlyCapitalized: keyRate - 3.4, monthlyToAccount: keyRate - 3.5 },
        15: { endOfTerm: keyRate - 4.3, monthlyCapitalized: keyRate - 4.6, monthlyToAccount: keyRate - 4.8 }
      }
    }
  ], [keyRate])

  const handleSelectDeposit = (depositId: string) => {
    navigate(`/deposits/calculator?type=${depositId}`)
  }

  const toggleDetails = (depositId: string) => {
    setExpandedCard(expandedCard === depositId ? null : depositId)
  }

  const formatAmount = (amount: number) => {
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
              onClick={() => navigate('/deposits')}
            >
              ← Назад
            </Button>

            <h1 className={styles.title}>Выберите тип вклада</h1>
          </div>

          <div className={styles.optionsGrid}>
            {depositOptions.map((option) => (
              <div
                key={option.id}
                className={`${styles.optionCard} ${
                  expandedCard === option.id ? styles.expanded : ''
                }`}
              >
                <div className={styles.cardHeader}>
                  <h3 className={styles.optionName}>{option.name}</h3>
                </div>

                <p className={styles.optionDescription}>{option.description}</p>

                <div className={styles.optionGrid}>
                  <div className={styles.optionDetail}>
                    <p className={styles.detailLabel}>Минимальный срок</p>
                    <p className={styles.detailValue}>{option.minTerm}</p>
                  </div>
                  <div className={styles.optionDetail}>
                    <p className={styles.detailLabel}>Минимальная сумма</p>
                    <p className={styles.detailValue}>
                      {formatAmount(option.minAmount)}
                    </p>
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

                  </div>
                )}

                <div className={styles.cardActions}>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => handleSelectDeposit(option.id)}
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