export interface FeatureUnlockConfig {
  requiredLevel: number
  featureName: string
}

export const FEATURE_UNLOCK_LEVELS = {
  shop: {
    requiredLevel: 2,
    featureName: 'Магазин'
  },
  analytics: {
    requiredLevel: 2,
    featureName: 'Аналитика'
  },
  city: {
    requiredLevel: 3,
    featureName: 'Город'
  }
} as const

export type FeatureType = keyof typeof FEATURE_UNLOCK_LEVELS

export const isFeatureUnlocked = (featureType: FeatureType, currentLevel: number): boolean => {
  const config = FEATURE_UNLOCK_LEVELS[featureType]
  return currentLevel >= config.requiredLevel
}

export const getFeatureUnlockMessage = (featureType: FeatureType): string => {
  const config = FEATURE_UNLOCK_LEVELS[featureType]
  return `${config.featureName} откроется на ${config.requiredLevel} уровне`
}