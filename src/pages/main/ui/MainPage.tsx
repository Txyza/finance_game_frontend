import { FC, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeader } from '@shared/ui'
import { CharacterArea } from './CharacterArea'
import { PlayerStats, GameActions } from '../model/types'
import styles from './MainPage.module.css'

export const MainPage: FC = () => {
  const navigate = useNavigate()

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
      navigate('/tasks')
    }, [navigate]),

    onNotificationsClick: useCallback(() => {
      navigate('/news')
    }, [navigate]),

    onLeaderboardClick: useCallback(() => {
      navigate('/leaderboard')
    }, [navigate]),

    onFriendsClick: useCallback(() => {
      console.log('Friends clicked')
    }, []),

    onWorkClick: useCallback(() => {
      navigate('/work')
    }, [navigate]),

    onCityClick: useCallback(() => {
      console.log('City clicked')
    }, [])
  }

  return (
    <div className="common-page-background">
      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={30}
        particleColor="#58ffff"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой игрока */}
      <GameHeader
        level={playerStats.level}
        currentExp={playerStats.currentExp}
        maxExp={playerStats.maxExp}
        energy={playerStats.energy}
        maxEnergy={playerStats.maxEnergy}
        money={playerStats.money}
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
  )
}