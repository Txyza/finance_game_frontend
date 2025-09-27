import { FC, memo, useMemo } from 'react'
import { GameHeader } from './GameHeader'
import { useStableUser } from '@shared/hooks/useStableUser'
import { calculateLevelProgress } from '@shared/utils/levelCalculator'

interface GameHeaderContainerProps {
  variant?: 'main' | 'work'
  bankRate?: number
  inflation?: number
  onEnergyAdd?: () => void
  onMoneyAdd?: () => void
}

// Кастомная функция сравнения для React.memo
const arePropsEqual = (
  prevProps: GameHeaderContainerProps,
  nextProps: GameHeaderContainerProps
): boolean => {
  return (
    prevProps.variant === nextProps.variant &&
    prevProps.bankRate === nextProps.bankRate &&
    prevProps.inflation === nextProps.inflation &&
    prevProps.onEnergyAdd === nextProps.onEnergyAdd &&
    prevProps.onMoneyAdd === nextProps.onMoneyAdd
  )
}

export const GameHeaderContainer: FC<GameHeaderContainerProps> = memo(({
  variant = 'main',
  bankRate,
  inflation,
  onEnergyAdd,
  onMoneyAdd
}) => {
  const { user, loading, error } = useStableUser()

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

  // Мемоизируем каждое значение отдельно для максимальной оптимизации
  const level = useMemo(() => {
    if (!user) return 1
    return calculateLevelProgress(user.experience).level
  }, [user?.experience])

  const currentExp = useMemo(() => {
    if (!user) return 0
    return calculateLevelProgress(user.experience).currentExp
  }, [user?.experience])

  const maxExp = useMemo(() => {
    if (!user) return 100
    return calculateLevelProgress(user.experience).maxExp
  }, [user?.experience])

  const energy = useMemo(() => user?.energy ?? 0, [user?.energy])
  const maxEnergy = useMemo(() => user?.max_energy ?? 24, [user?.max_energy])
  const money = useMemo(() => user?.capital ?? 0, [user?.capital])

  const userBankRate = useMemo(() =>
    user?.key_rate ? parseFloat(user.key_rate) : bankRate,
    [user?.key_rate, bankRate]
  )

  const userInflation = useMemo(() =>
    user?.inflation ? parseFloat(user.inflation) : inflation,
    [user?.inflation, inflation]
  )

  if (loading) {
    return <GameHeader {...fallbackProps} />
  }

  if (error || !user) {
    return <GameHeader {...fallbackProps} />
  }

  return (
    <GameHeader
      level={level}
      currentExp={currentExp}
      maxExp={maxExp}
      energy={energy}
      maxEnergy={maxEnergy}
      money={money}
      bankRate={userBankRate}
      inflation={userInflation}
      variant={variant}
      onEnergyAdd={onEnergyAdd}
      onMoneyAdd={onMoneyAdd}
    />
  )
}, arePropsEqual)

GameHeaderContainer.displayName = 'GameHeaderContainer'