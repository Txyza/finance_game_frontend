import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeader } from '@shared/ui'
import { CityMap } from '../CityMap'
import { DistrictId } from '../../model/types'
import styles from './CityPage.module.css'

export const CityPage: FC = () => {
  const navigate = useNavigate()
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictId | null>(null)

  // Mock данные игрока
  const playerStats = {
    level: 5,
    currentExp: 20,
    maxExp: 150,
    energy: 18,
    maxEnergy: 24,
    money: 1250000, // 1.25М для демонстрации форматирования
    bankRate: 8.5,
    inflation: 2
  }

  const handleDistrictClick = (districtId: DistrictId) => {
    // Анимация зума будет добавлена позже
    navigate(`/city/district/${districtId}`)
  }

  const handleDistrictHover = (districtId: DistrictId | null) => {
    setHoveredDistrict(districtId)
  }

  return (
    <div className="common-page-background">
      {/* Анимированный фон с частицами */}
      <ParticleBackground
        particleCount={20}
        particleColor="#fbbf24"
        animationSpeed="slow"
      />

      {/* Шапка со статистикой игрока */}
      <GameHeader
        variant="main"
        level={playerStats.level}
        currentExp={playerStats.currentExp}
        maxExp={playerStats.maxExp}
        energy={playerStats.energy}
        maxEnergy={playerStats.maxEnergy}
        money={playerStats.money}
        bankRate={playerStats.bankRate}
        inflation={playerStats.inflation}
      />

      {/* Полноэкранная карта */}
      <div className={styles.mapFullscreen}>
        {/* Заголовок поверх карты */}
        <div className={styles.mapOverlay}>
          <h1 className={styles.title}>Финансовый город</h1>

          {/* Информация о выбранном районе */}
          {hoveredDistrict && (
            <div className={styles.districtInfo}>
              <span className={styles.districtName}>
                {hoveredDistrict === 'safe' && '🛡️ Безопасный район'}
                {hoveredDistrict === 'credit' && '💳 Кредитный район'}
                {hoveredDistrict === 'shopping' && '🛍️ ТЦ район'}
                {hoveredDistrict === 'stock' && '📈 Биржевой район'}
              </span>
            </div>
          )}
        </div>

        {/* Карта города на весь экран */}
        <CityMap
          onDistrictClick={handleDistrictClick}
          onDistrictHover={handleDistrictHover}
          hoveredDistrict={hoveredDistrict}
          playerLevel={playerStats.level}
        />
      </div>
    </div>
  )
}