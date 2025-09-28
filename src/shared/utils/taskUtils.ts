/**
 * Подсчитывает общее количество готовых к получению наград задач
 * @param readyToRewardTasksCounts - объект с количеством задач по типам
 * @returns общее количество задач
 */
export const calculateTotalTaskCount = (readyToRewardTasksCounts: Record<string, number> | undefined): number => {
  if (!readyToRewardTasksCounts) {
    return 0
  }

  return Object.values(readyToRewardTasksCounts).reduce((total, count) => total + count, 0)
}