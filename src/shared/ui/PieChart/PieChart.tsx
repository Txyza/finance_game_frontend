import React from 'react'
import styles from './PieChart.module.css'

interface ChartSegment {
  name: string
  value: number
  percentage: number
  color: string
  icon?: string
}

interface PieChartProps {
  segments: ChartSegment[]
  size?: number
  strokeWidth?: number
  className?: string
}

export const PieChart: React.FC<PieChartProps> = ({
  segments,
  size = 200,
  strokeWidth = 20,
  className
}) => {
  const radius = (size - strokeWidth) / 2 - 30
  const circumference = 2 * Math.PI * radius
  const centerX = size / 2
  const centerY = size / 2

  let accumulatedPercentage = 0

  const getTextPosition = (percentage: number, accumulatedBefore: number) => {
    // Центр сегмента
    const segmentCenter = accumulatedBefore + percentage / 2
    // Угол в радианах (начинаем с -90 градусов)
    const angle = ((segmentCenter / 100) * 360 - 90) * (Math.PI / 180)

    // Позиция текста на внешнем контуре
    const textRadius = radius + strokeWidth / 2 + 15
    const x = centerX + Math.cos(angle) * textRadius
    const y = centerY + Math.sin(angle) * textRadius

    return { x, y }
  }

  return (
    <div className={`${styles.pieChart} ${className || ''}`}>
      <svg
        width={size}
        height={size}
        className={styles.chart}
      >
        {segments.map((segment, index) => {
          const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
          const strokeDashoffset = -accumulatedPercentage * circumference / 100

          const textPos = getTextPosition(segment.percentage, accumulatedPercentage)

          accumulatedPercentage += segment.percentage

          return (
            <g key={`${segment.name}-${index}`}>
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="transparent"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={styles.segment}
                style={{
                  transformOrigin: `${centerX}px ${centerY}px`,
                  transform: 'rotate(-90deg)'
                }}
              />
              {/* Отображаем проценты только для сегментов больше 5% */}
              {segment.percentage >= 5 && (
                <text
                  x={textPos.x}
                  y={textPos.y}
                  className={styles.percentageText}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {segment.percentage}%
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}