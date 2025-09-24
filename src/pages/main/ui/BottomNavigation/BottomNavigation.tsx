import { FC } from 'react'
import styles from './BottomNavigation.module.css'

export type TabType = 'shop' | 'analytics' | 'character'

interface BottomNavigationProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onCityClick: () => void
}

export const BottomNavigation: FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onCityClick
}) => {
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
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`${styles.navButton} ${activeTab === tab.id ? styles.activeButton : ''}`}
          onClick={() => onTabChange(tab.id)}
          aria-label={tab.label}
        >
          <span className={styles.navIcon}>{tab.icon}</span>
          <span className={styles.navLabel}>{tab.label}</span>
        </button>
      ))}

      {/* Кнопка "Город" */}
      <button
        className={`${styles.navButton} ${styles.cityButton}`}
        onClick={onCityClick}
        aria-label="Город"
      >
        <span className={styles.navIcon}>🏙️</span>
        <span className={styles.navLabel}>Город</span>
      </button>
    </div>
  )
}