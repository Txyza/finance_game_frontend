/**
 * Yandex.Metrika Analytics Utilities
 * Counter ID: 104268538
 */

import type {
  YandexMetrikaGoalParams,
  YandexMetrikaUserParams,
  YandexMetrikaHit,
  YandexMetrikaExtLink
} from '@shared/types/yandex-metrika'

const COUNTER_ID = 104268538

/**
 * Проверяет, доступна ли Яндекс.Метрика
 */
export const isYandexMetrikaAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ym === 'function'
}

/**
 * Отправляет информацию о просмотре страницы
 */
export const trackPageView = (url?: string, options?: YandexMetrikaHit): void => {
  if (!isYandexMetrikaAvailable()) {
    console.warn('Yandex.Metrika is not available')
    return
  }

  try {
    window.ym(COUNTER_ID, 'hit', url, options)
    console.log('Yandex.Metrika: Page view tracked', { url, options })
  } catch (error) {
    console.error('Yandex.Metrika: Error tracking page view', error)
  }
}

/**
 * Отправляет цель (событие)
 */
export const trackGoal = (
  target: string,
  params?: YandexMetrikaGoalParams,
  callback?: () => void,
  ctx?: any
): void => {
  if (!isYandexMetrikaAvailable()) {
    console.warn('Yandex.Metrika is not available')
    return
  }

  try {
    window.ym(COUNTER_ID, 'reachGoal', target, params, callback, ctx)
    console.log('Yandex.Metrika: Goal tracked', { target, params })
  } catch (error) {
    console.error('Yandex.Metrika: Error tracking goal', error)
  }
}

/**
 * Отправляет параметры пользователя
 */
export const setUserParams = (userParams: YandexMetrikaUserParams): void => {
  if (!isYandexMetrikaAvailable()) {
    console.warn('Yandex.Metrika is not available')
    return
  }

  try {
    window.ym(COUNTER_ID, 'userParams', userParams)
    console.log('Yandex.Metrika: User params set', userParams)
  } catch (error) {
    console.error('Yandex.Metrika: Error setting user params', error)
  }
}

/**
 * Устанавливает ID пользователя
 */
export const setUserID = (userID: string): void => {
  if (!isYandexMetrikaAvailable()) {
    console.warn('Yandex.Metrika is not available')
    return
  }

  try {
    window.ym(COUNTER_ID, 'setUserID', userID)
    console.log('Yandex.Metrika: User ID set', userID)
  } catch (error) {
    console.error('Yandex.Metrika: Error setting user ID', error)
  }
}

/**
 * Отслеживает клик по внешней ссылке
 */
export const trackExternalLink = (url: string, options?: YandexMetrikaExtLink): void => {
  if (!isYandexMetrikaAvailable()) {
    console.warn('Yandex.Metrika is not available')
    return
  }

  try {
    window.ym(COUNTER_ID, 'extLink', url, options)
    console.log('Yandex.Metrika: External link tracked', { url, options })
  } catch (error) {
    console.error('Yandex.Metrika: Error tracking external link', error)
  }
}

/**
 * Отслеживает скачивание файла
 */
export const trackFileDownload = (url: string, options?: YandexMetrikaExtLink): void => {
  if (!isYandexMetrikaAvailable()) {
    console.warn('Yandex.Metrika is not available')
    return
  }

  try {
    window.ym(COUNTER_ID, 'file', url, options)
    console.log('Yandex.Metrika: File download tracked', { url, options })
  } catch (error) {
    console.error('Yandex.Metrika: Error tracking file download', error)
  }
}

/**
 * Получает Client ID
 */
export const getClientID = (callback: (clientID: string) => void): void => {
  if (!isYandexMetrikaAvailable()) {
    console.warn('Yandex.Metrika is not available')
    return
  }

  try {
    window.ym(COUNTER_ID, 'getClientID', callback)
  } catch (error) {
    console.error('Yandex.Metrika: Error getting client ID', error)
  }
}

// Предустановленные цели для игры Cash-lvl
export const YandexMetrikaGoals = {
  // Общие события
  USER_REGISTERED: 'user_registered',
  GAME_STARTED: 'game_started',
  TUTORIAL_COMPLETED: 'tutorial_completed',

  // Игровые события
  WORK_GAME_STARTED: 'work_game_started',
  WORK_GAME_COMPLETED: 'work_game_completed',
  LEVEL_UP: 'level_up',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',

  // Финансовые события
  CARD_SELECTED: 'card_selected',
  SHOP_PURCHASE: 'shop_purchase',
  ENERGY_PURCHASED: 'energy_purchased',
  MONEY_EARNED: 'money_earned',

  // Навигация
  PAGE_ANALYTICS: 'page_analytics',
  PAGE_SHOP: 'page_shop',
  PAGE_TASKS: 'page_tasks',
  PAGE_LEADERBOARD: 'page_leaderboard',
  PAGE_CITY: 'page_city',

  // Игры
  GAME_2048_STARTED: 'game_2048_started',
  GAME_2048_COMPLETED: 'game_2048_completed',
  GAME_MEMORY_STARTED: 'game_memory_started',
  GAME_MEMORY_COMPLETED: 'game_memory_completed',
} as const

export type YandexMetrikaGoalType = typeof YandexMetrikaGoals[keyof typeof YandexMetrikaGoals]