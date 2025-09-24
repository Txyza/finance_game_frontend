export type DistrictId = 'safe' | 'credit' | 'shopping' | 'stock'

export interface Building {
  id: string
  name: string
  icon: string
  districtId: DistrictId
  position: {
    x: number // процент от ширины района
    y: number // процент от высоты района
  }
  isUnlocked: boolean
  requiredLevel: number
}

export interface District {
  id: DistrictId
  name: string
  color: string
  bounds: {
    points: string // SVG polygon points
    center: { x: number; y: number }
  }
  buildings: Building[]
  isUnlocked: boolean
  requiredLevel: number
}

export const DISTRICTS_DATA: District[] = [
  {
    id: 'safe',
    name: 'Безопасный район',
    color: '#4ade80',
    bounds: {
      points: '5,5 295,5 295,395 5,395', // Левый верхний прямоугольник (3:2 вертикальный)
      center: { x: 150, y: 200 }
    },
    buildings: [
      {
        id: 'deposits',
        name: 'Вклады',
        icon: '🏦',
        districtId: 'safe',
        position: { x: 30, y: 40 },
        isUnlocked: true,
        requiredLevel: 1
      },
      {
        id: 'savings',
        name: 'Накопительные инструменты',
        icon: '💰',
        districtId: 'safe',
        position: { x: 70, y: 60 },
        isUnlocked: true,
        requiredLevel: 2
      }
    ],
    isUnlocked: true,
    requiredLevel: 1
  },
  {
    id: 'credit',
    name: 'Кредитный район',
    color: '#f87171',
    bounds: {
      points: '305,5 595,5 595,395 305,395', // Правый верхний прямоугольник (3:2 вертикальный)
      center: { x: 450, y: 200 }
    },
    buildings: [
      {
        id: 'loans',
        name: 'Кредиты',
        icon: '💳',
        districtId: 'credit',
        position: { x: 35, y: 45 },
        isUnlocked: true,
        requiredLevel: 3
      },
      {
        id: 'mortgage',
        name: 'Ипотека',
        icon: '🏠',
        districtId: 'credit',
        position: { x: 65, y: 55 },
        isUnlocked: false,
        requiredLevel: 5
      }
    ],
    isUnlocked: true,
    requiredLevel: 3
  },
  {
    id: 'shopping',
    name: 'ТЦ район',
    color: '#a78bfa',
    bounds: {
      points: '5,405 295,405 295,795 5,795', // Левый нижний прямоугольник (3:2 вертикальный)
      center: { x: 150, y: 600 }
    },
    buildings: [
      {
        id: 'auto',
        name: 'Автомагазин',
        icon: '🚗',
        districtId: 'shopping',
        position: { x: 25, y: 30 },
        isUnlocked: false,
        requiredLevel: 4
      },
      {
        id: 'realestate',
        name: 'Жилой комплекс',
        icon: '🏢',
        districtId: 'shopping',
        position: { x: 50, y: 50 },
        isUnlocked: false,
        requiredLevel: 6
      },
      {
        id: 'sports',
        name: 'Спортивный магазин',
        icon: '⚽',
        districtId: 'shopping',
        position: { x: 75, y: 70 },
        isUnlocked: false,
        requiredLevel: 7
      }
    ],
    isUnlocked: false,
    requiredLevel: 4
  },
  {
    id: 'stock',
    name: 'Биржевой район',
    color: '#fbbf24',
    bounds: {
      points: '305,405 595,405 595,795 305,795', // Правый нижний прямоугольник (3:2 вертикальный)
      center: { x: 450, y: 600 }
    },
    buildings: [
      {
        id: 'exchange',
        name: 'Биржа',
        icon: '📈',
        districtId: 'stock',
        position: { x: 50, y: 50 },
        isUnlocked: false,
        requiredLevel: 8
      }
    ],
    isUnlocked: false,
    requiredLevel: 8
  }
]