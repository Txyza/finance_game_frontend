import { FC } from 'react'
import { Badge, Button, Bubble } from '@shared/ui'
import maskotImage from '@shared/assets/images/maskot.png'
import styles from './CharacterArea.module.css'

interface CharacterAreaProps {
  characterName?: string
  taskNotificationCount?: number
  onDailyClick: () => void
  onNotificationsClick: () => void
  onLeaderboardClick: () => void
  onFriendsClick: () => void
  onWorkClick: () => void
  onCityClick: () => void
}

export const CharacterArea: FC<CharacterAreaProps> = ({
  characterName = "Ваш персонаж",
  taskNotificationCount = 0,
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
          <Badge count={taskNotificationCount} variant="red" size="small">
            <button className={styles.iconButton} onClick={onDailyClick}>
              🎁
            </button>
          </Badge>
          <button className={styles.iconButton} onClick={onNotificationsClick}>
            📰
          </button>
        </div>

        {/* Центральный персонаж */}
        <div className={styles.character} data-tour="character">
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
          data-tour="work-button"
        >
          Работать
        </Button>
      </div>
    </div>
  )
}