import { FC, useCallback, useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS, Step, EVENTS, ACTIONS } from 'react-joyride'
import { ParticleBackground, GameHeaderContainer } from '@shared/ui'
import { SEO } from '@shared/components'
import { useTourContext } from '@shared/context'
import { CharacterArea } from './CharacterArea'
import { PlayerStats, GameActions } from '../model/types'
import styles from './MainPage.module.css'

export const MainPage: FC = () => {
  const navigate = useNavigate()
  const { shouldShowMainTour, setMainPageVisited, setMainTourCompletedAndWorkPageVisited, isStateLoaded } = useTourContext()
  const [runTour, setRunTour] = useState(false)

  const mainTourSteps: Step[] = [
    {
      target: '[data-tour="character"]',
      content: (
        <div>
          <h4>👋 Добро пожаловать в Cash-lvl!</h4>
          <p>Привет! Меня зовут Кэш, и я твой помощник в мире финансов!</p>
          <p>Давай познакомлю тебя с основами игры. Готов начать свой путь к финансовой грамотности?</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="game-header"]',
      content: (
        <div>
          <h4>📊 Важные показатели игрока</h4>
          <p>Здесь показываются твои основные показатели:</p>
          <ul>
            <li>🎯 <strong>Опыт</strong> - показывает, насколько хорошо ты разобрался в игре</li>
            <li>⚡ <strong>Энергия</strong> - тратится на работу и восстанавливается со временем</li>
            <li>💰 <strong>Деньги</strong> - твой заработанный капитал</li>
          </ul>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="market-indicators"]',
      content: (
        <div>
          <h4>📈 Финансовые показатели</h4>
          <p>Важные показатели игрового финансового мира:</p>
          <ul>
            <li>📉 <strong>Инфляция</strong> - влияет на покупательную способность</li>
            <li>🏦 <strong>Ключевая ставка</strong> - влияет на доходность вкладов и стоимость кредитов</li>
          </ul>
          <p>Ориентируясь на них, принимай решения: класть деньги на вклад, покупать акции, брать кредит или подождать!</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="work-button"]',
      content: (
        <div>
          <h4>💼 Работа - основа заработка</h4>
          <p>Чтобы зарабатывать деньги, нужно работать!</p>
          <p><strong>Нажми на эту кнопку "Работать", чтобы перейти к выбору профессии и завершить ознакомление!</strong></p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
      hideFooter: true,
      spotlightClicks: true,
      disableScrollParentFix: true,
      spotlightPadding: 20
    }
  ]

  // Отмечаем посещение страницы при монтировании
  useEffect(() => {
    console.log('MainPage загружена')
    setMainPageVisited()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Пустой массив зависимостей - выполняется только при монтировании

  // Отдельный эффект для запуска тура
  useEffect(() => {
    console.log('Проверка запуска тура. shouldShowMainTour:', shouldShowMainTour, 'isStateLoaded:', isStateLoaded)
    if (shouldShowMainTour && isStateLoaded) {
      // Ждем отрисовки всех компонентов, особенно маскота
      const checkElementsAndStartTour = () => {
        const characterElement = document.querySelector('[data-tour="character"]')
        const gameHeaderElement = document.querySelector('[data-tour="game-header"]')
        const marketIndicatorsElement = document.querySelector('[data-tour="market-indicators"]')
        const workButtonElement = document.querySelector('[data-tour="work-button"]')

        // Проверяем не только наличие, но и видимость элементов
        const isElementVisible = (element: Element | null) => {
          if (!element) return false
          const rect = element.getBoundingClientRect()
          return rect.width > 0 && rect.height > 0
        }

        console.log('Tour elements check:', {
          characterElement: !!characterElement,
          gameHeaderElement: !!gameHeaderElement,
          marketIndicatorsElement: !!marketIndicatorsElement,
          workButtonElement: !!workButtonElement,
          workButtonVisible: workButtonElement ? isElementVisible(workButtonElement) : false
        })

        if (characterElement && gameHeaderElement && marketIndicatorsElement && workButtonElement &&
            isElementVisible(characterElement) && isElementVisible(gameHeaderElement) &&
            isElementVisible(marketIndicatorsElement) && isElementVisible(workButtonElement)) {
          setRunTour(true)
        } else {
          // Если элементы еще не готовы, проверяем снова через 100мс
          setTimeout(checkElementsAndStartTour, 100)
        }
      }

      // Проверяем загрузку изображения маскота
      const checkMaskotImageLoaded = () => {
        const maskotImage = document.querySelector('[data-tour="character"] img') as HTMLImageElement
        if (maskotImage && maskotImage.complete && maskotImage.naturalHeight !== 0) {
          // Изображение загружено, запускаем проверку элементов
          setTimeout(checkElementsAndStartTour, 100)
        } else if (maskotImage) {
          // Изображение еще загружается, ждем события load
          maskotImage.addEventListener('load', () => {
            setTimeout(checkElementsAndStartTour, 100)
          }, { once: true })
          // Также устанавливаем таймаут на случай проблем с загрузкой
          setTimeout(checkElementsAndStartTour, 2000)
        } else {
          // Изображение еще не найдено, ждем
          setTimeout(checkMaskotImageLoaded, 100)
        }
      }

      // Начинаем проверку через 200мс после монтирования
      setTimeout(checkMaskotImageLoaded, 200)
    }
  }, [shouldShowMainTour, isStateLoaded]) // Зависим от shouldShowMainTour и isStateLoaded

  const handleTourCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data

    // Логируем для отладки
    console.log('Tour callback:', { status, action, index, type })

    // Специальная отладка для последнего шага
    if (index === 3) {
      const workButton = document.querySelector('[data-tour="work-button"]')
      console.log('Last step - work button element:', workButton)
      console.log('Last step - work button visible:', workButton ? workButton.getBoundingClientRect() : 'not found')
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      setRunTour(false)
      setMainTourCompletedAndWorkPageVisited()
    }

    // Если на последнем шаге кликнули на spotlight элемент (кнопка "Работать")
    if (index === 3 && (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND)) {
      console.log('Клик по spotlight на последнем шаге, переходим на /work')
      setRunTour(false)
      setMainTourCompletedAndWorkPageVisited() // Используем объединенный метод
      navigate('/work')
    }
  }

  // Обработчик клика на кнопку "Работать" во время тура
  const handleWorkClickDuringTour = () => {
    console.log('handleWorkClickDuringTour вызван, runTour:', runTour)
    // Если тур активен, завершаем его и сохраняем состояние
    if (runTour) {
      console.log('Завершение тура главной страницы...')
      setRunTour(false)
      setMainTourCompletedAndWorkPageVisited() // Сохраняем завершение тура и переход на работу одновременно
    }
    // Переходим на страницу работы
    console.log('Переходим на /work')
    navigate('/work')
  }

  // Mock данные игрока - мемоизируем чтобы избежать ненужных перерисовок
  const playerStats: PlayerStats = useMemo(() => ({
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500,
    bankRate: 8.5,
    inflation: 2
  }), [])

  // Обработчики игровых действий - мемоизируем весь объект
  const gameActions: GameActions = useMemo(() => ({
    onDailyClick: () => navigate('/tasks'),
    onNotificationsClick: () => navigate('/news'),
    onLeaderboardClick: () => navigate('/leaderboard'),
    onFriendsClick: () => console.log('Friends clicked'),
    onWorkClick: handleWorkClickDuringTour,
    onCityClick: () => console.log('City clicked')
  }), [navigate, handleWorkClickDuringTour])

  return (
    <>
      <SEO
        title="Cash-lvl - Главная | Финансовая образовательная игра"
        description="Начните свой путь к финансовой грамотности в игре Cash-lvl. Учитесь управлять деньгами, инвестировать и достигать финансовых целей в увлекательной игровой форме."
        canonicalUrl="https://cash-lvl.ru/"
      />

      <Joyride
        steps={mainTourSteps}
        run={runTour}
        callback={handleTourCallback}
        continuous
        showSkipButton={false}
        showProgress={false}
        hideCloseButton
        disableOverlayClose
        disableCloseOnEsc
        spotlightClicks
        styles={{
          options: {
            primaryColor: '#58ffff',
            backgroundColor: '#060698',
            textColor: '#ffffff',
            arrowColor: '#58ffff',
            overlayColor: 'rgba(0, 0, 0, 0.8)',
            spotlightShadow: '0 0 25px rgba(88, 255, 255, 1)',
          },
          spotlight: {
            borderRadius: '12px',
            border: '3px solid #58ffff',
            boxShadow: '0 0 25px rgba(88, 255, 255, 0.8), inset 0 0 25px rgba(88, 255, 255, 0.2)',
          },
          tooltip: {
            backgroundColor: '#060698',
            color: '#ffffff',
            fontSize: '14px',
            borderRadius: '12px',
            padding: '16px',
            border: '2px solid #58ffff',
            boxShadow: '0 8px 25px rgba(88, 255, 255, 0.3)',
            maxWidth: '350px',
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
        }}
        locale={{
          back: 'Назад',
          close: 'Закрыть',
          last: 'Понятно!',
          next: 'Далее',
        }}
      />

      <div className="common-page-background">
      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={30}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой игрока */}
      <GameHeaderContainer
        bankRate={playerStats.bankRate}
        inflation={playerStats.inflation}
      />

      {/* Основной контент */}
      <div className={styles.content}>
        {/* Центральная область с персонажем */}
        <CharacterArea
          onDailyClick={gameActions.onDailyClick}
          onNotificationsClick={gameActions.onNotificationsClick}
          onLeaderboardClick={gameActions.onLeaderboardClick}
          onFriendsClick={gameActions.onFriendsClick}
          onWorkClick={gameActions.onWorkClick}
          onCityClick={gameActions.onCityClick}
        />
      </div>
    </div>
    </>
  )
}