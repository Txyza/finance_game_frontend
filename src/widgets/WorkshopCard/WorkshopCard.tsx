import { FC } from 'react'
import { Card, Bubble } from '@shared/ui'
import styles from './WorkshopCard.module.css'

interface WorkshopCardProps {
  title: string
  subtitle: string
  level: string
  participants?: number
  tags?: string[]
  gradient?: 'mint-melissa' | 'raspberry-sakura' | 'violet-cumin'
  className?: string
  onClick?: () => void
}

export const WorkshopCard: FC<WorkshopCardProps> = ({
  title,
  subtitle,
  level,
  participants,
  tags = [],
  gradient = 'violet-cumin',
  className = '',
  onClick
}) => {
  return (
    <Card
      background="gradient"
      gradientType={gradient}
      padding="large"
      className={`${styles.workshopCard} ${className}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <Bubble variant="black" size="small">
          {level}
        </Bubble>
        {participants && (
          <Bubble variant="outline" size="small">
            👥 {participants}
          </Bubble>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.graphic}>
          <div className={styles.shape1}></div>
          <div className={styles.shape2}></div>
          <div className={styles.shape3}></div>
        </div>

        <div className={styles.text}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <Bubble
              key={index}
              variant={index % 2 === 0 ? 'black' : 'outline'}
              size="small"
            >
              {tag}
            </Bubble>
          ))}
        </div>
      )}

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