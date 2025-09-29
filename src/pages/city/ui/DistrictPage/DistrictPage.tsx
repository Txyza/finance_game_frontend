import { FC } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ParticleBackground, GameHeaderContainer, Button } from '@shared/ui'
import { DISTRICTS_DATA, DistrictId } from '../../model/types'
import safeCityImage from '@shared/assets/images/safe_city.png'
import shoppingCityImage from '@shared/assets/images/shopping_city.png'
import styles from './DistrictPage.module.css'

export const DistrictPage: FC = () => {
  const { districtId } = useParams<{ districtId: string }>()
  const navigate = useNavigate()

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

  const district = DISTRICTS_DATA.find(d => d.id === districtId as DistrictId)

  if (!district) {
    return (
      <div className="common-page-background">
        <div className={styles.content}>
          <h1>Район не найден</h1>
          <Button onClick={() => navigate('/city')}>
            ← Вернуться к карте
          </Button>
        </div>
      </div>
    )
  }

  const handleBuildingClick = (buildingId: string) => {
    console.log(`Clicked building: ${buildingId}`)

    // Логика перехода к конкретным зданиям
    switch (buildingId) {
      case 'savings':
        navigate('/savings')
        break
      case 'deposits':
        navigate('/deposits')
        break
      default:
        console.log(`Здание ${buildingId} пока не реализовано`)
    }
  }

  // Функция для получения фонового изображения района
  const getDistrictBackgroundImage = (districtId: DistrictId): string | null => {
    switch (districtId) {
      case 'safe':
        return safeCityImage
      case 'shopping':
        return shoppingCityImage
      case 'credit':
        return null // Пока нет изображения
      case 'stock':
        return null // Пока нет изображения
      default:
        return null
    }
  }

  return (
    <div className="common-page-background">
      <ParticleBackground
        particleCount={15}
        particleColor={district.color}
        animationSpeed="slow"
      />

      <GameHeaderContainer />

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.header}>
            <Button
              variant="gradient-mint"
              size="small"
              onClick={() => navigate('/city')}
            >
              ← Назад к карте
            </Button>

            <h1 className={styles.title} style={{ color: district.color }}>
              {district.name}
            </h1>
          </div>

          <div
            className={styles.districtMap}
            style={{
              backgroundImage: getDistrictBackgroundImage(district.id)
                ? `url(${getDistrictBackgroundImage(district.id)})`
                : undefined
            }}
          >
            {/* Оверлей для лучшей видимости зданий */}
            <div className={styles.mapOverlay}></div>

            <div className={styles.buildings}>
              {district.buildings.map(building => (
                <div
                  key={building.id}
                  className={styles.building}
                  style={{
                    left: `${building.position.x}%`,
                    top: `${building.position.y}%`,
                    opacity: playerStats.level >= building.requiredLevel ? 1 : 0.5
                  }}
                  onClick={() => handleBuildingClick(building.id)}
                >
                  <div className={styles.buildingIcon}>
                    {building.icon}
                  </div>
                  <div className={styles.buildingName}>
                    {building.name}
                  </div>
                  {playerStats.level < building.requiredLevel && (
                    <div className={styles.levelLock}>
                      🔒 Уровень {building.requiredLevel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}