import { FC, ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  background?: 'solid' | 'gradient' | 'image'
  gradientType?: 'mint-melissa' | 'mint-violet' | 'raspberry-sakura' | 'raspberry-violet' | 'violet-cumin' | 'black-cumin'
  backgroundColor?: 'violet' | 'black' | 'mint' | 'raspberry' | 'iris' | 'cumin'
  imageUrl?: string
  overlay?: boolean
  padding?: 'none' | 'small' | 'medium' | 'large'
  radius?: 'small' | 'medium' | 'large' | 'xl'
  shadow?: boolean
  children: ReactNode
  className?: string
  onClick?: () => void
}

export const Card: FC<CardProps> = ({
  background = 'solid',
  gradientType = 'mint-melissa',
  backgroundColor = 'violet',
  imageUrl,
  overlay = false,
  padding = 'medium',
  radius = 'large',
  shadow = true,
  children,
  className = '',
  onClick
}) => {
  const classNames = [
    styles.card,
    styles[background],
    background === 'gradient' && styles[gradientType],
    background === 'solid' && styles[backgroundColor],
    background === 'image' && overlay && styles.overlay,
    styles[`padding-${padding}`],
    styles[`radius-${radius}`],
    shadow && styles.shadow,
    onClick && styles.clickable,
    className
  ].filter(Boolean).join(' ')

  const cardStyle = background === 'image' && imageUrl
    ? { backgroundImage: `url(${imageUrl})` }
    : undefined

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      className={classNames}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </Component>
  )
}