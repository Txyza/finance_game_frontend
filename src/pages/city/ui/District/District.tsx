import { FC } from 'react'
import { District as DistrictType, DistrictId } from '../../model/types'
import styles from './District.module.css'
import safeCityImg from '@shared/assets/images/safe_city.png'

interface DistrictProps {
  district: DistrictType
  isHovered: boolean
  isAccessible: boolean
  onClick: () => void
  onHover: (districtId: DistrictId | null) => void
  dataTour?: string
}

export const District: FC<DistrictProps> = ({
  district,
  isHovered,
  isAccessible,
  onClick,
  onHover,
  dataTour
}) => {
  return (
    <g>
      {/* Фильтры для эффектов */}
      <defs>
        <filter id={`glow-${district.id}`}>
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {district.id === 'safe' && (
          <pattern id={`pattern-${district.id}`} patternUnits="userSpaceOnUse" width="290" height="390">
            <image href={safeCityImg} width="290" height="390" />
          </pattern>
        )}

        <linearGradient id={`gradient-${district.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={district.color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={district.color} stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Район */}
      <polygon
        className={styles.district}
        points={district.bounds.points}
        fill={isAccessible && district.id === 'safe' ? `url(#pattern-${district.id})` : isAccessible ? `url(#gradient-${district.id})` : 'rgba(128, 128, 128, 0.2)'}
        stroke={isAccessible ? district.color : '#666'}
        strokeWidth="2"
        opacity={isHovered ? 0.6 : 0.3}
        filter={isHovered && isAccessible ? `url(#glow-${district.id})` : undefined}
        onClick={onClick}
        onMouseEnter={() => onHover(district.id)}
        onMouseLeave={() => onHover(null)}
        onTouchStart={() => onHover(district.id)}
        onTouchEnd={() => onHover(null)}
        data-tour={dataTour}
        style={{
          cursor: isAccessible ? 'pointer' : 'not-allowed',
          transition: 'all 0.3s ease-out',
          transform: isHovered ? 'translateZ(10px)' : 'translateZ(0)'
        }}
      />

      {/* Фон для названия района */}
      <rect
        x={district.bounds.center.x - 60}
        y={district.id === 'safe' || district.id === 'credit' ? 10 : district.bounds.center.y - 185}
        width="120"
        height="30"
        fill="rgba(0, 0, 0, 0.7)"
        rx="15"
        pointerEvents="none"
      />

      {/* Название района */}
      <text
        x={district.bounds.center.x}
        y={district.id === 'safe' || district.id === 'credit' ? 25 : district.bounds.center.y - 170}
        textAnchor="middle"
        dominantBaseline="middle"
        className={styles.districtName}
        fill={isAccessible ? '#fff' : '#999'}
        fontSize="16"
        fontWeight="700"
        pointerEvents="none"
      >
        {district.name}
      </text>

      {/* Иконка заблокированного района */}
      {!isAccessible && (
        <text
          x={district.bounds.center.x}
          y={district.bounds.center.y + 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="20"
          pointerEvents="none"
        >
          🔒
        </text>
      )}

      {/* Индикатор уровня */}
      {!isAccessible && (
        <text
          x={district.bounds.center.x}
          y={district.bounds.center.y + 40}
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.levelRequirement}
          fill="#999"
          fontSize="10"
          pointerEvents="none"
        >
          Уровень {district.requiredLevel}
        </text>
      )}
    </g>
  )
}