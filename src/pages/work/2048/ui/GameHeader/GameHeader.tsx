import React from 'react'
import { Bubble, ProgressBar } from '../../../../../shared/ui'
import styles from './GameHeader.module.css'

interface GameHeaderProps {
  level: number
  currentExp: number
  maxExp: number
  energy: number
  maxEnergy: number
  money: number
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  level,
  currentExp,
  maxExp,
  energy,
  maxEnergy,
  money
}) => {
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('ru-RU')
  }

  return (
    <header className="common-header">
      {/* Уровень с прогресс-баром */}
      <div className="common-header-level-block">
        <span className="common-header-level-text">Lv {level}</span>
        <div className="common-header-level-progress">
          <ProgressBar
            current={currentExp}
            max={maxExp}
            variant="mint"
            size="small"
          />
          <span className="common-header-exp-overlay">{currentExp}/{maxExp}</span>
        </div>
      </div>

      {/* Ресурсы */}
      <div className="common-header-resources">
        <Bubble variant="black" size="small" icon="⚡" outline>
          {energy}/{maxEnergy}
        </Bubble>
        <Bubble variant="black" size="small" icon="₽" outline>
          {formatMoney(money)} ₽
        </Bubble>
      </div>
    </header>
  )
}