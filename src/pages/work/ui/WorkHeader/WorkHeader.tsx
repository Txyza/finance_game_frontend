import { FC } from 'react'
import { Bubble, ProgressBar } from '@shared/ui'
import styles from './WorkHeader.module.css'

interface WorkHeaderProps {
  level: number
  currentExp: number
  maxExp: number
  energy: number
  maxEnergy: number
  money: number
}

export const WorkHeader: FC<WorkHeaderProps> = ({
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
    <div className={styles.header}>
      {/* Уровень с прогресс-баром */}
      <div className={styles.levelBlock}>
        <span className={styles.levelText}>Lv {level}</span>
        <div className={styles.levelProgress}>
          <ProgressBar
            current={currentExp}
            max={maxExp}
            variant="mint"
            size="small"
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
          {formatMoney(money)} ₽
        </Bubble>
      </div>
    </div>
  )
}