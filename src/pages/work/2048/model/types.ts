export interface GameTile {
  id: string
  value: number
  position: { row: number; col: number }
  isNew?: boolean
  isMerged?: boolean
}

export interface GameState {
  board: (GameTile | null)[][]
  score: number
  isGameOver: boolean
  isWon: boolean
  sessionId: string
  gameStartTime: number
}

export interface GameMove {
  direction: 'up' | 'down' | 'left' | 'right'
  timestamp: number
  boardStateBefore: (GameTile | null)[][]
  boardStateAfter: (GameTile | null)[][]
  scoreGained: number
}

export interface GameEvent {
  id: string
  sessionId: string
  type: 'move' | 'newGame' | 'gameOver' | 'win'
  timestamp: number
  data: any
}

export interface GameStatistics {
  totalMoves: number
  totalScore: number
  maxTile: number
  gameTime: number
  isWon: boolean
  moves: GameMove[]
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface Position {
  row: number
  col: number
}