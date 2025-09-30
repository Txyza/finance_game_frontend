export interface PlayerStats {
  level: number
  currentExp: number
  maxExp: number
  energy: number
  maxEnergy: number
  money: number
  bankRate: number
  inflation: number
}

export interface GameActions {
  onDailyClick: () => void
  onNotificationsClick: () => void
  onLeaderboardClick: () => void
  onFriendsClick: () => void
  onWorkClick: () => void
}

export type NavigationTab = 'analytics' | 'character' | 'rating'