import { FC, useState } from 'react'
import { FeatureLockedTooltip } from '@shared/ui/FeatureLockedTooltip'
import { isFeatureUnlocked, getFeatureUnlockMessage, FeatureType } from '@shared/utils/featureUnlock'
import styles from './BottomNavigation.module.css'

export type TabType = 'shop' | 'analytics' | 'character'

interface BottomNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onCityClick: () => void
  currentLevel: number
}

export const BottomNavigation: FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onCityClick,
  currentLevel
}) => {
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null)

  const handleTabClick = (tab: TabType) => {
    if (tab === 'character') {
      onTabChange(tab)
      return
    }

    const isUnlocked = isFeatureUnlocked(tab as FeatureType, currentLevel)
    if (isUnlocked) {
      onTabChange(tab)
    } else {
      setLockedTooltip(getFeatureUnlockMessage(tab as FeatureType))
    }
  }

  const handleCityClick = () => {
    const isUnlocked = isFeatureUnlocked('city', currentLevel)
    if (isUnlocked) {
      onCityClick()
    } else {
      setLockedTooltip(getFeatureUnlockMessage('city'))
    }
  }

  const tabs = [
    {
      id: 'shop' as TabType,
      icon: '🛒',
      label: 'Магазин'
    },
    {
      id: 'analytics' as TabType,
      icon: '📊',
      label: 'Аналитика'
    },
    {
      id: 'character' as TabType,
      icon: '👤',
      label: 'Персонаж'
    }
  ]

  return (
    <div className={styles.bottomNav}>
      {/* Навигационные вкладки */}
      {tabs.map(tab => {
        const isUnlocked = tab.id === 'character' || isFeatureUnlocked(tab.id as FeatureType, currentLevel)
        return (
          <button
            key={tab.id}
            className={`${styles.navButton} ${activeTab === tab.id ? styles.activeButton : ''} ${!isUnlocked ? styles.lockedButton : ''}`}
            onClick={() => handleTabClick(tab.id)}
            aria-label={tab.label}
          >
            <span className={styles.navIcon}>{tab.icon}</span>
            <span className={styles.navLabel}>{tab.label}</span>
            {!isUnlocked && <span className={styles.lockIcon}>🔒</span>}
          </button>
        )
      })}

      {/* Кнопка "Город" */}
      {(() => {
        const isCityUnlocked = isFeatureUnlocked('city', currentLevel)
        return (
          <button
            className={`${styles.navButton} ${styles.cityButton} ${!isCityUnlocked ? styles.lockedButton : ''}`}
            onClick={handleCityClick}
            aria-label="Город"
          >
            <span className={styles.navIcon}>🏙️</span>
            <span className={styles.navLabel}>Город</span>
            {!isCityUnlocked && <span className={styles.lockIcon}>🔒</span>}
          </button>
        )
      })()}

      {/* Tooltip для заблокированных функций */}
      {lockedTooltip && (
        <FeatureLockedTooltip
          message={lockedTooltip}
          onClose={() => setLockedTooltip(null)}
        />
      )}
    </div>
  )
}