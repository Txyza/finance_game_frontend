# Yandex.Metrika Analytics для Cash-lvl

Интеграция с Яндекс.Метрикой для отслеживания пользовательского поведения в игре.

**Counter ID:** `104268538`

## Автоматическое отслеживание

### Просмотры страниц
Все переходы между страницами отслеживаются автоматически через `usePageTracking` hook.

### Предустановленные цели

#### Общие события:
- `user_registered` - Регистрация пользователя
- `game_started` - Начало игры
- `tutorial_completed` - Завершение обучения

#### Игровые события:
- `work_game_started` - Начало рабочей игры
- `work_game_completed` - Завершение рабочей игры
- `level_up` - Повышение уровня
- `achievement_unlocked` - Получение достижения

#### Финансовые события:
- `card_selected` - Выбор карты
- `shop_purchase` - Покупка в магазине
- `energy_purchased` - Покупка энергии
- `money_earned` - Заработок денег

## Ручное использование

### Импорт
```typescript
import {
  trackGoal,
  trackPageView,
  setUserParams,
  YandexMetrikaGoals
} from '@shared/lib/analytics'
```

### Отслеживание целей
```typescript
// Простая цель
trackGoal(YandexMetrikaGoals.SHOP_PURCHASE)

// Цель с параметрами
trackGoal(YandexMetrikaGoals.MONEY_EARNED, {
  amount: 1500,
  source: 'game_2048',
  level: 5
})

// Цель с callback
trackGoal(YandexMetrikaGoals.LEVEL_UP, { newLevel: 6 }, () => {
  console.log('Цель отправлена!')
})
```

### Установка параметров пользователя
```typescript
setUserParams({
  level: 5,
  energy: 25,
  money: 12500,
  cards: ['debit_basic', 'debit_premium']
})
```

### Установка User ID
```typescript
import { setUserID } from '@shared/lib/analytics'

setUserID('user_12345')
```

## Примеры интеграции

### В компонентах игры
```typescript
import { trackGoal, YandexMetrikaGoals } from '@shared/lib/analytics'

const Game2048Page = () => {
  const handleGameComplete = (score: number) => {
    trackGoal(YandexMetrikaGoals.GAME_2048_COMPLETED, {
      score,
      duration: gameTime,
      moves: totalMoves
    })
  }
}
```

### В магазине
```typescript
const ShopPage = () => {
  const handlePurchase = (item: string, price: number) => {
    trackGoal(YandexMetrikaGoals.SHOP_PURCHASE, {
      item,
      price,
      currency: 'RUB'
    })
  }
}
```

### При регистрации
```typescript
const OnboardingPage = () => {
  const handleRegistration = (cardType: string) => {
    trackGoal(YandexMetrikaGoals.USER_REGISTERED, {
      cardType,
      timestamp: Date.now()
    })

    trackGoal(YandexMetrikaGoals.CARD_SELECTED, {
      cardType
    })
  }
}
```

## Отладка

В development режиме все вызовы логируются в консоль:
```
Yandex.Metrika: Goal tracked { target: "shop_purchase", params: {...} }
Yandex.Metrika: Page view tracked { url: "/analytics", options: {...} }
```

## Проверка работы

1. Откройте DevTools → Network
2. Найдите запросы к `mc.yandex.ru`
3. Проверьте параметры в URL запросов

Или используйте Yandex.Metrika отладчик:
https://yandex.ru/support/metrica/code/counter-initialize.html