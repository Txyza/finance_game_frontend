import { FC, ReactNode } from 'react'
import { Bubble } from '@shared/ui'
import styles from './ShopItem.module.css'

interface ShopItemProps {
  title: string
  description?: string
  icon?: ReactNode
  reward: string
  price: string
  currency?: 'rub' | 'premium' | 'game'
  disabled?: boolean
  onPurchase: () => void
  className?: string
}

export const ShopItem: FC<ShopItemProps> = ({
  title,
  description,
  icon,
  reward,
  price,
  currency = 'rub',
  onPurchase,
  className = ''
}) => {
  const currencySymbol = currency === 'premium' ? '⭐' : '₽'

  return (
    <div className={`${styles.item} ${className}`} onClick={onPurchase}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {icon && <div className={styles.icon}>{icon}</div>}
        <div className={styles.reward}>{reward}</div>
      </div>
      <div className={styles.actions}>
        <Bubble
          variant="gradient-mint"
          size="small"
        >
          {price} {currencySymbol}
        </Bubble>
      </div>
    </div>
  )
}