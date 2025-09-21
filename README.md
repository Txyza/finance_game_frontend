# Финансовая игра - Frontend

React приложение с FSD архитектурой для хакатона ЛЦТ. Задача геймификации в мобильном приложении банка для повышения финансовой грамотности.

## 🚀 Быстрый старт

### Локальная разработка
```bash
# Установить зависимости
npm install

# Запустить development сервер
npm run dev

# Или через Make
make install
make dev
```

### Запуск через Docker

#### Production режим
```bash
# Собрать и запустить контейнеры
make docker-build
make docker-up

# Приложение будет доступно по адресу http://localhost
```

#### Development режим
```bash
# Собрать и запустить dev контейнеры
make docker-dev-build
make docker-dev-up

# Приложение будет доступно по адресу http://localhost:3000
# Vite dev server доступен напрямую на http://localhost:5173
# Поддержка Hot Module Replacement (HMR)
```

## 📁 Структура проекта (FSD)

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/         # Провайдеры (router, store)
│   └── styles/           # Глобальные стили
├── pages/                 # Страницы приложения
│   ├── home/             # Главная страница
│   ├── brandbook/        # Дизайн-система и компоненты
│   ├── game/             # Игровая страница (планируется)
│   ├── profile/          # Профиль пользователя (планируется)
│   └── leaderboard/      # Рейтинг игроков (планируется)
├── widgets/               # Композитные блоки UI
│   ├── header/           # Шапка сайта
│   ├── footer/           # Подвал
│   ├── EventCard/        # Карточка мероприятия
│   └── WorkshopCard/     # Карточка воркшопа
├── features/              # Функциональные возможности
│   └── auth/             # Авторизация (планируется)
├── entities/              # Бизнес-сущности
│   └── user/             # Пользователь (планируется)
└── shared/                # Переиспользуемый код
    ├── ui/               # UI компоненты (Button, Bubble, Card)
    ├── styles/           # Дизайн-токены и стили
    ├── config/           # Константы
    └── lib/              # Утилиты
```

## 🛠 Доступные команды

### Development
```bash
npm run dev         # Запуск dev сервера
npm run build       # Сборка для production
npm run lint        # Проверка линтерами
npm run type-check  # Проверка TypeScript
npm run test        # Запуск тестов
```

### Make команды
```bash
make help          # Показать все команды
make install       # Установить зависимости
make dev           # Запустить dev сервер
make build         # Собрать проект
make lint          # Проверить код
make clean         # Очистить проект
```

### Docker команды (Production)
```bash
make docker-build      # Собрать Docker образы
make docker-up         # Запустить контейнеры
make docker-down       # Остановить контейнеры
make docker-restart    # Перезапустить контейнеры
make docker-logs       # Показать логи
make docker-clean      # Очистить Docker ресурсы
make status           # Статус контейнеров
```

### Docker команды (Development)
```bash
make docker-dev-build    # Собрать образы для разработки
make docker-dev-up       # Запустить dev контейнеры
make docker-dev-down     # Остановить dev контейнеры
make docker-dev-restart  # Перезапустить dev контейнеры
make docker-dev-logs     # Показать логи dev контейнеров
```

## 🏗 Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **React Router** - роутинг
- **Zustand** - state management (планируется)
- **CSS Modules** - стилизация
- **ESLint + Prettier** - качество кода
- **Docker** - контейнеризация
- **Nginx** - веб-сервер

### Дизайн-система
- **Gazprombank Sans** - корпоративный шрифт
- **Halvar Breitschrift** - акцентный шрифт
- **CSS Custom Properties** - дизайн-токены
- **Адаптивная верстка** - Mobile First

## 🎯 Функциональность

### Готово ✅
- **FSD архитектура** - Feature-Sliced Design
- **Дизайн-система** - полная реализация брендбука Газпромбанк ТЕХ
- **UI компоненты** - Button, Bubble, Card с множественными вариантами
- **Составные компоненты** - EventCard, WorkshopCard с анимациями
- **Страница /brandbook** - демонстрация всех компонентов
- **Docker среда** - Development и Production режимы
- **Роутинг** - React Router настроен
- **TypeScript** - полная типизация
- **Responsive дизайн** - адаптивная верстка
- **Линтеры и форматтеры** - ESLint + Prettier

### В разработке 🚧
- **Игровая логика** - основной функционал приложения
- **API интеграция** - подключение к бэкенду
- **Авторизация** - система входа пользователей
- **Достижения** - система наград и прогресса
- **Статистика** - аналитика и метрики
- **Яндекс Метрика** - веб-аналитика

## 🔧 Разработка

### Создание нового компонента
```bash
# Создать компонент в shared слое
mkdir -p src/shared/ui/NewComponent
touch src/shared/ui/NewComponent/{NewComponent.tsx,NewComponent.module.css,index.ts}
```

### Добавление новой фичи
```bash
# Создать фичу
mkdir -p src/features/new-feature/{ui,model,api}
```

### Добавление новой страницы
```bash
# Создать страницу
mkdir -p src/pages/new-page/{ui,model}
```

## 🎨 Дизайн-система и стилизация

### Цветовая палитра
- **Основные цвета**: Черный (#000000), Фиалка (#1919ef), Мята (#58ffff), Малина (#dd41db)
- **Дополнительные**: Мелисса (#3cfeb9), Сакура (#ff82be)
- **8 градиентов** согласно брендбуку
- **Правило 80/20**: 80% основных цветов, 20% акцентных

### Компоненты
- **Button** - 7 вариантов, 3 размера, состояния loading/disabled
- **Bubble** - компактные элементы с иконками
- **Card** - универсальные карточки с градиентами
- **EventCard** - карточки мероприятий
- **WorkshopCard** - воркшопы с 3D-анимацией

### CSS Modules
```tsx
import styles from './Component.module.css'

export const Component = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Заголовок</h1>
  </div>
)
```

### CSS Custom Properties
```css
:root {
  --color-violet: #1919ef;
  --color-mint: #58ffff;
  --gradient-mint-melissa: linear-gradient(135deg, #58ffff 0%, #3cfeb9 100%);
}
```

## 📖 Демонстрация компонентов

Перейдите на `/brandbook` для просмотра всех компонентов дизайн-системы:
- **Цветовая палитра** с HEX-кодами
- **Все варианты кнопок** и баблов
- **Карточки** с градиентами
- **Составные компоненты** в действии
- **Типографика** и шрифты

## 📱 Адаптивность

Приложение адаптивно для всех устройств:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (до 767px)

## 🚀 Деплой

### Локальная сборка
```bash
# Production сборка
npm run build

# Или через Make
make build
```

### Docker деплой
```bash
# Собрать образы
make docker-build

# Запустить в production режиме
make docker-up

# Приложение будет доступно по адресу http://localhost
# Nginx автоматически проксирует запросы к React приложению
```

### Архитектура Docker
- **Frontend контейнер**: React приложение, собранный с Vite, запускается на порту 3000
- **Nginx контейнер**: Веб-сервер на порту 80, проксирует запросы к frontend
- **Development режим**: Hot Module Replacement, volume mounting для live reload
- **Production режим**: Оптимизированная сборка с Nginx
- **Healthchecks**: Автоматическая проверка работоспособности сервисов
- **Gzip сжатие**: Оптимизация статических файлов
- **SPA fallback**: Поддержка React Router

## 📋 Roadmap

### Этап 1: Основа ✅
- [x] FSD архитектура
- [x] Дизайн-система брендбука
- [x] Docker инфраструктура
- [x] Базовые компоненты

### Этап 2: Игровая логика 🚧
- [ ] Система уровней и прогресса
- [ ] Игровые механики
- [ ] Достижения и награды
- [ ] Сохранение прогресса

### Этап 3: Интеграция 📋
- [ ] API подключение
- [ ] Авторизация пользователей
- [ ] Аналитика (Яндекс Метрика)
- [ ] PWA функциональность

### Этап 4: Полировка 📋
- [ ] Тестирование (Unit, E2E)
- [ ] Оптимизация производительности
- [ ] Accessibility (WCAG)
- [ ] SEO оптимизация

## 📝 Соглашения

### Именование файлов
- Компоненты: `PascalCase.tsx`
- Хуки: `useCamelCase.ts`
- Утилиты: `camelCase.ts`
- Типы: `types.ts`

### Импорты
```tsx
// 1. React импорты
import { FC } from 'react'

// 2. Внешние библиотеки
import { Link } from 'react-router-dom'

// 3. Внутренние импорты (по слоям FSD)
import { Button } from '@shared/ui'
import { useAuthStore } from '@features/auth'

// 4. Относительные импорты
import styles from './Component.module.css'
```

### Структура компонента
```tsx
import { FC } from 'react'
import styles from './Component.module.css'

interface ComponentProps {
  title: string
  onClick?: () => void
}

export const Component: FC<ComponentProps> = ({ title, onClick }) => {
  return (
    <div className={styles.component}>
      <h1>{title}</h1>
      <button onClick={onClick}>Кнопка</button>
    </div>
  )
}
```

## 🤝 Участие в разработке

1. Форк репозитория
2. Создание ветки: `git checkout -b feature/new-feature`
3. Коммит изменений: `git commit -m 'Add new feature'`
4. Пуш ветки: `git push origin feature/new-feature`
5. Создание Pull Request

## 📄 Лицензия

MIT License