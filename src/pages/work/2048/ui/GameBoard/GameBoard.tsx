import React, { useEffect, useRef } from 'react'
import { useGameStore } from '../../model/gameStore'
import { GameTile } from '../GameTile/GameTile'
import { Direction } from '../../model/types'
import styles from './GameBoard.module.css'

interface GameBoardProps {
  gameEnded?: boolean
}

export const GameBoard: React.FC<GameBoardProps> = ({ gameEnded = false }) => {
  const { board, makeMove, isGameOver, isWon } = useGameStore()
  const boardRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isGameOver || isWon || gameEnded) return

      let direction: Direction | null = null

      switch (event.key) {
        case 'ArrowUp':
          direction = 'up'
          break
        case 'ArrowDown':
          direction = 'down'
          break
        case 'ArrowLeft':
          direction = 'left'
          break
        case 'ArrowRight':
          direction = 'right'
          break
      }

      if (direction) {
        event.preventDefault()
        makeMove(direction)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [makeMove, isGameOver, isWon, gameEnded])

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y

    const minSwipeDistance = 50
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (Math.max(absX, absY) < minSwipeDistance) {
      touchStartRef.current = null
      return
    }

    let direction: Direction | null = null

    if (absX > absY) {
      // Horizontal swipe
      direction = deltaX > 0 ? 'right' : 'left'
    } else {
      // Vertical swipe
      direction = deltaY > 0 ? 'down' : 'up'
    }

    if (direction && !isGameOver && !isWon && !gameEnded) {
      makeMove(direction)
    }

    touchStartRef.current = null
  }

  const renderBoard = () => {
    // Проверяем, что board инициализирован
    if (!board || board.length === 0) {
      return Array.from({ length: 16 }, (_, index) => (
        <GameTile key={`empty-${index}`} tile={null} />
      ))
    }

    const tiles: React.ReactNode[] = []

    // Render tiles directly in grid positions
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const tile = board[row] ? board[row][col] : null
        tiles.push(
          <GameTile
            key={tile ? tile.id : `cell-${row}-${col}`}
            tile={tile}
          />
        )
      }
    }

    return tiles
  }

  return (
    <div className={styles.boardContainer}>
      <div
        ref={boardRef}
        className={styles.board}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        tabIndex={0}
      >
        {renderBoard()}
      </div>

      {(isGameOver || isWon) && (
        <div className={styles.gameOverlay}>
          <div className={styles.gameOverText}>
            🎉 Победа!
          </div>
        </div>
      )}
    </div>
  )
}