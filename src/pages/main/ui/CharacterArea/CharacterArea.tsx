import { FC } from 'react'
import { Button, Bubble } from '@shared/ui'
import maskotImage from '@shared/assets/images/maskot.png'
import styles from './CharacterArea.module.css'

interface CharacterAreaProps {
  characterName?: string
  onDailyClick: () => void
  onNotificationsClick: () => void
  onLeaderboardClick: () => void
  onFriendsClick: () => void
  onWorkClick: () => void
  onCityClick: () => void
}

export const CharacterArea: FC<CharacterAreaProps> = ({
  characterName = "Ваш персонаж",
  onDailyClick,
  onNotificationsClick,
  onLeaderboardClick,
  onFriendsClick,
  onWorkClick,
  onCityClick
}) => {
  return (
    <div className={styles.characterArea}>
      {/* Строка с персонажем в центре и иконками по бокам */}
      <div className={styles.characterRow}>
        {/* Боковые иконки - слева */}
        <div className={styles.sideLeft}>
          <button className={styles.iconButton} onClick={onDailyClick}>
            🎁
          </button>
          <button className={styles.iconButton} onClick={onNotificationsClick}>
            📰
          </button>
        </div>

        {/* Центральный персонаж */}
        <div className={styles.character}>
          <img
            src={maskotImage}
            alt="Маскот игры"
            className={styles.maskotImage}
          />
        </div>

        {/* Боковые иконки - справа */}
        <div className={styles.sideRight}>
          <button className={styles.iconButton} onClick={onLeaderboardClick}>
            🏆
          </button>
          <button className={styles.iconButton} onClick={onFriendsClick}>
            👥
          </button>
        </div>
      </div>

      {/* Основные действия */}
      <div className={styles.actions}>
        <Button
          variant="gradient-mint"
          size="large"
          fullWidth
          onClick={onWorkClick}
        >
          Работать
        </Button>
      </div>
    </div>
  )
}