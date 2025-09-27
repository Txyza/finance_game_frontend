import { FC, useCallback } from 'react'
import { WorkCard, WorkGameData } from '../WorkCard'
import styles from './WorkList.module.css'

interface WorkListProps {
  games: WorkGameData[]
  currentEnergy: number
  onGameStart: (gameId: string) => void
}

export const WorkList: FC<WorkListProps> = ({ games, currentEnergy, onGameStart }) => {
  // Определяем доступность игры на основе энергии
  const gamesWithAvailability = games.map(game => ({
    ...game,
    isAvailable: currentEnergy >= game.energyCost
  }))

  const handleGameStart = useCallback((gameId: string) => {
    const game = games.find(g => g.id === gameId)
    if (game && currentEnergy >= game.energyCost) {
      onGameStart(gameId)
    }
  }, [games, currentEnergy, onGameStart])

  return (
    <div className={`${styles.workList} work-games-list`}>
      <div className={styles.container}>
        <h2 className={styles.title}>Выберите работу</h2>
        <div className={styles.gameGrid}>
          {gamesWithAvailability.map((game, index) => (
            <div
              key={game.id}
              className={styles.cardWrapper}
              style={{
                animationDelay: `${index * 100}ms`
              }}
              data-tour={index === 0 ? "work-card" : undefined}
              data-tour-step3={index === 0 ? "work-card-final" : undefined}
            >
              <WorkCard
                game={game}
                onStart={handleGameStart}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}