# Многостадийная сборка для оптимизации

# Стадия 1: Сборка приложения
FROM node:20-alpine AS builder

# Принимаем аргументы сборки для переменных окружения
ARG VITE_API_URL
ARG VITE_APP_NAME
ARG VITE_APP_VERSION

# Устанавливаем переменные окружения для Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION

WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Собираем приложение (Vite использует переменные окружения)
RUN npm run build

# Стадия 2: Production сервер
FROM node:20-alpine AS production

WORKDIR /app

# Устанавливаем зависимости для production сервера
COPY package*.json ./
RUN npm install express compression helmet --only=production

# Копируем собранное приложение и server.cjs
COPY --from=builder /app/dist ./dist
COPY server.cjs ./

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Меняем владельца файлов
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.cjs"]