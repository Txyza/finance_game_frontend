export const formatDateGroup = (dateString: string): string => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Сбрасываем время для корректного сравнения
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Сегодня'
  }

  if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Вчера'
  }

  // Формат "10 сентября 2024"
  const monthNames = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ]

  const day = date.getDate()
  const month = monthNames[date.getMonth()]
  const year = date.getFullYear()

  return `${day} ${month} ${year}`
}

export const groupTransactionsByDate = <T extends { datetime_start: string }>(
  transactions: T[]
): Array<{ date: string; transactions: T[] }> => {
  const groups = new Map<string, T[]>()

  transactions.forEach(transaction => {
    const dateGroup = formatDateGroup(transaction.datetime_start)

    if (!groups.has(dateGroup)) {
      groups.set(dateGroup, [])
    }
    groups.get(dateGroup)!.push(transaction)
  })

  // Конвертируем в массив и сортируем по дате (сначала новые)
  return Array.from(groups.entries())
    .map(([date, transactions]) => ({ date, transactions }))
    .sort((a, b) => {
      // Сегодня и Вчера всегда сверху
      if (a.date === 'Сегодня') return -1
      if (b.date === 'Сегодня') return 1
      if (a.date === 'Вчера') return -1
      if (b.date === 'Вчера') return 1

      // Остальные даты сортируем по убыванию
      const dateA = new Date(a.transactions[0].datetime_start)
      const dateB = new Date(b.transactions[0].datetime_start)
      return dateB.getTime() - dateA.getTime()
    })
}