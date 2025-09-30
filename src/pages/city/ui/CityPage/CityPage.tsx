import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS, Step, EVENTS, ACTIONS } from 'react-joyride'
import { ParticleBackground, GameHeaderContainer } from '@shared/ui'
import { useUserContext, useTourContext } from '@shared/context'
import { calculateLevel } from '@shared/utils/levelCalculator'
import { CityMap } from '../CityMap'
import { DistrictId, DISTRICTS_DATA } from '../../model/types'
import styles from './CityPage.module.css'

export const CityPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { shouldShowCityFirstVisitTour, setCityPageVisited, setCityFirstVisitTourCompleted, isStateLoaded } = useTourContext()
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictId | null>(null)
  const [notification, setNotification] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  })
  const [runCityFirstVisitTour, setRunCityFirstVisitTour] = useState(false)

  // Получаем реальный уровень пользователя
  const playerLevel = user ? calculateLevel(user.experience) : 1

  // Mock данные для статистики
  const playerStats = {
    bankRate: 8.5,
    inflation: 2
  }

  const cityFirstVisitTourSteps: Step[] = [
    {
      target: 'body',
      content: (
        <div>
          <h4>🏛️ Добро пожаловать в финансовый город!</h4>
          <p>Отличная работа! Ты достиг 3-го уровня и теперь можешь изучать финансовые инструменты!</p>
          <p>Основа финансов — это накопление <strong>активов и пассивов</strong>, которые приносят доход.</p>
          <p>Не всегда достаточно просто работать, чтобы накопить на квартиру, дачу или машину.</p>
          <p>В городе мы научимся пользоваться финансовыми инструментами!</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="safe-district"]',
      content: (
        <div>
          <h4>🛡️ Безопасный район</h4>
          <p>Начнем с самого важного — <strong>Безопасного района</strong>!</p>
          <p>Здесь мы научимся:</p>
          <ul>
            <li>💰 <strong>Открывать вклады</strong> — размещай деньги под проценты в банке</li>
            <li>📊 <strong>Использовать накопительные счета</strong> — гибкое накопление с возможностью пополнения</li>
          </ul>
          <p>Это надежные инструменты для начала твоего финансового пути!</p>
          <p><strong>Нажми на Безопасный район, чтобы начать обучение!</strong></p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
      hideFooter: true,
      spotlightClicks: true,
      disableScrollParentFix: true,
      spotlightPadding: 20
    }
  ]

  // Отмечаем посещение страницы при монтировании
  useEffect(() => {
    console.log('CityPage загружена')
    setCityPageVisited()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Пустой массив зависимостей - выполняется только при монтировании

  // Эффект для запуска тура первого посещения города
  useEffect(() => {
    console.log('Проверка запуска тура первого посещения города. shouldShowCityFirstVisitTour:', shouldShowCityFirstVisitTour, 'isStateLoaded:', isStateLoaded)
    if (shouldShowCityFirstVisitTour && isStateLoaded) {
      // Ждем отрисовки безопасного района для второго шага
      const checkElementsAndStartTour = () => {
        const safeDistrictElement = document.querySelector('[data-tour="safe-district"]')

        // Проверяем не только наличие, но и видимость элементов
        const isElementVisible = (element: Element | null) => {
          if (!element) return false
          const rect = element.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0
        }

        console.log('City first visit tour elements check:', {
          safeDistrictElement: !!safeDistrictElement,
          safeDistrictVisible: safeDistrictElement ? isElementVisible(safeDistrictElement) : false
        })

        if (safeDistrictElement && isElementVisible(safeDistrictElement)) {
          setRunCityFirstVisitTour(true)
        } else {
          // Если элементы еще не готовы, проверяем снова через 100мс
          setTimeout(checkElementsAndStartTour, 100)
        }
      }

      // Начинаем проверку через 200мс после монтирования
      setTimeout(checkElementsAndStartTour, 200)
    }
  }, [shouldShowCityFirstVisitTour, isStateLoaded]) // Зависим от shouldShowCityFirstVisitTour и isStateLoaded

  const handleCityFirstVisitTourCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data

    // Логируем для отладки
    console.log('City first visit tour callback:', { status, action, index, type })

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRunCityFirstVisitTour(false)
      setCityFirstVisitTourCompleted()
    }

    // Если на последнем шаге кликнули на spotlight элемент (Безопасный район)
    if (index === 1 && (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND)) {
      console.log('Клик по spotlight на Безопасном районе, завершаем тур и переходим')
      setRunCityFirstVisitTour(false)
      setCityFirstVisitTourCompleted()
      // Переходим в безопасный район
      navigate('/city/district/safe')
    }
  }

  const handleDistrictClick = (districtId: DistrictId) => {
    const district = DISTRICTS_DATA.find(d => d.id === districtId)
    if (!district) return

    // Если тур первого посещения активен и кликнули на безопасный район
    if (runCityFirstVisitTour && districtId === 'safe') {
      setRunCityFirstVisitTour(false)
      setCityFirstVisitTourCompleted()
      navigate('/city/district/safe')
      return
    }

    if (playerLevel >= district.requiredLevel) {
      // Доступ есть, переходим к району
      navigate(`/city/district/${districtId}`)
    } else {
      // Доступа нет, показываем уведомление
      const districtName = {
        'safe': 'Безопасный район',
        'credit': 'Кредитный район',
        'shopping': 'ТЦ район',
        'stock': 'Биржевой район'
      }[districtId]

      setNotification({
        message: `${districtName} откроется на ${district.requiredLevel}-м уровне.`,
        visible: true
      })

      // Скрываем уведомление через 3 секунды
      setTimeout(() => {
        setNotification(prev => ({ ...prev, visible: false }))
      }, 3000)
    }
  }

  const handleDistrictHover = (districtId: DistrictId | null) => {
    setHoveredDistrict(districtId)
  }

  return (
    <div className="common-page-background">
      <Joyride
        steps={cityFirstVisitTourSteps}
        run={runCityFirstVisitTour}
        callback={handleCityFirstVisitTourCallback}
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

      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={20}
        particleColor="#fbbf24"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой игрока */}
      <GameHeaderContainer
        variant="main"
        bankRate={playerStats.bankRate}
        inflation={playerStats.inflation}
      />

      {/* Полноэкранная карта */}
      <div className={styles.mapFullscreen}>
        {/* Заголовок поверх карты */}
        <div className={styles.mapOverlay}>
          <h1 className={styles.title} data-tour="city-title">Финансовый город</h1>

          {/* Информация о выбранном районе */}
          {hoveredDistrict && (
            <div className={styles.districtInfo}>
              <span className={styles.districtName}>
                {hoveredDistrict === 'safe' && '🛡️ Безопасный район'}
                {hoveredDistrict === 'credit' && '💳 Кредитный район'}
                {hoveredDistrict === 'shopping' && '🛍️ ТЦ район'}
                {hoveredDistrict === 'stock' && '📈 Биржевой район'}
              </span>
            </div>
          )}
        </div>

        {/* Карта города на весь экран */}
        <CityMap
          onDistrictClick={handleDistrictClick}
          onDistrictHover={handleDistrictHover}
          hoveredDistrict={hoveredDistrict}
          playerLevel={playerLevel}
        />
      </div>

      {/* Уведомление о недоступном районе */}
      {notification.visible && (
        <div className={styles.notification}>
          <div className={styles.notificationContent}>
            <span className={styles.notificationIcon}>🔒</span>
            <span className={styles.notificationText}>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  )
}