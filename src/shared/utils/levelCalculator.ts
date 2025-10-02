/**
 * Таблица опыта для уровней
 * Индекс массива = уровень - 1
 * Значение = минимальный опыт для достижения этого уровня
 */
const LEVEL_THRESHOLDS = [
  0,     // Level 1
  50,    // Level 2
  100,   // Level 3
  250,   // Level 4
  400,   // Level 5
  600,   // Level 6
  1000,  // Level 7
  1500,  // Level 8
  2200,  // Level 9
  3000,  // Level 10
  4000,  // Level 11
  5200,  // Level 12
  6600,  // Level 13
  8200,  // Level 14
  10000, // Level 15
]

/**
 * Вычисляет уровень на основе опыта
 * @param experience - текущий опыт пользователя
 * @returns уровень пользователя
 */
export function calculateLevel(experience: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (experience >= LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

/**
 * Вычисляет прогресс до следующего уровня
 * @param experience - текущий опыт пользователя
 * @returns объект с текущим прогрессом и максимальным значением для прогресс-бара
 */
export function calculateLevelProgress(experience: number): {
  currentExp: number
  maxExp: number
  level: number
} {
  const level = calculateLevel(experience)
  const levelIndex = level - 1

  // Опыт, необходимый для текущего уровня
  const currentLevelThreshold = LEVEL_THRESHOLDS[levelIndex] || 0

  // Опыт, необходимый для следующего уровня
  const nextLevelThreshold = LEVEL_THRESHOLDS[levelIndex + 1] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000

  // Прогресс от текущего уровня к следующему
  const currentExp = experience - currentLevelThreshold
  const maxExp = nextLevelThreshold - currentLevelThreshold

  return {
    currentExp,
    maxExp,
    level
  }
}

/**
 * Получает минимальный опыт для указанного уровня
 * @param level - уровень
 * @returns минимальный опыт для достижения этого уровня
 */
export function getExperienceForLevel(level: number): number {
  const index = level - 1
  return LEVEL_THRESHOLDS[index] || 0
}