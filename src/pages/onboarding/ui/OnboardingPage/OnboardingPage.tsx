import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { Button, ParticleBackground } from '@shared/ui'
import { userApi } from '@shared/api'
import { useUserContext } from '@shared/context'
import onboardingImage from '@shared/assets/images/onboarding.png'
import styles from './OnboardingPage.module.css'

type OnboardingStep = 'welcome' | 'name' | 'card'

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
  const [step, setStep] = useState<OnboardingStep>('welcome')
  const [name, setName] = useState('')
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [runTour, setRunTour] = useState(false)

  const tourSteps: Step[] = [
    {
      target: '[data-card="smart_mir"]',
      content: (
        <div>
          <h4>🏦 Бесплатная дебетовая карта</h4>
          <p>Дебетовая карта необходима для повседневных трат, зачисления зарплаты и выплат для инвестиционных инструментов:</p>
          <ul>
            <li>💰 <strong>Бесплатная карта</strong></li>
            <li>🛒 <strong>100% кэшбэк</strong> в супермаркетах</li>
          </ul>
          <p><strong>Идеальна для начинающих!</strong></p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-card="supreme_mir"]',
      content: (
        <div>
          <h4>💎 Премиальная карта</h4>
          <p>Для активных пользователей:</p>
          <ul>
            <li>💳 <strong>2990 ₽ за обслуживание</strong></li>
            <li>💰 <strong>До 16,5%</strong> на остаток</li>
            <li>🎯 <strong>15% кэшбэк</strong> со всех трат</li>
          </ul>
          <p><strong>Для больших трат!</strong></p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    }
  ]

  const handleWelcomeClick = () => {
    setStep('name')
  }

  const isNameValid = (name: string) => {
    const trimmedName = name.trim()
    return trimmedName.length >= 2 && trimmedName.length <= 50 && /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(trimmedName)
  }

  const handleNameNext = () => {
    if (isNameValid(name)) {
      setStep('card')
      // Запускаем тур после небольшой задержки, чтобы компоненты успели отрендериться
      setTimeout(() => {
        setRunTour(true)
      }, 500)
    }
  }

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false)
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
      await userApi.createUser({ starter_card: selectedCard, name: name.trim() })
      await refetchUser()
      navigate('/')
    } catch (err: any) {
      setError('Произошла ошибка при регистрации. Попробуйте еще раз.')
    } finally {
      setIsLoading(false)
    }
  }

  if (step === 'welcome') {
    return (
      <div className={styles.welcome} onClick={handleWelcomeClick}>
        <img
          src={onboardingImage}
          alt="Добро пожаловать в Cash Level"
          className={styles.welcomeImage}
        />
      </div>
    )
  }

  return (
    <div className="common-page-background">
      <ParticleBackground />

      <Joyride
        steps={tourSteps}
        run={runTour}
        callback={handleJoyrideCallback}
        continuous
        showSkipButton
        showProgress={false}
        hideCloseButton
        disableOverlayClose
        styles={{
          options: {
            primaryColor: '#58ffff',
            backgroundColor: '#060698',
            textColor: '#ffffff',
            arrowColor: '#58ffff',
            overlayColor: 'rgba(0, 0, 0, 0.7)',
          },
          tooltip: {
            backgroundColor: '#060698',
            color: '#ffffff',
            fontSize: '14px',
            borderRadius: '12px',
            padding: '16px',
            border: '2px solid #58ffff',
            boxShadow: '0 8px 25px rgba(88, 255, 255, 0.3)',
            maxWidth: '320px',
          },
          tooltipContent: {
            color: '#ffffff',
            padding: '0',
          },
          buttonNext: {
            backgroundColor: '#58ffff',
            color: '#060698',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: '600',
            border: 'none',
            fontSize: '14px',
          },
          buttonBack: {
            color: '#58ffff',
            marginRight: '8px',
            border: '2px solid #58ffff',
            borderRadius: '8px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            fontWeight: '600',
            fontSize: '14px',
          },
          buttonSkip: {
            color: '#8d98a4',
            fontSize: '12px',
          },
        }}
        locale={{
          back: 'Назад',
          close: 'Закрыть',
          last: 'Готово',
          next: 'Далее',
          skip: 'Пропустить',
          open: 'Открыть'
        }}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          {step === 'name' ? (
            <div className={styles.stepContent}>
              <h1 className={styles.title}>Добро пожаловать в Cash-lvl!</h1>
              <p className={styles.subtitle}>Выберите имя персонажа</p>

              <div className={styles.inputContainer}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Введите имя персонажа"
                    className={styles.nameInput}
                    maxLength={50}
                  />
                  <div
                    className={`${styles.inputValidation} ${
                      isNameValid(name) ? styles.valid : styles.invalid
                    }`}
                  />
                </div>
                <div
                  className={`${styles.characterCounter} ${
                    name.length > 40 ? styles.warning : name.length >= 50 ? styles.error : ''
                  }`}
                >
                  {name.length}/50
                </div>

                {name.length > 0 && !isNameValid(name) && (
                  <div className={`${styles.validationHint} ${styles.error}`}>
                    Имя должно содержать только буквы и пробелы (от 2 до 50 символов)
                  </div>
                )}
              </div>

              <Button
                onClick={handleNameNext}
                disabled={!isNameValid(name)}
                size="large"
                variant="gradient-mint"
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
                    data-card={card.id}
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