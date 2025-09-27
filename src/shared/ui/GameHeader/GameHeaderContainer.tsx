import { FC, memo, useMemo } from 'react'
import { GameHeader } from './GameHeader'
import { useUserContext } from '@shared/context'
import { calculateLevelProgress } from '@shared/utils/levelCalculator'

interface GameHeaderContainerProps {
  variant?: 'main' | 'work'
  bankRate?: number
  inflation?: number
  onEnergyAdd?: () => void
  onMoneyAdd?: () => void
}

export const GameHeaderContainer: FC<GameHeaderContainerProps> = memo(({
  variant = 'main',
  bankRate,
  inflation,
  onEnergyAdd,
  onMoneyAdd
}) => {
  const { user, loading, error } = useUserContext()

  // Всегда вызываем хуки в одном порядке - ВАЖНО для React
  // Мемоизируем fallback props для состояний загрузки/ошибки
  const fallbackProps = useMemo(() => ({
    level: 1,
    currentExp: 0,
    maxExp: 100,
    energy: 0,
    maxEnergy: 24,
    money: 0,
    bankRate,
    inflation,
    variant,
    onEnergyAdd,
    onMoneyAdd
  }), [bankRate, inflation, variant, onEnergyAdd, onMoneyAdd])

  // Мемоизируем расчет уровня чтобы избежать ненужных пересчетов
  const levelData = useMemo(() => {
    if (!user) return { level: 1, currentExp: 0, maxExp: 100 }
    return calculateLevelProgress(user.experience)
  }, [user?.experience])

  // Мемоизируем данные из API
  const rates = useMemo(() => ({
    bankRate: user?.key_rate ? parseFloat(user.key_rate) : bankRate,
    inflation: user?.inflation ? parseFloat(user.inflation) : inflation
  }), [user?.key_rate, user?.inflation, bankRate, inflation])

  if (loading) {
    return <GameHeader {...fallbackProps} />
  }

  if (error || !user) {
    return <GameHeader {...fallbackProps} />
  }

  return (
    <GameHeader
      level={levelData.level}
      currentExp={levelData.currentExp}
      maxExp={levelData.maxExp}
      energy={user.energy}
      maxEnergy={user.max_energy}
      money={user.capital}
      bankRate={rates.bankRate}
      inflation={rates.inflation}
      variant={variant}
      onEnergyAdd={onEnergyAdd}
      onMoneyAdd={onMoneyAdd}
    />
  )
})

GameHeaderContainer.displayName = 'GameHeaderContainer'