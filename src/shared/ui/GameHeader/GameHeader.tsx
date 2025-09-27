import { FC, memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bubble, ProgressBar } from '@shared/ui'
import { formatMoney } from '@shared/lib/formatMoney'
import styles from './GameHeader.module.css'

interface GameHeaderProps {
  level: number
  currentExp: number
  maxExp: number
  energy: number
  maxEnergy: number
  money: number
  bankRate?: number
  inflation?: number
  variant?: 'main' | 'work'
  onEnergyAdd?: () => void
  onMoneyAdd?: () => void
}

export const GameHeader: FC<GameHeaderProps> = memo(({
  level,
  currentExp,
  maxExp,
  energy,
  maxEnergy,
  money,
  bankRate,
  inflation,
  variant = 'main',
  onEnergyAdd,
  onMoneyAdd
}) => {
  const navigate = useNavigate()


  const handleEnergyAdd = () => {
    if (onEnergyAdd) {
      onEnergyAdd()
    } else {
      navigate('/shop?tab=energy')
    }
  }

  const handleMoneyAdd = () => {
    if (onMoneyAdd) {
      onMoneyAdd()
    } else {
      navigate('/shop?tab=money')
    }
  }

  const headerClass = variant === 'main' ? styles.headerMain : styles.headerWork

  return (
    <header className={headerClass}>
      <div className={styles.topRow} data-tour="game-header">
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
          <Bubble
            variant="outline"
            size="small"
            icon="⚡"
            addButton={{
              onClick: handleEnergyAdd
            }}
          >
            {energy}/{maxEnergy}
          </Bubble>
          <Bubble
            variant="outline"
            size="small"
            icon="₽"
            addButton={{
              onClick: handleMoneyAdd
            }}
          >
            {formatMoney(money)}
          </Bubble>
        </div>
      </div>

      {/* Экономические показатели или пустое место для одинаковой высоты */}
      <div className={styles.bottomRow} data-tour="market-indicators">
        {variant === 'main' && bankRate !== undefined && inflation !== undefined ? (
          <>
            <Bubble variant="outline" size="small" icon="📈">
              {bankRate}% Ставка
            </Bubble>
            <Bubble variant="outline" size="small" icon="📊">
              {inflation}% Инфляция
            </Bubble>
          </>
        ) : (
          /* Пустые Bubble компоненты для идентичной структуры */
          <>
            <Bubble variant="outline" size="small" className={styles.hiddenBubble}>
              placeholder
            </Bubble>
            <Bubble variant="outline" size="small" className={styles.hiddenBubble}>
              placeholder
            </Bubble>
          </>
        )}
      </div>
    </header>
  )
})

GameHeader.displayName = 'GameHeader'