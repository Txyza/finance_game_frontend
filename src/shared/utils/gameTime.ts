/**
 * Утилиты для работы с игровым временем
 * 1 игровой год = 1 реальный месяц
 */

/**
 * Конвертирует реальную дату в игровую
 * @param realDate - реальная дата
 * @param gameStartDate - дата начала игры в реальном времени
 * @returns игровая дата
 */
export const convertToGameTime = (realDate: string | Date, gameStartDate?: Date): Date => {
  const real = new Date(realDate)
  const gameStart = gameStartDate || new Date('2024-01-01') // Условная дата начала игры

  // Разница в месяцах между датой и началом игры
  const monthsDiff = (real.getFullYear() - gameStart.getFullYear()) * 12 +
                     (real.getMonth() - gameStart.getMonth())

  // В игре это будет разница в годах
  const gameYear = gameStart.getFullYear() + monthsDiff

  return new Date(gameYear, real.getMonth(), real.getDate())
}

/**
 * Форматирует игровую дату для отображения
 * @param realDate - реальная дата
 * @returns отформатированная игровая дата
 */
export const formatGameDate = (realDate: string | Date): string => {
  const real = new Date(realDate)

  // Конвертируем реальные месяцы в игровые годы
  // Допустим, игра началась в январе 2025, это 1-й игровой год
  const gameStartYear = 2025
  const monthsSinceStart = (real.getFullYear() - 2025) * 12 + real.getMonth()
  const gameYear = gameStartYear + Math.floor(monthsSinceStart / 12)

  const monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ]

  return `${real.getDate()} ${monthNames[real.getMonth()]} ${gameYear} года`
}

/**
 * Вычисляет игровой возраст счета в годах
 * @param openedAt - дата открытия счета
 * @returns возраст в игровых годах
 */
export const getGameAge = (openedAt: string | Date): number => {
  const opened = new Date(openedAt)
  const now = new Date()

  // Разница в месяцах = разница в игровых годах
  const monthsDiff = (now.getFullYear() - opened.getFullYear()) * 12 +
                     (now.getMonth() - opened.getMonth())

  return Math.max(0, monthsDiff)
}

/**
 * Форматирует срок действия для вкладов в неделях
 * @param expiresAt - дата окончания
 * @param openedAt - дата открытия
 * @returns строка с игровым сроком в неделях
 */
export const formatGameTerm = (expiresAt: string | Date | null, openedAt: string | Date): string => {
  if (!expiresAt) return 'Бессрочный'

  const opened = new Date(openedAt)
  const expires = new Date(expiresAt)

  // Разница в днях
  const timeDiff = expires.getTime() - opened.getTime()
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))

  // Конвертируем дни в недели (округляем до ближайшей недели)
  const weeksDiff = Math.round(daysDiff / 7)

  if (weeksDiff === 1) return '1 неделя'
  if (weeksDiff < 5) return `${weeksDiff} недели`
  return `${weeksDiff} недель`
}

/**
 * Форматирует оставшееся время до окончания вклада
 * @param expiresAt - дата окончания
 * @returns строка с оставшимся временем
 */
export const formatRemainingTime = (expiresAt: string | Date | null): string => {
  if (!expiresAt) return 'Бессрочный'

  const expires = new Date(expiresAt)
  const now = new Date()

  const timeDiff = expires.getTime() - now.getTime()

  if (timeDiff <= 0) return 'Истёк'

  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const weeksDiff = Math.floor(daysDiff / 7)

  if (weeksDiff >= 1) {
    if (weeksDiff === 1) return 'Осталась 1 неделя'
    if (weeksDiff < 5) return `Осталось ${weeksDiff} недели`
    return `Осталось ${weeksDiff} недель`
  }

  if (daysDiff === 1) return 'Остался 1 день'
  if (daysDiff < 5) return `Осталось ${daysDiff} дня`
  return `Осталось ${daysDiff} дней`
}