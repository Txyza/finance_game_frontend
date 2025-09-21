.DEFAULT_GOAL := help

.PHONY: help
help: ## Показать справку по командам
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Development команды
.PHONY: install
install: ## Установить зависимости
	npm install

.PHONY: dev
dev: ## Запустить development сервер
	npm run dev

.PHONY: build
build: ## Собрать проект для production
	npm run build

.PHONY: lint
lint: ## Проверить код линтерами
	npm run lint
	npm run type-check

# Docker команды (Production)
.PHONY: docker-build
docker-build: ## Собрать Docker образы
	docker-compose build

.PHONY: docker-up
docker-up: ## Запустить Docker контейнеры
	docker-compose up -d
	@echo "Application is running at http://localhost"

.PHONY: docker-down
docker-down: ## Остановить Docker контейнеры
	docker-compose down

.PHONY: docker-logs
docker-logs: ## Показать логи Docker контейнеров
	docker-compose logs -f

.PHONY: docker-restart
docker-restart: docker-down docker-up ## Перезапустить Docker контейнеры

.PHONY: docker-clean
docker-clean: ## Очистить Docker ресурсы
	docker-compose down -v
	docker system prune -f

# Docker команды (Development)
.PHONY: docker-dev-build
docker-dev-build: ## Собрать Docker образы для разработки
	docker-compose -f docker-compose.dev.yml build

.PHONY: docker-dev-up
docker-dev-up: ## Запустить Docker контейнеры для разработки
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Development server is running at http://localhost:3000"
	@echo "Vite dev server is at http://localhost:5173"

.PHONY: docker-dev-down
docker-dev-down: ## Остановить Docker контейнеры для разработки
	docker-compose -f docker-compose.dev.yml down

.PHONY: docker-dev-logs
docker-dev-logs: ## Показать логи Docker контейнеров для разработки
	docker-compose -f docker-compose.dev.yml logs -f

.PHONY: docker-dev-restart
docker-dev-restart: docker-dev-down docker-dev-up ## Перезапустить Docker контейнеры для разработки

# Утилиты
.PHONY: clean
clean: ## Очистить временные файлы
	rm -rf dist node_modules

.PHONY: status
status: ## Показать статус Docker контейнеров
	docker-compose ps