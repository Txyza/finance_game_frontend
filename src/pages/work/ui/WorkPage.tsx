import { FC, useCallback, useMemo, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Joyride, { CallBackProps, STATUS, Step, EVENTS } from 'react-joyride'
import { ParticleBackground } from '@shared/ui'
import { GameHeaderContainer } from '@shared/ui'
import { useWork } from '@shared/hooks'
import { useUserContext, useTourContext } from '@shared/context'
import { WorkList } from './WorkList'
import { WorkGameData } from './WorkCard'
import styles from './WorkPage.module.css'

// Функция для получения иконки игры - вынесена за пределы компонента
const getGameIcon = (gameName: string): string => {
  const name = gameName.toLowerCase()
  if (name.includes('2048')) return '🎲'
  if (name.includes('memory') || name.includes('память')) return '🧠'
  if (name.includes('puzzle') || name.includes('головоломка')) return '🧩'
  return '🎮'
}

export const WorkPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { workList, startWork, loading, error } = useWork()
  const { shouldShowWorkTour, setWorkTourCompleted } = useTourContext()
  const [runTour, setRunTour] = useState(false)

  const workTourSteps: Step[] = [
    {
      target: '.work-games-list',
      content: (
        <div>
          <h4>💼 Добро пожаловать в бюро работы!</h4>
          <p>Здесь ты можешь выбирать различную работу и заработывать <strong>деньги</strong>.</p>
          <p>Каждая работа требует определенное <strong>количество энергии</strong> и дает разный <strong>доход</strong>!</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="work-card"]',
      content: (
        <div>
          <h4>🎮 Карточка работы</h4>
          <ul>
            <li>🎯 <strong>Название игры</strong> - тип работы</li>
            <li>⚡ <strong>Стоимость энергии</strong> - сколько потратишь</li>
            <li>💰 <strong>Множитель дохода</strong> - с увеличением опыта, увеличивается и множитель!</li>
          </ul>
          <p><strong>Нажми "Далее" чтобы продолжить!</strong></p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
    },
    {
      target: '[data-tour-step3="work-card-final"]',
      content: (
        <div>
          <h4>🚀 Начни свою первую работу!</h4>
          <p>Давай начнем зарабатывать!</p>
          <p>Твои результаты в игре определят, сколько денег ты получишь.</p>
          <p><strong>Кликни на карточку, чтобы начать работу и завершить обучение!</strong></p>
        </div>
      ),
      placement: 'top',
      disableBeacon: true,
      hideFooter: true,
      spotlightClicks: true,
    }
  ]

  // Преобразуем данные из API в формат для UI
  const availableGames: WorkGameData[] = useMemo(() => {
    if (!workList?.works) return []

    return workList.works.map(work => ({
      id: work.name.toLowerCase().replace(' ', '_'),
      name: work.name,
      description: work.description,
      icon: getGameIcon(work.name),
      multiplier: work.amount_booster,
      energyCost: work.energy,
      isAvailable: user ? user.energy >= work.energy : false
    }))
  }, [workList, user])


  // Эффект для запуска тура
  useEffect(() => {
    if (shouldShowWorkTour && availableGames.length > 0) {
      // Ждем отрисовки элементов
      const checkElementsAndStartTour = () => {
        const gamesList = document.querySelector('.work-games-list')
        const workCard = document.querySelector('[data-tour="work-card"]')
        const workCardFinal = document.querySelector('[data-tour-step3="work-card-final"]')

        if (gamesList && workCard && workCardFinal) {
          setTimeout(() => setRunTour(true), 300)
        } else {
          setTimeout(checkElementsAndStartTour, 100)
        }
      }

      setTimeout(checkElementsAndStartTour, 200)
    }
  }, [shouldShowWorkTour, availableGames.length])

  // Обработчик тура
  const handleTourCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data

    console.log('Work tour callback:', { status, action, index, type })

    // Обычное завершение тура (пропуск или финиш до последнего шага)
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any) && index < 2) {
      setRunTour(false)
      setWorkTourCompleted()
    }

    // Если на последнем шаге кликнули на spotlight элемент (карточка работы)
    if (index === 2 && type === EVENTS.TARGET_NOT_FOUND) {
      console.log('Клик по карточке работы на последнем шаге - завершаем тур и начинаем работу')
      setRunTour(false)
      setWorkTourCompleted()
      // Здесь мы не блокируем дальнейшее выполнение, чтобы клик прошел к карточке
    }
  }

  // Обработчик запуска игры
  const handleGameStart = useCallback(async (gameId: string) => {
    console.log(`Starting game: ${gameId}`)

    // Если тур активен, завершаем его при клике на карточку
    if (runTour) {
      console.log('Клик на карточку во время тура - завершаем тур')
      setRunTour(false)
      setWorkTourCompleted()
    }

    // Находим соответствующую работу из списка по gameId
    const selectedWork = workList?.works.find(work => {
      const workGameId = work.name.toLowerCase().replace(' ', '_')
      return workGameId === gameId || work.name.toLowerCase().includes(gameId.toLowerCase())
    })

    if (!selectedWork) {
      console.error('Work not found for gameId:', gameId)
      return
    }

    // Вызываем API для начала работы с именем работы
    const transactionId = await startWork(selectedWork.name)
    if (!transactionId) {
      console.error('Failed to start work session')
      return
    }

    console.log(`Started work "${selectedWork.name}" with transaction ID: ${transactionId}`)

    // Определяем какую игру запускать и переходим на нее с transaction ID
    if (gameId === '2048' || gameId.includes('2048')) {
      navigate(`/work/2048?transactionId=${transactionId}`)
    } else if (gameId === 'memory' || gameId === 'память' || gameId.includes('memory')) {
      navigate(`/work/memory?transactionId=${transactionId}`)
    } else {
      console.log(`Game ${gameId} is not implemented yet`)
    }
  }, [navigate, startWork, workList, runTour, setWorkTourCompleted])

  // Мемоизируем данные для GameHeaderContainer чтобы избежать ненужных перерисовок
  const headerProps = useMemo(() => ({
    bankRate: user?.key_rate ? parseFloat(user.key_rate) : undefined,
    inflation: user?.inflation ? parseFloat(user.inflation) : undefined
  }), [user?.key_rate, user?.inflation])

  return (
    <>
      <Joyride
        steps={workTourSteps}
        run={runTour}
        callback={handleTourCallback}
        continuous
        showSkipButton={false}
        showProgress={false}
        hideCloseButton
        disableOverlayClose
        styles={{
          options: {
            primaryColor: '#58ffff',
            backgroundColor: '#060698',
            textColor: '#ffffff',
            arrowColor: '#58ffff',
            overlayColor: 'rgba(0, 0, 0, 0.8)',
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
        particleCount={20}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой */}
      <GameHeaderContainer
        bankRate={headerProps.bankRate}
        inflation={headerProps.inflation}
      />

      {/* Основной контент */}
      <div className="common-content">
        {/* Список игр */}
        <WorkList
          games={availableGames}
          currentEnergy={user?.energy || 0}
          onGameStart={handleGameStart}
        />

        {/* Показываем ошибки если есть */}
        {error && (
          <div style={{
            color: '#ff6b6b',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0'
          }}>
            Ошибка загрузки игр: {error.message}
          </div>
        )}

        {/* Индикатор загрузки */}
        {loading && (
          <div style={{
            color: 'white',
            textAlign: 'center',
            padding: '32px'
          }}>
            Загружаем список игр...
          </div>
        )}
      </div>

    </div>
    </>
  )
}