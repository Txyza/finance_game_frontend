/**
 * Yandex.Metrika TypeScript definitions
 * Counter ID: 104268538
 */

export interface YandexMetrikaParams {
  accurateTrackBounce?: boolean
  childIframe?: boolean
  clickmap?: boolean
  defer?: boolean
  ecommerce?: boolean | string | object
  params?: object
  trackHash?: boolean
  trackLinks?: boolean
  trustedDomains?: string[]
  type?: number
  webvisor?: boolean
  triggerEvent?: boolean
  ssr?: boolean
}

export interface YandexMetrikaGoalParams {
  [key: string]: any
}

export interface YandexMetrikaUserParams {
  [key: string]: any
}

export interface YandexMetrikaHit {
  referer?: string
  title?: string
  params?: YandexMetrikaUserParams
  callback?: () => void
}

export interface YandexMetrikaReachGoal {
  target: string
  params?: YandexMetrikaGoalParams
  callback?: () => void
  ctx?: any
}

export interface YandexMetrikaExtLink {
  url: string
  title?: string
  params?: YandexMetrikaUserParams
  callback?: () => void
}

declare global {
  interface Window {
    ym: (
      id: number,
      action: string,
      ...args: any[]
    ) => void
  }
}

// Extend window object
declare function ym(id: number, action: 'init', params?: YandexMetrikaParams): void
declare function ym(id: number, action: 'hit', url?: string, options?: YandexMetrikaHit): void
declare function ym(id: number, action: 'reachGoal', target: string, params?: YandexMetrikaGoalParams, callback?: () => void, ctx?: any): void
declare function ym(id: number, action: 'extLink', url: string, options?: YandexMetrikaExtLink): void
declare function ym(id: number, action: 'file', url: string, options?: YandexMetrikaExtLink): void
declare function ym(id: number, action: 'params', userParams: YandexMetrikaUserParams): void
declare function ym(id: number, action: 'userParams', userParams: YandexMetrikaUserParams): void
declare function ym(id: number, action: 'setUserID', userID: string): void
declare function ym(id: number, action: 'getClientID', callback: (clientID: string) => void): void