/**
 * Форматирует сумму денег с сокращениями (К, М, Б)
 * @param amount - сумма для форматирования
 * @returns отформатированная строка
 */
export const formatMoney = (amount: number | undefined | null): string => {
  if (amount == null || amount === undefined) {
    return '0'
  }

  if (amount >= 1_000_000_000) {
    // Миллиарды
    const billions = amount / 1_000_000_000
    return `${billions.toFixed(billions % 1 === 0 ? 0 : 1)}Б`
  } else if (amount >= 1_000_000) {
    // Миллионы
    const millions = amount / 1_000_000
    return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)}М`
  } else if (amount >= 1_000) {
    // Тысячи
    const thousands = amount / 1_000
    return `${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}К`
  } else {
    // Меньше тысячи - показываем как есть
    return amount.toString()
  }
}

/**
 * Форматирует сумму денег с разделителями разрядов (альтернативный вариант)
 * @param amount - сумма для форматирования
 * @returns отформатированная строка с разделителями
 */
export const formatMoneyDetailed = (amount: number | undefined | null): string => {
  if (amount == null || amount === undefined) {
    return '0'
  }
  return amount.toLocaleString('ru-RU')
}