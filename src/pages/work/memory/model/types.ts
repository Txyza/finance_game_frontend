export interface MemoryCard {
  id: string
  pairId: string
  emoji: string
  isFlipped: boolean
  isMatched: boolean
  position: number
}

export interface MemoryGameState {
  board: MemoryCard[]
  score: number
  timeLeft: number
  gameStartTime: number
  isGameActive: boolean
  isGameEnded: boolean
  selectedCards: MemoryCard[]
  matchedPairs: number
  totalRounds: number
  currentRound: number
  sessionId: string
  events: MemoryGameEvent[]
}

export interface MemoryGameEvent {
  id: string
  sessionId: string
  type: 'game_start' | 'card_flip' | 'pair_match' | 'pair_mismatch' | 'round_complete' | 'game_end'
  timestamp: number
  data: Record<string, unknown>
}

export interface MemoryGameStatistics {
  totalScore: number
  totalTime: number
  roundsCompleted: number
  matchedPairs: number
  accuracy: number
  averageRoundTime: number
}

export type MemoryGameStore = MemoryGameState & {
  initGame: (sessionId?: string) => void
  flipCard: (cardId: string) => void
  resetGame: () => void
  pauseGame: () => void
  resumeGame: () => void
  getStatistics: () => MemoryGameStatistics
  logEvent: (type: MemoryGameEvent['type'], data: Record<string, unknown>) => void
}