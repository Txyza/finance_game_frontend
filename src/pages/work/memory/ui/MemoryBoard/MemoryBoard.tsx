import React from 'react'
import { useMemoryGameStore } from '../../model/gameStore'
import { MemoryCard } from '../MemoryCard/MemoryCard'
import styles from './MemoryBoard.module.css'

export const MemoryBoard: React.FC = () => {
  const { board, flipCard, selectedCards, isGameActive } = useMemoryGameStore()

  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2) return
    flipCard(cardId)
  }

  return (
    <div className={styles.boardContainer}>
      <div className={styles.board}>
        {board.map((card) => (
          <MemoryCard
            key={card.id}
            card={card}
            onClick={handleCardClick}
            disabled={!isGameActive || selectedCards.length >= 2}
          />
        ))}
      </div>
    </div>
  )
}