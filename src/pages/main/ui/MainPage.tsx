import { FC, useState, useCallback } from 'react'
import { ParticleBackground } from '@shared/ui'
import { PlayerStatsHeader } from './PlayerStatsHeader'
import { CharacterArea } from './CharacterArea'
import { BottomNavigation, TabType } from './BottomNavigation'
import { PlayerStats, GameActions } from '../model/types'
import styles from './MainPage.module.css'

export const MainPage: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('character')

  // Mock данные игрока
  const playerStats: PlayerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500,
    bankRate: 8.5,
    inflation: 2
  }

  // Обработчики игровых действий
  const gameActions: GameActions = {
    onDailyClick: useCallback(() => {
      console.log('Daily tasks clicked')
    }, []),

    onNotificationsClick: useCallback(() => {
      console.log('Notifications clicked')
    }, []),

    onLeaderboardClick: useCallback(() => {
      console.log('Leaderboard clicked')
    }, []),

    onFriendsClick: useCallback(() => {
      console.log('Friends clicked')
    }, []),

    onWorkClick: useCallback(() => {
      console.log('Work clicked')
    }, []),

    onCityClick: useCallback(() => {
      console.log('City clicked')
    }, [])
  }

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)
    console.log(`Navigation to ${tab}`)
  }, [])

  return (
    <div className={styles.mainPage}>
      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={30}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      {/* Основной контент */}
      <div className={styles.content}>
        {/* Шапка со статистикой игрока */}
        <PlayerStatsHeader
          level={playerStats.level}
          currentExp={playerStats.currentExp}
          maxExp={playerStats.maxExp}
          energy={playerStats.energy}
          maxEnergy={playerStats.maxEnergy}
          money={playerStats.money}
          bankRate={playerStats.bankRate}
          inflation={playerStats.inflation}
        />

        {/* Центральная область с персонажем */}
        <CharacterArea
          onDailyClick={gameActions.onDailyClick}
          onNotificationsClick={gameActions.onNotificationsClick}
          onLeaderboardClick={gameActions.onLeaderboardClick}
          onFriendsClick={gameActions.onFriendsClick}
          onWorkClick={gameActions.onWorkClick}
          onCityClick={gameActions.onCityClick}
        />

        {/* Нижняя навигация */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onCityClick={gameActions.onCityClick}
        />
      </div>
    </div>
  )
}