import { FC } from 'react'
import { Button, Bubble } from '@shared/ui'
import styles from './WorkCard.module.css'

export interface WorkGameData {
  id: string
  name: string
  description: string
  icon: string
  multiplier: number
  energyCost: number
  isAvailable: boolean
}

interface WorkCardProps {
  game: WorkGameData
  onStart: (gameId: string) => void
}

export const WorkCard: FC<WorkCardProps> = ({ game, onStart }) => {
  const handleStart = () => {
    if (game.isAvailable) {
      onStart(game.id)
    }
  }

  return (
    <div className={`${styles.card} ${!game.isAvailable ? styles.disabled : ''}`}>
      {/* Заголовок карточки */}
      <div className={styles.header}>
        <div className={styles.icon}>{game.icon}</div>
        <div className={styles.titleSection}>
          <h3 className={styles.title}>{game.name}</h3>
          <p className={styles.description}>{game.description}</p>
        </div>
      </div>

      {/* Параметры игры */}
      <div className={styles.parameters}>
        <Bubble variant="raspberry" size="medium" icon="💰">
          x{game.multiplier}
        </Bubble>
        <Bubble variant="raspberry" size="medium" icon="⚡">
          {game.energyCost}
        </Bubble>
      </div>

      {/* Кнопка действия */}
      <div className={styles.actions}>
        <Button
          variant={game.isAvailable ? "gradient-mint" : "outline"}
          size="small"
          fullWidth
          onClick={handleStart}
          disabled={!game.isAvailable}
        >
          {game.isAvailable ? "Начать работу" : "Недостаточно энергии"}
        </Button>
      </div>
    </div>
  )
}