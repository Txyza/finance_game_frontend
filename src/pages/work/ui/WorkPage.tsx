import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateGameUUID } from '../2048/model/gameStore'
import { generateGameUUID as generateMemoryUUID } from '../memory/model/gameStore'
import { ParticleBackground } from '@shared/ui'
import { BottomNavigation } from '@pages/main/ui/BottomNavigation'
import { GameHeader } from '@shared/ui'
import { WorkList } from './WorkList'
import { WorkGameData } from './WorkCard'
import styles from './WorkPage.module.css'

export const WorkPage: FC = () => {
  const navigate = useNavigate()

  // Mock данные игрока
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500
  }

  // Данные доступных игр
  const availableGames: WorkGameData[] = [
    {
      id: '2048',
      name: '2048',
      description: 'Собери плитку 2048 на поле 4x4',
      icon: '🎲',
      multiplier: 2.0,
      energyCost: 5,
      isAvailable: true
    },
    {
      id: 'memory',
      name: 'Память',
      description: 'Находи пары одинаковых карточек',
      icon: '🧠',
      multiplier: 1.0,
      energyCost: 2,
      isAvailable: true
    }
  ]

  // Обработчики действий
  const handleGameStart = useCallback((gameId: string) => {
    console.log(`Starting game: ${gameId}`)

    if (gameId === '2048') {
      // Генерируем новый UUID для сессии игры
      const gameSessionId = generateGameUUID()
      navigate(`/work/2048?id=${gameSessionId}`)
    } else if (gameId === 'memory') {
      // Генерируем новый UUID для сессии игры Memory
      const gameSessionId = generateMemoryUUID()
      navigate(`/work/memory?id=${gameSessionId}`)
    } else {
      // Для других игр пока что показываем уведомление
      console.log(`Game ${gameId} is not implemented yet`)
    }
  }, [navigate])

  const handleTabChange = useCallback((tab: string) => {
    console.log(`Navigation to ${tab}`)
    if (tab === 'character') {
      navigate('/')
    }
  }, [navigate])

  const handleCityClick = useCallback(() => {
    console.log('City clicked')
    // Здесь будет логика перехода в город
  }, [])

  return (
    <div className="common-page-background">
      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={20}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой */}
      <GameHeader
        variant="work"
        level={playerStats.level}
        currentExp={playerStats.currentExp}
        maxExp={playerStats.maxExp}
        energy={playerStats.energy}
        maxEnergy={playerStats.maxEnergy}
        money={playerStats.money}
      />

      {/* Основной контент */}
      <div className="common-content">
        {/* Список игр */}
        <WorkList
          games={availableGames}
          currentEnergy={playerStats.energy}
          onGameStart={handleGameStart}
        />
      </div>

      {/* Нижняя навигация */}
      <BottomNavigation
        activeTab="character"
        onTabChange={handleTabChange}
        onCityClick={handleCityClick}
      />
    </div>
  )
}