import { create } from 'zustand'
import { MemoryGameStore, MemoryGameEvent, MemoryGameStatistics } from './types'
import {
  createMemoryCards,
  shuffleCards,
  isCardPair,
  isRoundComplete,
  getMatchedPairsCount,
  getCardById,
  updateCard,
  resetFlippedCards,
  markCardsAsMatched,
  POINTS_PER_PAIR,
  GAME_DURATION
} from './gameLogic'

export const generateGameUUID = (): string => {
  return crypto.randomUUID()
}

export const useMemoryGameStore = create<MemoryGameStore>((set, get) => ({
  board: [],
  score: 0,
  timeLeft: GAME_DURATION,
  gameStartTime: 0,
  isGameActive: false,
  isGameEnded: false,
  selectedCards: [],
  matchedPairs: 0,
  totalRounds: 0,
  currentRound: 0,
  sessionId: '',
  events: [],

  initGame: (sessionId?: string) => {
    const gameSessionId = sessionId || generateGameUUID()
    const startTime = Date.now()

    set({
      board: createMemoryCards(),
      score: 0,
      timeLeft: GAME_DURATION,
      gameStartTime: startTime,
      isGameActive: true,
      isGameEnded: false,
      selectedCards: [],
      matchedPairs: 0,
      totalRounds: 0,
      currentRound: 1,
      sessionId: gameSessionId,
      events: []
    })

    // Запускаем таймер
    const timer = setInterval(() => {
      const state = get()
      if (!state.isGameActive || state.isGameEnded) {
        clearInterval(timer)
        return
      }

      const elapsed = Date.now() - state.gameStartTime
      const newTimeLeft = Math.max(0, GAME_DURATION - elapsed)

      if (newTimeLeft <= 0) {
        clearInterval(timer)
        set({
          timeLeft: 0,
          isGameActive: false,
          isGameEnded: true
        })
        get().logEvent('game_end', {
          reason: 'time_up',
          finalScore: state.score,
          roundsCompleted: state.totalRounds
        })
      } else {
        set({ timeLeft: newTimeLeft })
      }
    }, 100)

    get().logEvent('game_start', { sessionId: gameSessionId })
  },

  flipCard: (cardId: string) => {
    const state = get()

    if (!state.isGameActive || state.isGameEnded) return
    if (state.selectedCards.length >= 2) return

    const card = getCardById(state.board, cardId)
    if (!card || card.isFlipped || card.isMatched) return

    // Переворачиваем карточку
    const updatedBoard = updateCard(state.board, cardId, { isFlipped: true })
    const flippedCard = { ...card, isFlipped: true }
    const newSelectedCards = [...state.selectedCards, flippedCard]

    set({
      board: updatedBoard,
      selectedCards: newSelectedCards
    })

    get().logEvent('card_flip', { cardId, emoji: card.emoji })

    // Если выбраны две карточки, проверяем совпадение
    if (newSelectedCards.length === 2) {
      const [firstCard, secondCard] = newSelectedCards

      setTimeout(() => {
        if (isCardPair(firstCard, secondCard)) {
          // Пара найдена
          const matchedBoard = markCardsAsMatched(get().board, firstCard.id, secondCard.id)
          const newMatchedPairs = getMatchedPairsCount(matchedBoard)
          const newScore = state.score + POINTS_PER_PAIR

          set({
            board: matchedBoard,
            selectedCards: [],
            matchedPairs: newMatchedPairs,
            score: newScore
          })

          get().logEvent('pair_match', {
            card1: firstCard.id,
            card2: secondCard.id,
            emoji: firstCard.emoji,
            score: POINTS_PER_PAIR
          })

          // Проверяем, завершено ли поле
          if (isRoundComplete(matchedBoard)) {
            const newTotalRounds = state.totalRounds + 1
            const newCurrentRound = state.currentRound + 1

            set({
              totalRounds: newTotalRounds,
              currentRound: newCurrentRound
            })

            get().logEvent('round_complete', {
              round: newTotalRounds,
              score: newScore,
              timeLeft: get().timeLeft
            })

            // Перемешиваем карточки для нового раунда
            setTimeout(() => {
              if (get().isGameActive && !get().isGameEnded) {
                set({
                  board: shuffleCards(createMemoryCards())
                })
              }
            }, 1000)
          }
        } else {
          // Пара не найдена
          const resetBoard = resetFlippedCards(get().board)

          set({
            board: resetBoard,
            selectedCards: []
          })

          get().logEvent('pair_mismatch', {
            card1: firstCard.id,
            card2: secondCard.id,
            emoji1: firstCard.emoji,
            emoji2: secondCard.emoji
          })
        }
      }, 1000)
    }
  },

  resetGame: () => {
    set({
      board: createMemoryCards(),
      score: 0,
      timeLeft: GAME_DURATION,
      gameStartTime: Date.now(),
      isGameActive: true,
      isGameEnded: false,
      selectedCards: [],
      matchedPairs: 0,
      totalRounds: 0,
      currentRound: 1,
      events: []
    })

    get().logEvent('game_start', { sessionId: get().sessionId, type: 'restart' })
  },

  pauseGame: () => {
    set({ isGameActive: false })
    get().logEvent('game_pause', { timeLeft: get().timeLeft })
  },

  resumeGame: () => {
    const state = get()
    if (!state.isGameEnded) {
      set({
        isGameActive: true,
        gameStartTime: Date.now() - (GAME_DURATION - state.timeLeft)
      })
      get().logEvent('game_resume', { timeLeft: state.timeLeft })
    }
  },

  getStatistics: (): MemoryGameStatistics => {
    const state = get()
    const totalTime = GAME_DURATION - state.timeLeft
    const accuracy = state.events.filter(e => e.type === 'pair_match').length /
                    Math.max(1, state.events.filter(e => e.type === 'pair_match' || e.type === 'pair_mismatch').length) * 100

    return {
      totalScore: state.score,
      totalTime,
      roundsCompleted: state.totalRounds,
      matchedPairs: state.matchedPairs,
      accuracy: Math.round(accuracy),
      averageRoundTime: state.totalRounds > 0 ? totalTime / state.totalRounds : 0
    }
  },

  logEvent: (type: MemoryGameEvent['type'], data: Record<string, unknown>) => {
    const state = get()
    const event: MemoryGameEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      sessionId: state.sessionId,
      type,
      timestamp: Date.now(),
      data
    }

    set({
      events: [...state.events, event]
    })

    // В будущем здесь можно добавить отправку события через WebSocket
    console.log('Memory Game Event:', event)
  }
}))