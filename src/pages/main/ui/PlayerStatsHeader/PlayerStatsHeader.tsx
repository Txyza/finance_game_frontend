import { FC } from 'react'
import { Bubble, ProgressBar } from '@shared/ui'
import styles from './PlayerStatsHeader.module.css'

interface PlayerStatsHeaderProps {
  level: number
  currentExp: number
  maxExp: number
  energy: number
  maxEnergy: number
  money: number
  bankRate: number
  inflation: number
}

export const PlayerStatsHeader: FC<PlayerStatsHeaderProps> = ({
  level,
  currentExp,
  maxExp,
  energy,
  maxEnergy,
  money,
  bankRate,
  inflation
}) => {
  const formatMoney = (amount: number) => {
    return amount.toLocaleString('ru-RU')
  }

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
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

        {/* Основные ресурсы */}
        <div className="common-header-resources">
          <Bubble variant="black" size="small" icon="⚡" outline>
            {energy}/{maxEnergy}
          </Bubble>
          <Bubble variant="black" size="small" icon="₽" outline>
            {formatMoney(money)} ₽
          </Bubble>
        </div>
      </div>

      {/* Экономические показатели */}
      <div className={styles.bottomRow}>
        <Bubble variant="raspberry" size="small" icon="📈" outline>
          {bankRate}% Ставка
        </Bubble>
        <Bubble variant="raspberry" size="small" icon="📊" outline>
          {inflation}% Инфляция
        </Bubble>
      </div>
    </header>
  )
}