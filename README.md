# 💰 Cash Level - Финансовая игра

Образовательная игра для повышения финансовой грамотности. Frontend приложение на React с TypeScript и FSD архитектурой.

## 🎮 О проекте

Cash Level - это мобильная игра, которая помогает пользователям изучать основы финансовой грамотности через игровые механики. Проект разработан для хакатона ЛЦТ 2024.

### Основные возможности
- 📊 Система уровней и прогресса
- 💼 Различные виды работ и заданий
- 🏪 Магазин улучшений и бонусов
- 📈 Отслеживание финансовых показателей
- 🏆 Система достижений
- 📱 Адаптивный дизайн для мобильных устройств

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+
- npm или yarn
- Docker и Docker Compose (для контейнерного запуска)

### Локальная разработка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd finance_game_frontend

# Установить зависимости
npm install

# Запустить development сервер
npm run dev

# Приложение будет доступно на http://localhost:3000
```

### Docker окружение

#### Development режим (с hot-reload)
```bash
# Запустить все сервисы (frontend, backend, БД)
make run PROFILE=dev

# Доступ:
# - Frontend через Nginx: http://localhost:8080
# - Backend API: http://localhost:8000
# - Frontend Dev Server: http://localhost:5173
```

#### Production режим
```bash
# Запустить production окружение
make run

# Приложение будет доступно на https://cash-lvl.ru
```

## 🏗️ Архитектура

### Технологический стек

#### Frontend
- **React 18** - UI библиотека
- **TypeScript** - статическая типизация
- **Vite** - сборщик и dev-сервер
- **React Router** - клиентский роутинг
- **CSS Modules** - изоляция стилей
- **Zustand** - управление состоянием

#### Backend интеграция
- **FastAPI** - REST API
- **PostgreSQL** - основная БД
- **Redis** - кеширование
- **Docker** - контейнеризация

#### Инфраструктура
- **Nginx** - reverse proxy
- **Docker Compose** - оркестрация
- **GitHub Actions** - CI/CD
- **Yandex Metrika** - аналитика

### Feature-Sliced Design (FSD)

```
src/
├── app/                    # Инициализация приложения
│   ├── providers/         # Провайдеры (router, store)
│   ├── layouts/          # Основные лейауты
│   └── styles/           # Глобальные стили
│
├── pages/                 # Страницы приложения
│   ├── main/             # Главная страница игры
│   ├── work/             # Мини-игры (2048, etc)
│   ├── shop/             # Магазин
│   ├── analytics/        # Аналитика прогресса
│   ├── character/        # Персонаж и инвентарь
│   └── brandbook/        # UI Kit демо
│
├── widgets/               # Композитные блоки UI
│   ├── GameHeader/       # Игровая шапка с ресурсами
│   ├── BottomNavigation/ # Навигация
│   └── LeaderboardList/  # Список лидеров
│
├── features/              # Функциональность
│   ├── auth/             # Авторизация
│   ├── game-session/     # Игровая сессия
│   └── achievements/     # Достижения
│
├── entities/              # Бизнес-сущности
│   ├── user/             # Пользователь
│   ├── work/             # Работа
│   ├── task/             # Задания
│   └── store/            # Товары магазина
│
└── shared/                # Переиспользуемый код
    ├── api/              # API клиент и типы
    ├── ui/               # UI компоненты
    ├── lib/              # Утилиты
    ├── utils/            # Хелперы
    └── context/          # React контексты
```

## 📦 Основные компоненты

### UI Kit
- **Button** - 7 вариантов с градиентами
- **Bubble** - компактные элементы для ресурсов
- **Card** - универсальные карточки
- **ProgressBar** - прогресс-бары
- **GameHeader** - игровая информация
- **AnalyticsCard** - карточки статистики

### Игровые механики
- **Система уровней** - прогрессия игрока (1-15+ уровни)
- **Энергия** - ограниченный ресурс для действий
- **Валюта** - деньги для покупок
- **Опыт** - прогресс к следующему уровню

### API интеграция

```typescript
// Основные эндпоинты
GET  /api/v1/user/me      # Профиль игрока
GET  /api/v1/work/list     # Список работ
POST /api/v1/work/start    # Начать работу
POST /api/v1/work/stop     # Завершить работу
GET  /api/v1/store/list    # Товары магазина
POST /api/v1/store/buy     # Покупка товара
GET  /api/v1/task/list     # Список заданий
POST /api/v1/task/reward   # Получить награду
```

## 🛠️ Разработка

### Команды

```bash
# Development
npm run dev           # Dev сервер с hot-reload
npm run build         # Production сборка
npm run preview       # Предпросмотр production сборки
npm run lint          # ESLint проверка
npm run type-check    # TypeScript проверка

# Docker через Make
make run PROFILE=dev  # Запуск dev окружения
make run              # Запуск production
make build            # Пересборка образов
make stop             # Остановка контейнеров
make logs             # Просмотр логов
make clean            # Полная очистка
```

### Переменные окружения

```bash
# .env для development
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME="Cash Level"
VITE_APP_VERSION=0.1.0

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=finance_game

# Backend
SECRET_KEY=dev-secret-key
API_V1_STR=/api/v1
```

### Создание нового компонента

```bash
# UI компонент
mkdir -p src/shared/ui/NewComponent
touch src/shared/ui/NewComponent/{index.ts,NewComponent.tsx,NewComponent.module.css}

# Страница
mkdir -p src/pages/new-page/ui
touch src/pages/new-page/ui/{index.ts,NewPage.tsx,NewPage.module.css}

# Feature
mkdir -p src/features/new-feature/{ui,model,api}
```

## 🎨 Дизайн-система

### Цветовая палитра
- **Основные**: Черный (#000000), Фиалка (#1919ef), Мята (#58ffff)
- **Акцентные**: Малина (#dd41db), Мелисса (#3cfeb9), Сакура (#ff82be)
- **8 градиентов** для различных элементов

### Типографика
- **Основной**: Inter, system fonts
- **Моноширинный**: monospace для чисел

### Адаптивность
- Mobile First подход
- Breakpoints: 768px (tablet), 1200px (desktop)
- Оптимизация для touch устройств

## 📊 Мониторинг и аналитика

### Yandex Metrika
- Отслеживание переходов между страницами
- События игровых действий
- Конверсии и достижения

### Логирование
- Ошибки API в консоль
- Docker логи для всех сервисов
- Nginx access и error логи

## 🚢 Deployment

### Production окружение
```bash
# Настройка SSL сертификатов
cp /path/to/cert/* ./cert/

# Создать .env.prod
cp .env.example .env.prod
# Отредактировать production значения

# Запустить production
make run PROFILE=prod
```

### Требования сервера
- Docker 20.10+
- Docker Compose 2.0+
- 2 CPU cores минимум
- 4GB RAM минимум
- 10GB свободного места

## 📈 Roadmap

### ✅ Завершено
- FSD архитектура
- Базовый UI Kit
- Docker инфраструктура
- Интеграция с backend API
- Система уровней
- Мини-игра 2048
- Yandex Metrika

### 🚧 В разработке
- Дополнительные мини-игры
- Push уведомления
- Система достижений
- Социальные функции

### 📋 Планируется
- PWA функционал
- Offline режим
- Интеграция с банковским API
- A/B тестирование
- Unit и E2E тесты

## 🤝 Команда

Проект разработан для хакатона ЛЦТ 2024

## 📄 Лицензия

MIT License - см. файл LICENSE для подробностей

---

**Полезные ссылки:**
- [API документация](http://localhost:8000/docs) - Swagger UI
- [Brandbook демо](http://localhost:8080/brandbook) - UI компоненты
- [Yandex Metrika](https://metrika.yandex.ru) - Аналитика