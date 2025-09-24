import { FC } from 'react'
import { GameHeader } from './GameHeader'
import { useUserContext } from '@shared/context'

interface GameHeaderContainerProps {
  variant?: 'main' | 'work'
  bankRate?: number
  inflation?: number
  onEnergyAdd?: () => void
  onMoneyAdd?: () => void
}

export const GameHeaderContainer: FC<GameHeaderContainerProps> = ({
  variant = 'main',
  bankRate = 8.5,
  inflation = 4.2,
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

  const level = Math.floor(user.experience / 100) + 1
  const currentExp = user.experience % 100
  const maxExp = 100

  const maxEnergy = 24

  return (
    <GameHeader
      level={level}
      currentExp={currentExp}
      maxExp={maxExp}
      energy={user.energy}
      maxEnergy={maxEnergy}
      money={user.debet_money}
      bankRate={bankRate}
      inflation={inflation}
      variant={variant}
      onEnergyAdd={onEnergyAdd}
      onMoneyAdd={onMoneyAdd}
    />
  )
}