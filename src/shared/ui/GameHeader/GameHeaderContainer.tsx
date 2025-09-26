import { FC } from 'react'
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

export const GameHeaderContainer: FC<GameHeaderContainerProps> = ({
  variant = 'main',
  bankRate,
  inflation,
  onEnergyAdd,
  onMoneyAdd
}) => {
  const { user, loading, error } = useUserContext()

  if (loading) {
    return (
      <GameHeader
        level={1}
        currentExp={0}
        maxExp={100}
        energy={0}
        maxEnergy={24}
        money={0}
        bankRate={bankRate}
        inflation={inflation}
        variant={variant}
        onEnergyAdd={onEnergyAdd}
        onMoneyAdd={onMoneyAdd}
      />
    )
  }

  if (error || !user) {
    return (
      <GameHeader
        level={1}
        currentExp={0}
        maxExp={100}
        energy={0}
        maxEnergy={24}
        money={0}
        bankRate={bankRate}
        inflation={inflation}
        variant={variant}
        onEnergyAdd={onEnergyAdd}
        onMoneyAdd={onMoneyAdd}
      />
    )
  }

  // Используем новую систему расчета уровней
  const { level, currentExp, maxExp } = calculateLevelProgress(user.experience)

  // Используем данные из API
  const userBankRate = user.key_rate ? parseFloat(user.key_rate) : bankRate
  const userInflation = user.inflation ? parseFloat(user.inflation) : inflation

  return (
    <GameHeader
      level={level}
      currentExp={currentExp}
      maxExp={maxExp}
      energy={user.energy}
      maxEnergy={user.max_energy}
      money={user.capital}
      bankRate={userBankRate}
      inflation={userInflation}
      variant={variant}
      onEnergyAdd={onEnergyAdd}
      onMoneyAdd={onMoneyAdd}
    />
  )
}