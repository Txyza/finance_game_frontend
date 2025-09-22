import { create } from 'zustand'
import { GameState, GameTile, Direction, GameMove, GameEvent, GameStatistics } from './types'
import {
  initializeGame,
  moveBoard,
  addRandomTile,
  isGameOver,
  isGameWon,
  getMaxTile,
  copyBoard,
  generateId
} from './gameLogic'

interface GameStore extends GameState {
  moves: GameMove[]
  events: GameEvent[]

  // Actions
  initGame: (sessionId?: string) => void
  makeMove: (direction: Direction) => void
  resetGame: () => void
  getStatistics: () => GameStatistics

  // Private methods
  addEvent: (type: GameEvent['type'], data?: any) => void
  clearNewAndMergedFlags: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  board: [],
  score: 0,
  isGameOver: false,
  isWon: false,
  sessionId: '',
  gameStartTime: 0,
  moves: [],
  events: [],

  initGame: (sessionId?: string) => {
    const newSessionId = sessionId || generateId()
    const initialBoard = initializeGame()
    const startTime = Date.now()

    set({
      board: initialBoard,
      score: 0,
      isGameOver: false,
      isWon: false,
      sessionId: newSessionId,
      gameStartTime: startTime,
      moves: [],
      events: []
    })

    get().addEvent('newGame', { sessionId: newSessionId, startTime })
  },

  makeMove: (direction: Direction) => {
    const state = get()
    if (state.isGameOver || state.isWon) return

    const boardBefore = copyBoard(state.board)
    const moveResult = moveBoard(state.board, direction)

    if (!moveResult.moved) return

    // Clear previous flags
    get().clearNewAndMergedFlags()

    let newBoard = addRandomTile(moveResult.board)
    const newScore = state.score + moveResult.score
    const gameOver = isGameOver(newBoard)
    const gameWon = !state.isWon && isGameWon(newBoard)

    // Create move record
    const move: GameMove = {
      direction,
      timestamp: Date.now(),
      boardStateBefore: boardBefore,
      boardStateAfter: copyBoard(newBoard),
      scoreGained: moveResult.score
    }

    set(state => ({
      board: newBoard,
      score: newScore,
      isGameOver: gameOver,
      isWon: state.isWon || gameWon,
      moves: [...state.moves, move]
    }))

    // Add events
    get().addEvent('move', { direction, scoreGained: moveResult.score })

    if (gameWon) {
      get().addEvent('win', { finalScore: newScore, moves: get().moves.length + 1 })
    }

    if (gameOver) {
      get().addEvent('gameOver', { finalScore: newScore, moves: get().moves.length + 1 })
    }
  },

  resetGame: () => {
    const state = get()
    get().initGame(state.sessionId)
  },

  getStatistics: (): GameStatistics => {
    const state = get()
    const gameTime = Date.now() - state.gameStartTime

    return {
      totalMoves: state.moves.length,
      totalScore: state.score,
      maxTile: getMaxTile(state.board),
      gameTime,
      isWon: state.isWon,
      moves: [...state.moves]
    }
  },

  addEvent: (type: GameEvent['type'], data: any = {}) => {
    const state = get()
    const event: GameEvent = {
      id: generateId(),
      sessionId: state.sessionId,
      type,
      timestamp: Date.now(),
      data
    }

    set(state => ({
      events: [...state.events, event]
    }))

    // Here we could send events to WebSocket in the future
    console.log('Game Event:', event)
  },

  clearNewAndMergedFlags: () => {
    set(state => ({
      board: state.board.map(row =>
        row.map(tile =>
          tile ? { ...tile, isNew: false, isMerged: false } : null
        )
      )
    }))
  }
}))

// Generate UUID4 for new game sessions
export const generateGameUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}