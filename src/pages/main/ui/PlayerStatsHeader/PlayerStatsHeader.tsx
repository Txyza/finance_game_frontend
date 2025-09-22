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
    <div className={styles.header}>
      {/* Верхняя строка: Уровень + Ресурсы */}
      <div className={styles.topRow}>
        {/* Компактный блок уровня */}
        <div className={styles.levelBlock}>
          <span className={styles.levelText}>Lv {level}</span>
          <div className={styles.levelProgress}>
            <ProgressBar
              current={currentExp}
              max={maxExp}
              variant="mint"
              size="medium"
            />
            <span className={styles.expOverlay}>{currentExp}/{maxExp}</span>
          </div>
        </div>

        {/* Ресурсы */}
        <div className={styles.resources}>
          <Bubble variant="black" size="small" icon="⚡" outline>
            {energy}/{maxEnergy}
          </Bubble>
          <Bubble variant="black" size="small" icon="₽" outline>
            {formatMoney(money)}
          </Bubble>
        </div>
      </div>

      {/* Финансовые показатели */}
      <div className={styles.indicators}>
        <Bubble variant="violet" size="small" icon="📈" outline>
          {bankRate}% Ставка
        </Bubble>
        <Bubble variant="violet" size="small" icon="📊" outline>
          {inflation}% Инфляция
        </Bubble>
      </div>
    </div>
  )
}