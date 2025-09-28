import { FC, memo, useMemo, useCallback } from 'react'
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
  characterName?: string
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
  characterName,
  onEnergyAdd,
  onMoneyAdd
}) => {
  const navigate = useNavigate()

  // Мемоизируем форматированные значения чтобы избежать ненужных перерисовок
  const formattedMoney = useMemo(() => formatMoney(money), [money])
  const expText = useMemo(() => `${currentExp}/${maxExp}`, [currentExp, maxExp])
  const energyText = useMemo(() => `${energy}/${maxEnergy}`, [energy, maxEnergy])
  const levelText = useMemo(() => `Lv ${level}`, [level])
  const bankRateText = useMemo(() => `${bankRate}% Ставка`, [bankRate])
  const inflationText = useMemo(() => `${inflation}% Инфляция`, [inflation])

  // Сокращаем имя персонажа до 15 символов
  const truncatedCharacterName = useMemo(() => {
    if (!characterName) return ''
    return characterName.length > 15 ? characterName.substring(0, 15) + '...' : characterName
  }, [characterName])

  const handleEnergyAdd = useCallback(() => {
    if (onEnergyAdd) {
      onEnergyAdd()
    } else {
      navigate('/shop?tab=energy')
    }
  }, [onEnergyAdd, navigate])

  const handleMoneyAdd = useCallback(() => {
    if (onMoneyAdd) {
      onMoneyAdd()
    } else {
      navigate('/shop?tab=money')
    }
  }, [onMoneyAdd, navigate])

  const headerClass = variant === 'main' ? styles.headerMain : styles.headerWork

  // Мемоизируем объекты для addButton чтобы избежать ненужных перерисовок
  const energyAddButton = useMemo(() => ({
    onClick: handleEnergyAdd
  }), [handleEnergyAdd])

  const moneyAddButton = useMemo(() => ({
    onClick: handleMoneyAdd
  }), [handleMoneyAdd])

  return (
    <header className={headerClass}>
      <div className={styles.topRow} data-tour="game-header">
        {/* Уровень с прогресс-баром */}
        <div className="common-header-level-block">
          <span className="common-header-level-text">{levelText}</span>
          <div className="common-header-level-progress">
            <ProgressBar
              current={currentExp}
              max={maxExp}
              variant="mint"
              size="small"
            />
            <span className="common-header-exp-overlay">{expText}</span>
          </div>
        </div>

        {/* Основные ресурсы */}
        <div className="common-header-resources">
          <Bubble
            variant="outline"
            size="small"
            icon="⚡"
            addButton={energyAddButton}
          >
            {energyText}
          </Bubble>
          <Bubble
            variant="outline"
            size="small"
            icon="₽"
            addButton={moneyAddButton}
          >
            {formattedMoney}
          </Bubble>
        </div>
      </div>

      {/* Экономические показатели или пустое место для одинаковой высоты */}
      <div className={styles.bottomRow} data-tour="market-indicators">
        {/* Имя персонажа слева */}
        {truncatedCharacterName && (
          <span className={styles.characterName}>{truncatedCharacterName}</span>
        )}

        {/* Центрированные показатели */}
        <div className={styles.centerIndicators}>
          {variant === 'main' && bankRate !== undefined && inflation !== undefined ? (
            <>
              <Bubble variant="outline" size="small" icon="📈">
                {bankRateText}
              </Bubble>
              <Bubble variant="outline" size="small" icon="📊">
                {inflationText}
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
      </div>
    </header>
  )
})

GameHeader.displayName = 'GameHeader'