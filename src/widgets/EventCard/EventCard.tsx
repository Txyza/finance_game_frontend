import { FC } from 'react'
import { Card, Bubble } from '@shared/ui'
import styles from './EventCard.module.css'

interface EventCardProps {
  title: string
  description: string
  date: string
  time: string
  location: string
  imageUrl?: string
  status?: 'mitap' | 'workshop' | 'conference'
  className?: string
  onClick?: () => void
}

export const EventCard: FC<EventCardProps> = ({
  title,
  description,
  date,
  time,
  location,
  imageUrl,
  status = 'mitap',
  className = '',
  onClick
}) => {
  const statusVariants = {
    mitap: 'primary',
    workshop: 'gradient-raspberry',
    conference: 'gradient-mint'
  } as const

  return (
    <Card
      background={imageUrl ? 'image' : 'gradient'}
      gradientType="violet-cumin"
      imageUrl={imageUrl}
      overlay={!!imageUrl}
      padding="large"
      className={`${styles.eventCard} ${className}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <Bubble variant={statusVariants[status]} size="small">
          {status.toUpperCase()}
        </Bubble>
        {date && time && (
          <div className={styles.dateTime}>
            <Bubble variant="black" size="small">
              {date}
            </Bubble>
            <Bubble variant="raspberry" size="small">
              {time}
            </Bubble>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        {location && (
          <div className={styles.location}>
            <span className={styles.locationIcon}>📍</span>
            {location}
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
          </svg>
          <span>ГАЗПРОМБАНК ТЕХ</span>
        </div>
      </div>
    </Card>
  )
}