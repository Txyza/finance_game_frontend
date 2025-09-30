import { FC } from 'react'
import { DISTRICTS_DATA, DistrictId } from '../../model/types'
import { District } from '../District'
import styles from './CityMap.module.css'
import safeCityImg from '@shared/assets/images/safe_city.png'

interface CityMapProps {
  onDistrictClick: (districtId: DistrictId) => void
  onDistrictHover: (districtId: DistrictId | null) => void
  hoveredDistrict: DistrictId | null
  playerLevel: number
}

export const CityMap: FC<CityMapProps> = ({
  onDistrictClick,
  onDistrictHover,
  hoveredDistrict,
  playerLevel
}) => {
  return (
    <div className={styles.map}>
      {/* Фоновая карта */}
      <div className={styles.mapBackground}>
        {/* Районы с изображениями */}
        <svg className={styles.districts} viewBox="0 0 600 800">
          {/* Вертикальные районы 3:2 с фоновыми изображениями */}
          {DISTRICTS_DATA.map(district => (
            <District
              key={district.id}
              district={district}
              isHovered={hoveredDistrict === district.id}
              isAccessible={playerLevel >= district.requiredLevel}
              onClick={() => onDistrictClick(district.id)}
              onHover={onDistrictHover}
              dataTour={district.id === 'safe' ? 'safe-district' : undefined}
            />
          ))}
        </svg>

      </div>

    </div>
  )
}