import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, ParticleBackground } from '@shared/ui'
import { userApi } from '@shared/api'
import { useUserContext } from '@shared/context'
import styles from './OnboardingPage.module.css'

type OnboardingStep = 'name' | 'card'

interface CardData {
  id: string
  name: string
  service_fee: string
  benefits: string[]
  className: string
}

const cards: CardData[] = [
  {
    id: 'smart_mir',
    name: 'Умная дебетовая карта "Мир"',
    service_fee: 'бесплатно',
    benefits: [
      '100% кэшбэк в супермаркетах',
      'Переводы без комиссии - до 150 000 рублей в месяц',
      'Бесплатное снятие наличных - до 200 000 рублей в месяц',
      'До 20% кэшбэк у партнеров',
      'Оплата с Gazprom Pay'
    ],
    className: styles.cardSmart
  },
  {
    id: 'supreme_mir',
    name: 'Премиальная карта Mir Supreme',
    service_fee: '2990 ₽',
    benefits: [
      'Переводы без комиссии - до 1 000 000 рублей в месяц',
      'До 16,5% на остаток',
      'Кэшбек - 15% со всех трат',
      'Скидки и специальные предложения'
    ],
    className: styles.cardSupreme
  }
]

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const { refetchUser } = useUserContext()
  const [step, setStep] = useState<OnboardingStep>('name')
  const [name, setName] = useState('')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNameNext = () => {
    if (name.trim()) {
      setStep('card')
    }
  }

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId)
  }

  const handleComplete = async () => {
    if (!selectedCard) return

    setIsLoading(true)
    setError(null)

    try {
      await userApi.createUser({ starter_card: selectedCard })
      await refetchUser()
      navigate('/')
    } catch (err: any) {
      setError('Произошла ошибка при регистрации. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <div className={styles.container}>
        <div className={styles.content}>
          {step === 'name' ? (
            <div className={styles.stepContent}>
              <h1 className={styles.title}>Добро пожаловать в Cash-lvl!</h1>
              <p className={styles.subtitle}>Выберите имя персонажа</p>

              <div className={styles.inputContainer}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите имя персонажа"
                  className={styles.nameInput}
                  maxLength={50}
                />
              </div>

              <Button
                onClick={handleNameNext}
                disabled={!name.trim()}
                size="large"
                variant="primary"
                className={styles.continueButton}
              >
                Продолжить
              </Button>
            </div>
          ) : (
            <div className={styles.stepContent}>
              <h1 className={styles.title}>Выберите дебетовую карту</h1>
              <p className={styles.subtitle}>Выберите карту, с которой начнете свой путь</p>

              <div className={styles.cardsGrid}>
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={`${styles.cardWrapper} ${
                      selectedCard === card.id ? styles.selected : ''
                    }`}
                    onClick={() => handleCardSelect(card.id)}
                  >
                    <div className={`${styles.cardVisual} ${card.className}`}>
                      <div className={styles.cardContent}>
                        <div className={styles.cardLogo}>ГАЗПРОМБАНК</div>
                        <div className={styles.cardChip}></div>
                        {card.id === 'smart_mir' ? (
                          <div className={styles.cardCashback}>100%</div>
                        ) : (
                          <div className={styles.cardSupremeText}>
                            <div>SUPREME</div>
                            <div className={styles.mirLogo}>MIR<br/>SUPREME</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardName}>{card.name}</h3>
                      <div className={styles.cardService}>
                        Обслуживание: <span className={styles.price}>{card.service_fee}</span>
                      </div>

                      <div className={styles.benefits}>
                        <h4 className={styles.benefitsTitle}>Преимущества:</h4>
                        <ul className={styles.benefitsList}>
                          {card.benefits.map((benefit, index) => (
                            <li key={index} className={styles.benefitItem}>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.actions}>

                <Button
                  onClick={handleComplete}
                  disabled={!selectedCard || isLoading}
                  variant="primary"
                  size="large"
                  className={styles.completeButton}
                >
                  {isLoading ? 'Создание...' : 'Начать игру'}
                </Button>
                <Button
                  onClick={() => setStep('name')}
                  variant="outline"
                  size="large"
                >
                  Назад
                </Button>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}