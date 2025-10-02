import React from 'react'
import { GameTile as GameTileType } from '../../model/types'
import styles from './GameTile.module.css'

interface GameTileProps {
  tile: GameTileType | null
}

const getTileColorClass = (value: number): string => {
  switch (value) {
    case 2: return styles.tile2
    case 4: return styles.tile4
    case 8: return styles.tile8
    case 16: return styles.tile16
    case 32: return styles.tile32
    case 64: return styles.tile64
    case 128: return styles.tile128
    case 256: return styles.tile256
    case 512: return styles.tile512
    case 1024: return styles.tile1024
    case 2048: return styles.tile2048
    default: return styles.tileSuper
  }
}

const getTextColorClass = (value: number): string => {
  // Все плитки имеют фиолетовый или градиентный фон, поэтому используем белый текст
  // Исключение только для super плитки (выше 2048) которая имеет светлый фон
  return value > 2048 ? styles.textDark : styles.textLight
}

export const GameTile: React.FC<GameTileProps> = ({ tile }) => {
  if (!tile) {
    return (
      <div className={`${styles.tile} ${styles.tileEmpty}`} />
    )
  }

  const tileClasses = [
    styles.tile,
    styles.tileFilled,
    getTileColorClass(tile.value),
    getTextColorClass(tile.value)
  ]

  if (tile.isNew) {
    tileClasses.push(styles.tileNew)
  }

  if (tile.isMerged) {
    tileClasses.push(styles.tileMerged)
  }

  return (
    <div className={tileClasses.join(' ')}>
      <div className={styles.tileInner}>
        {tile.value}
      </div>
    </div>
  )
}