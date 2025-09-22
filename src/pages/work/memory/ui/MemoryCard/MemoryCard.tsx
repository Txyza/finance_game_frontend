import React from 'react'
import { MemoryCard as MemoryCardType } from '../../model/types'
import styles from './MemoryCard.module.css'

interface MemoryCardProps {
  card: MemoryCardType
  onClick: (cardId: string) => void
  disabled?: boolean
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  card,
  onClick,
  disabled = false
}) => {
  const handleClick = () => {
    if (disabled || card.isFlipped || card.isMatched) return
    onClick(card.id)
  }

  const cardClasses = [
    styles.card,
    card.isFlipped && styles.flipped,
    card.isMatched && styles.matched
  ].filter(Boolean).join(' ')

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
    >
      <div className={styles.cardInner}>
        <div className={styles.cardFront}>
          <div className={styles.cardPattern}>?</div>
        </div>
        <div className={styles.cardBack}>
          <div className={styles.cardEmoji}>{card.emoji}</div>
        </div>
      </div>
    </div>
  )
}