import { FC } from 'react'
import { Bubble } from '@shared/ui'
import leaderboardIcon from '@shared/assets/images/leaderboard_icon.png'
import analyticIcon from '@shared/assets/images/analytic_icon.png'
import cityIcon from '@shared/assets/images/city_icon.png'
import profileIcon from '@shared/assets/images/profile_icon.png'
import styles from './BottomNavigation.module.css'

export type TabType = 'analytics' | 'character' | 'rating'

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
      id: 'analytics' as TabType,
      icon: analyticIcon,
      label: 'Аналитика',
      isImage: true
    },
    {
      id: 'character' as TabType,
      icon: profileIcon,
      label: 'Персонаж',
      isImage: true
    },
    {
      id: 'rating' as TabType,
      icon: leaderboardIcon,
      label: 'Рейтинг',
      isImage: true
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
        >
          {tab.isImage ? (
            <img
              src={tab.icon as string}
              alt={tab.label}
              className={styles.navIconImage}
            />
          ) : (
            <span className={styles.navIcon}>{tab.icon as string}</span>
          )}
        </button>
      ))}

      {/* Кнопка "Город" */}
      <button
        className={styles.navButton}
        onClick={onCityClick}
      >
        <img
          src={cityIcon}
          alt="Город"
          className={styles.navIconImage}
        />
      </button>
    </div>
  )
}