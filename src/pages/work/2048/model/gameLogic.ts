import { GameTile, Direction, Position } from './types'

const BOARD_SIZE = 4

export const createEmptyBoard = (): (GameTile | null)[][] => {
  return Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
}

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15)
}

export const getEmptyPositions = (board: (GameTile | null)[][]): Position[] => {
  const positions: Position[] = []
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!board[row][col]) {
        positions.push({ row, col })
      }
    }
  }
  return positions
}

export const addRandomTile = (board: (GameTile | null)[][]): (GameTile | null)[][] => {
  const emptyPositions = getEmptyPositions(board)
  if (emptyPositions.length === 0) return board

  const randomPosition = emptyPositions[Math.floor(Math.random() * emptyPositions.length)]
  const value = Math.random() < 0.9 ? 2 : 4

  const newBoard = board.map(row => [...row])
  newBoard[randomPosition.row][randomPosition.col] = {
    id: generateId(),
    value,
    position: randomPosition,
    isNew: true
  }

  return newBoard
}

export const initializeGame = (): (GameTile | null)[][] => {
  let board = createEmptyBoard()
  board = addRandomTile(board)
  board = addRandomTile(board)
  return board
}

const moveLeft = (board: (GameTile | null)[][]): { board: (GameTile | null)[][], score: number, moved: boolean } => {
  const newBoard = board.map(row => [...row])
  let totalScore = 0
  let moved = false

  for (let row = 0; row < BOARD_SIZE; row++) {
    const rowTiles = newBoard[row].filter(tile => tile !== null) as GameTile[]
    const mergedRow: (GameTile | null)[] = new Array(BOARD_SIZE).fill(null)

    let writeIndex = 0
    let i = 0

    while (i < rowTiles.length) {
      const currentTile = rowTiles[i]

      if (i + 1 < rowTiles.length && currentTile.value === rowTiles[i + 1].value) {
        // Merge tiles
        const mergedTile: GameTile = {
          id: generateId(),
          value: currentTile.value * 2,
          position: { row, col: writeIndex },
          isMerged: true
        }
        mergedRow[writeIndex] = mergedTile
        totalScore += mergedTile.value
        i += 2
        moved = true
      } else {
        // Move tile
        const movedTile: GameTile = {
          ...currentTile,
          position: { row, col: writeIndex }
        }
        if (movedTile.position.col !== currentTile.position.col) {
          moved = true
        }
        mergedRow[writeIndex] = movedTile
        i += 1
      }
      writeIndex += 1
    }

    newBoard[row] = mergedRow
  }

  return { board: newBoard, score: totalScore, moved }
}

const rotateBoard = (board: (GameTile | null)[][]): (GameTile | null)[][] => {
  const rotated = createEmptyBoard()
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = board[row][col]
      if (tile) {
        rotated[col][BOARD_SIZE - 1 - row] = {
          ...tile,
          position: { row: col, col: BOARD_SIZE - 1 - row }
        }
      }
    }
  }
  return rotated
}

const rotateBoardCounterclockwise = (board: (GameTile | null)[][]): (GameTile | null)[][] => {
  const rotated = createEmptyBoard()
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = board[row][col]
      if (tile) {
        rotated[BOARD_SIZE - 1 - col][row] = {
          ...tile,
          position: { row: BOARD_SIZE - 1 - col, col: row }
        }
      }
    }
  }
  return rotated
}

export const moveBoard = (board: (GameTile | null)[][], direction: Direction): { board: (GameTile | null)[][], score: number, moved: boolean } => {
  let workingBoard = board.map(row => [...row])

  switch (direction) {
    case 'left':
      return moveLeft(workingBoard)

    case 'right':
      workingBoard = workingBoard.map(row => row.slice().reverse())
      const rightResult = moveLeft(workingBoard)
      rightResult.board = rightResult.board.map(row => row.slice().reverse())
      // Fix positions after reverse
      rightResult.board = rightResult.board.map((row, rowIndex) =>
        row.map((tile, colIndex) =>
          tile ? { ...tile, position: { row: rowIndex, col: colIndex } } : null
        )
      )
      return rightResult

    case 'up':
      workingBoard = rotateBoardCounterclockwise(workingBoard)
      const upResult = moveLeft(workingBoard)
      upResult.board = rotateBoard(upResult.board)
      return upResult

    case 'down':
      workingBoard = rotateBoard(workingBoard)
      const downResult = moveLeft(workingBoard)
      downResult.board = rotateBoardCounterclockwise(downResult.board)
      return downResult

    default:
      return { board: workingBoard, score: 0, moved: false }
  }
}

export const isGameOver = (board: (GameTile | null)[][]): boolean => {
  // Check if there are empty cells
  if (getEmptyPositions(board).length > 0) {
    return false
  }

  // Check if any merges are possible
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const current = board[row][col]
      if (!current) continue

      // Check right neighbor
      if (col + 1 < BOARD_SIZE && board[row][col + 1]?.value === current.value) {
        return false
      }

      // Check bottom neighbor
      if (row + 1 < BOARD_SIZE && board[row + 1][col]?.value === current.value) {
        return false
      }
    }
  }

  return true
}

export const isGameWon = (board: (GameTile | null)[][]): boolean => {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = board[row][col]
      if (tile && tile.value >= 2048) {
        return true
      }
    }
  }
  return false
}

export const getMaxTile = (board: (GameTile | null)[][]): number => {
  let max = 0
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const tile = board[row][col]
      if (tile && tile.value > max) {
        max = tile.value
      }
    }
  }
  return max
}

export const copyBoard = (board: (GameTile | null)[][]): (GameTile | null)[][] => {
  return board.map(row =>
    row.map(tile =>
      tile ? { ...tile } : null
    )
  )
}