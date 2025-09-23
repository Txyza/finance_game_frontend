import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Leaderboard,
  LeaderboardPlayer,
  LeaderboardItem,
  ParticleBackground
} from '@shared/ui'
import { GameHeader } from '@shared/ui'
import { BottomNavigation, TabType } from '@pages/main/ui/BottomNavigation/BottomNavigation'
import styles from './LeaderboardPage.module.css'

type LeaderboardCategory = 'money' | 'game2048' | 'memory'

export const LeaderboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>('money')
  const [activeTab, setActiveTab] = useState<TabType>('leaderboard')

  // Mock данные игрока
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 12500,
    bankRate: 8.5,
    inflation: 4.2
  }

  // Mock данные для лидерборда
  const mockPlayers: Record<LeaderboardCategory, LeaderboardPlayer[]> = {
    money: [
      { id: '1', nickname: 'CryptoKing', value: 150000, position: 1 },
      { id: '2', nickname: 'MoneyMaster', value: 125000, position: 2 },
      { id: '3', nickname: 'InvestorPro', value: 98000, position: 3 },
      { id: '4', nickname: 'WealthBuilder', value: 87500, position: 4 },
      { id: '5', nickname: 'FinanceGuru', value: 75000, position: 5 },
      { id: '6', nickname: 'TradingBot', value: 45000, position: 6 },
      { id: '7', nickname: 'StockLover', value: 38000, position: 7 },
      { id: '8', nickname: 'BankRoller', value: 32000, position: 8 },
      { id: '9', nickname: 'SavingsPro', value: 28000, position: 9 },
      { id: '10', nickname: 'CashFlow', value: 25000, position: 10 }
    ],
    game2048: [
      { id: '1', nickname: 'PuzzleMaster', value: 45000, position: 1 },
      { id: '2', nickname: 'BlocksKing', value: 38500, position: 2 },
      { id: '3', nickname: 'NumberWiz', value: 32000, position: 3 },
      { id: '4', nickname: 'TileHero', value: 28000, position: 4 },
      { id: '5', nickname: 'MergeMaster', value: 25000, position: 5 },
      { id: '6', nickname: 'GamePro', value: 22000, position: 6 },
      { id: '7', nickname: 'PuzzleFan', value: 18500, position: 7 }
    ],
    memory: [
      { id: '1', nickname: 'MemoryChamp', value: 25000, position: 1 },
      { id: '2', nickname: 'BrainPower', value: 22000, position: 2 },
      { id: '3', nickname: 'MindReader', value: 18500, position: 3 },
      { id: '4', nickname: 'ThinkFast', value: 16000, position: 4 },
      { id: '5', nickname: 'CardMaster', value: 14500, position: 5 },
      { id: '6', nickname: 'FlipExpert', value: 12500, position: 6 },
      { id: '7', nickname: 'RecallKing', value: 11000, position: 7 },
      { id: '8', nickname: 'PatternPro', value: 10200, position: 8 },
      { id: 'current', nickname: 'Ты', value: 9500, position: 9 },
      { id: '10', nickname: 'MatchMaker', value: 8500, position: 10 }
    ]
  }

  // Информация о текущем игроке для каждой категории
  const currentPlayerInfo: Record<LeaderboardCategory, { position: number; value: number } | null> = {
    money: { position: 15, value: 12500 }, // Не в топ-10
    game2048: null, // Нет данных
    memory: null // В топ-10 (9 место)
  }

  const categories = [
    { key: 'money' as const, label: 'Деньги', icon: '💰' },
    { key: 'game2048' as const, label: '2048', icon: '🎮' },
    { key: 'memory' as const, label: 'Память', icon: '🧠' }
  ]

  const handleCategoryChange = (category: LeaderboardCategory) => {
    setActiveCategory(category)
  }

  const getDisplayPlayers = (category: LeaderboardCategory) => {
    const players = mockPlayers[category]
    const hasCurrentPlayerOutsideTop = currentPlayerInfo[category] && !players.find(p => p.id === 'current')

    // Если текущий игрок не в топ-10, показываем только топ-8, чтобы поместились разделитель и текущий игрок
    if (hasCurrentPlayerOutsideTop) {
      return players.slice(0, 8)
    }

    return players
  }

  const handlePlayerClick = (player: LeaderboardPlayer) => {
    console.log('Player clicked:', player.nickname)
  }

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)

    if (tab === 'character') {
      navigate('/')
    } else if (tab === 'analytics') {
      navigate('/analytics')
    } else if (tab === 'leaderboard') {
      // Already on leaderboard page
      return
    } else {
      console.log(`Navigation to ${tab}`)
    }
  }, [navigate])

  const handleCityClick = useCallback(() => {
    console.log('City clicked')
  }, [])

  return (
    <div className="common-page-background">
      <ParticleBackground />

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

      <div className="common-content">
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>Рейтинг</h1>
          </div>

          {/* Категории */}
          <div className={styles.categories}>
            {categories.map((category) => (
              <button
                key={category.key}
                className={`${styles.categoryButton} ${
                  activeCategory === category.key ? styles.active : ''
                }`}
                onClick={() => handleCategoryChange(category.key)}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                <span className={styles.categoryLabel}>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Лидерборд */}
          <div className={styles.leaderboardContainer}>
            <Leaderboard
              players={getDisplayPlayers(activeCategory)}
              category={activeCategory}
              currentPlayerId="current"
              onPlayerClick={handlePlayerClick}
            />

            {/* Показываем позицию текущего игрока, если он не в топ-10 */}
            {currentPlayerInfo[activeCategory] && !mockPlayers[activeCategory].find(p => p.id === 'current') && (
              <div className={styles.currentPlayerSection}>
                <div className={styles.separator}>...</div>
                <LeaderboardItem
                  position={currentPlayerInfo[activeCategory]!.position}
                  nickname="Ты"
                  value={currentPlayerInfo[activeCategory]!.value}
                  category={activeCategory}
                  isCurrentPlayer={true}
                  onClick={() => console.log('Current player clicked')}
                />
              </div>
            )}

            {/* Показываем сообщение, если у игрока нет данных */}
            {!currentPlayerInfo[activeCategory] && !mockPlayers[activeCategory].find(p => p.id === 'current') && (
              <div className={styles.noDataSection}>
                <div className={styles.noDataText}>
                  Ты еще не участвовал в этой категории
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Нижняя навигация */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCityClick={handleCityClick}
      />
    </div>
  )
}