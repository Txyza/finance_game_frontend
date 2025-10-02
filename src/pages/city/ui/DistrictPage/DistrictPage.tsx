import { FC, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS, Step, EVENTS } from 'react-joyride'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { useUserContext, useTourContext } from '@shared/context'
import { calculateLevel } from '@shared/utils/levelCalculator'
import { DISTRICTS_DATA, DistrictId } from '../../model/types'
import safeCityImage from '@shared/assets/images/safe_city.png'
import shoppingCityImage from '@shared/assets/images/shopping_city.png'
import styles from './DistrictPage.module.css'

export const DistrictPage: FC = () => {
  const { districtId } = useParams<{ districtId: string }>()
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { shouldShowSafeDistrictFirstVisitTour, setSafeDistrictFirstVisitTourCompleted, isStateLoaded } = useTourContext()
  const [runSafeDistrictFirstVisitTour, setRunSafeDistrictFirstVisitTour] = useState(false)

  // Получаем реальный уровень пользователя
  const playerLevel = user ? calculateLevel(user.experience) : 1

  const district = DISTRICTS_DATA.find(d => d.id === districtId as DistrictId)

  // Проверяем доступ к району
  useEffect(() => {
    if (district && playerLevel < district.requiredLevel) {
      // Если нет доступа к району, перенаправляем на главную страницу города
      navigate('/city', { replace: true })
    }
  }, [district, playerLevel, navigate])

  // Эффект для запуска тура первого посещения безопасного района
  useEffect(() => {
    if (districtId === 'safe' && shouldShowSafeDistrictFirstVisitTour && isStateLoaded) {
      // Ждем отрисовки зданий для тура
      const checkElementsAndStartTour = () => {
        const depositsElement = document.querySelector('[data-tour="deposits-building"]')
        const savingsElement = document.querySelector('[data-tour="savings-building"]')

        // Проверяем не только наличие, но и видимость элементов
        const isElementVisible = (element: Element | null) => {
          if (!element) return false
          const rect = element.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0
        }

        if (depositsElement && savingsElement && isElementVisible(depositsElement) && isElementVisible(savingsElement)) {
          setRunSafeDistrictFirstVisitTour(true)
        } else {
          // Если элементы еще не готовы, проверяем снова через 100мс
          setTimeout(checkElementsAndStartTour, 100)
        }
      }

      // Начинаем проверку через 200мс после монтирования
      setTimeout(checkElementsAndStartTour, 200)
    }
  }, [districtId, shouldShowSafeDistrictFirstVisitTour, isStateLoaded])

  if (!district) {
    return (
      <div className="common-page-background">
        <div className={styles.content}>
          <h1>Район не найден</h1>
          <Button onClick={() => navigate('/city')}>
            ← Вернуться к карте
          </Button>
        </div>
      </div>
    )
  }

  const safeDistrictFirstVisitTourSteps: Step[] = [
    {
      target: '[data-tour="deposits-building"]',
      content: (
        <div>
          <h4>🏦 Вклады</h4>
          <p>Это <strong>вклады</strong> — один из самых безопасных способов сохранить и приумножить деньги.</p>
          <p>Ты размещаешь деньги в банке на определенный срок под фиксированную процентную ставку.</p>
          <p><strong>Особенности вклада:</strong></p>
          <ul>
            <li>💰 Фиксированная доходность</li>
            <li>🔒 Нельзя снимать деньги до окончания срока</li>
            <li>🏛️ Застрахованы государством</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
      spotlightPadding: 20
    },
    {
      target: '[data-tour="savings-building"]',
      content: (
        <div>
          <h4>💳 Накопительные счета</h4>
          <p>А это <strong>накопительные счета</strong> — более гибкий инструмент для накоплений.</p>
          <p><strong>Особенности накопительного счета:</strong></p>
          <ul>
            <li>📈 Переменная процентная ставка</li>
            <li>💸 Можно пополнять и снимать деньги в любое время</li>
            <li>🎯 Отлично подходит для краткосрочных целей</li>
          </ul>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
      spotlightPadding: 20
    },
    {
      target: 'body',
      content: (
        <div>
          <h4>🤔 В чем разница?</h4>
          <p><strong>Вклад</strong> — это как сейф: положил деньги, заперли и ждешь. Доходность фиксированная, но снять нельзя.</p>
          <p><strong>Накопительный счет</strong> — это как копилка: можешь добавлять и брать деньги когда нужно.</p>
          <p>💡 Для экстренных ситуаций лучше накопительный счет, для долгосрочных целей — вклад.</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="savings-building"]',
      content: (
        <div>
          <h4>🎯 Давай попробуем!</h4>
          <p>Отличный способ начать — открыть накопительный счет. Это безопасно и гибко!</p>
          <p>Нажми на здание <strong>«Накопительные счета»</strong>, чтобы узнать больше и открыть свой первый счет.</p>
          <p>🏆 Это поможет тебе сделать первый шаг в мире финансов!</p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 20
    }
  ]

  const handleSafeDistrictFirstVisitTourCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data

    console.log('Safe district first visit tour callback:', { status, action, index, type })

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRunSafeDistrictFirstVisitTour(false)
      setSafeDistrictFirstVisitTourCompleted()
    }

    // Если на последнем шаге кликнули на spotlight элемент (Накопительные счета)
    if (index === 3 && (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND)) {
      console.log('Клик по spotlight на Накопительных счетах, завершаем тур и переходим')
      setRunSafeDistrictFirstVisitTour(false)
      setSafeDistrictFirstVisitTourCompleted()
      // Переходим в накопительные счета
      navigate('/savings')
    }
  }

  const handleBuildingClick = (buildingId: string) => {
    console.log(`Clicked building: ${buildingId}`)

    // Если тур первого посещения активен и кликнули на накопительные счета
    if (runSafeDistrictFirstVisitTour && buildingId === 'savings') {
      setRunSafeDistrictFirstVisitTour(false)
      setSafeDistrictFirstVisitTourCompleted()
      navigate('/savings')
      return
    }

    // Логика перехода к конкретным зданиям
    switch (buildingId) {
      case 'savings':
        navigate('/savings')
        break
      case 'deposits':
        navigate('/deposits')
        break
      default:
        console.log(`Здание ${buildingId} пока не реализовано`)
    }
  }

  // Функция для получения фонового изображения района
  const getDistrictBackgroundImage = (districtId: DistrictId): string | null => {
    switch (districtId) {
      case 'safe':
        return safeCityImage
      case 'shopping':
        return shoppingCityImage
      case 'credit':
        return null // Пока нет изображения
      case 'stock':
        return null // Пока нет изображения
      default:
        return null
    }
  }

  return (
    <div className="common-page-background">
      <Joyride
        steps={safeDistrictFirstVisitTourSteps}
        run={runSafeDistrictFirstVisitTour}
        callback={handleSafeDistrictFirstVisitTourCallback}
        continuous
        showSkipButton={false}
        showProgress={false}
        hideCloseButton
        disableOverlayClose
        disableCloseOnEsc
        spotlightClicks
        styles={{
          options: {
            primaryColor: '#fbbf24',
            backgroundColor: '#060698',
            textColor: '#ffffff',
            arrowColor: '#fbbf24',
            overlayColor: 'rgba(0, 0, 0, 0.8)',
            spotlightShadow: '0 0 25px rgba(251, 191, 36, 1)',
          },
          spotlight: {
            borderRadius: '12px',
            border: '3px solid #fbbf24',
            boxShadow: '0 0 25px rgba(251, 191, 36, 0.8), inset 0 0 25px rgba(251, 191, 36, 0.2)',
          },
          tooltip: {
            backgroundColor: '#060698',
            color: '#ffffff',
            fontSize: '14px',
            borderRadius: '12px',
            padding: '16px',
            border: '2px solid #fbbf24',
            boxShadow: '0 8px 25px rgba(251, 191, 36, 0.3)',
            maxWidth: '400px',
          },
          tooltipContent: {
            color: '#ffffff',
            padding: '0',
          },
          buttonNext: {
            backgroundColor: '#fbbf24',
            color: '#060698',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: '600',
            border: 'none',
            fontSize: '14px',
          },
          buttonBack: {
            color: '#fbbf24',
            marginRight: '8px',
            border: '2px solid #fbbf24',
            borderRadius: '8px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            fontWeight: '600',
            fontSize: '14px',
          },
        }}
        locale={{
          back: 'Назад',
          close: 'Закрыть',
          last: 'Понятно!',
          next: 'Далее',
        }}
      />

      <ParticleBackground
        particleCount={15}
        particleColor={district.color}
        animationSpeed="slow"
      />

      <GameHeaderContainer />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Button
              variant="gradient-mint"
              size="small"
              onClick={() => navigate('/city')}
            >
              ← Назад к карте
            </Button>

            <h1 className={styles.title} style={{ color: district.color }}>
              {district.name}
            </h1>
          </div>

          <div
            className={styles.districtMap}
            style={{
              backgroundImage: getDistrictBackgroundImage(district.id)
                ? `url(${getDistrictBackgroundImage(district.id)})`
                : undefined
            }}
          >
            {/* Оверлей для лучшей видимости зданий */}
            <div className={styles.mapOverlay}></div>

            <div className={styles.buildings}>
              {district.buildings.map(building => (
                <div
                  key={building.id}
                  className={styles.building}
                  style={{
                    left: `${building.position.x}%`,
                    top: `${building.position.y}%`,
                    opacity: playerLevel >= building.requiredLevel ? 1 : 0.5
                  }}
                  onClick={() => handleBuildingClick(building.id)}
                  data-tour={building.id === 'deposits' ? 'deposits-building' : building.id === 'savings' ? 'savings-building' : undefined}
                >
                  <div className={styles.buildingIcon}>
                    {building.icon}
                  </div>
                  <div className={styles.buildingName}>
                    {building.name}
                  </div>
                  {playerLevel < building.requiredLevel && (
                    <div className={styles.levelLock}>
                      🔒 Уровень {building.requiredLevel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}