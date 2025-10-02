import { MemoryCard } from './types'

// Эмодзи для карточек (8 пар)
const CARD_EMOJIS = [
  '🎯', '🎨', '🎭', '🎪',
  '🎮', '🎲', '🎸', '🎺'
]

export const POINTS_PER_PAIR = 125
export const GAME_DURATION = 90 * 1000 // 1.5 minutes in milliseconds

/**
 * Создает новый набор карточек для игры Memory
 */
export const createMemoryCards = (): MemoryCard[] => {
  const cards: MemoryCard[] = []

  CARD_EMOJIS.forEach((emoji, index) => {
    const pairId = `pair_${index}`

    // Создаем две карточки для каждого эмодзи
    cards.push({
      id: `${pairId}_1`,
      pairId,
      emoji,
      isFlipped: false,
      isMatched: false,
      position: index * 2
    })

    cards.push({
      id: `${pairId}_2`,
      pairId,
      emoji,
      isFlipped: false,
      isMatched: false,
      position: index * 2 + 1
    })
  })

  return shuffleCards(cards)
}

/**
 * Перемешивает карточки
 */
export const shuffleCards = (cards: MemoryCard[]): MemoryCard[] => {
  const shuffled = [...cards]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  // Обновляем позиции после перемешивания
  return shuffled.map((card, index) => ({
    ...card,
    position: index,
    isFlipped: false,
    isMatched: false
  }))
}

/**
 * Проверяет, образуют ли две карточки пару
 */
export const isCardPair = (card1: MemoryCard, card2: MemoryCard): boolean => {
  return card1.pairId === card2.pairId && card1.id !== card2.id
}

/**
 * Проверяет, завершено ли текущее поле
 */
export const isRoundComplete = (cards: MemoryCard[]): boolean => {
  return cards.every(card => card.isMatched)
}

/**
 * Подсчитывает количество совпадений
 */
export const getMatchedPairsCount = (cards: MemoryCard[]): number => {
  const matchedCards = cards.filter(card => card.isMatched)
  return matchedCards.length / 2
}

/**
 * Получает карточку по ID
 */
export const getCardById = (cards: MemoryCard[], cardId: string): MemoryCard | null => {
  return cards.find(card => card.id === cardId) || null
}

/**
 * Обновляет карточку в массиве
 */
export const updateCard = (cards: MemoryCard[], cardId: string, updates: Partial<MemoryCard>): MemoryCard[] => {
  return cards.map(card =>
    card.id === cardId ? { ...card, ...updates } : card
  )
}

/**
 * Сбрасывает все открытые карточки
 */
export const resetFlippedCards = (cards: MemoryCard[]): MemoryCard[] => {
  return cards.map(card => ({
    ...card,
    isFlipped: card.isMatched ? card.isFlipped : false
  }))
}

/**
 * Помечает пару карточек как совпавшую
 */
export const markCardsAsMatched = (cards: MemoryCard[], card1Id: string, card2Id: string): MemoryCard[] => {
  return cards.map(card => {
    if (card.id === card1Id || card.id === card2Id) {
      return { ...card, isMatched: true }
    }
    return card
  })
}