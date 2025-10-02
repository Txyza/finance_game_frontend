import React from 'react'
import { useMemoryGameStore } from '../../model/gameStore'
import { MemoryCard } from '../MemoryCard/MemoryCard'
import styles from './MemoryBoard.module.css'

interface MemoryBoardProps {
  gameEnded?: boolean
}

export const MemoryBoard: React.FC<MemoryBoardProps> = ({ gameEnded = false }) => {
  const { board, flipCard, selectedCards, isGameActive } = useMemoryGameStore()

  const handleCardClick = (cardId: string) => {
    if (selectedCards.length >= 2 || gameEnded) return
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
            disabled={!isGameActive || selectedCards.length >= 2 || gameEnded}
          />
        ))}
      </div>
    </div>
  )
}