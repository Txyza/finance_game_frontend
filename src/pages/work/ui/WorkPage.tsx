import { FC, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground } from '@shared/ui'
import { GameHeaderContainer } from '@shared/ui'
import { useWork } from '@shared/hooks'
import { useUserContext } from '@shared/context'
import { WorkList } from './WorkList'
import { WorkGameData } from './WorkCard'
import styles from './WorkPage.module.css'

export const WorkPage: FC = () => {
  const navigate = useNavigate()
  const { user } = useUserContext()
  const { workList, startWork, loading, error } = useWork()

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

  // Функция для получения иконки игры
  const getGameIcon = (gameName: string): string => {
    const name = gameName.toLowerCase()
    if (name.includes('2048')) return '🎲'
    if (name.includes('memory') || name.includes('память')) return '🧠'
    if (name.includes('puzzle') || name.includes('головоломка')) return '🧩'
    return '🎮'
  }

  // Обработчик запуска игры
  const handleGameStart = useCallback(async (gameId: string) => {
    console.log(`Starting game: ${gameId}`)

    // Вызываем API для начала работы
    const transactionId = await startWork()
    if (!transactionId) {
      console.error('Failed to start work session')
      return
    }

    // Определяем какую игру запускать и переходим на нее с transaction ID
    if (gameId === '2048' || gameId.includes('2048')) {
      navigate(`/work/2048?transactionId=${transactionId}`)
    } else if (gameId === 'memory' || gameId === 'память' || gameId.includes('memory')) {
      navigate(`/work/memory?transactionId=${transactionId}`)
    } else {
      console.log(`Game ${gameId} is not implemented yet`)
    }
  }, [navigate, startWork])



  return (
    <div className="common-page-background">
      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={20}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой */}
      <GameHeaderContainer
        variant="work"
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
  )
}