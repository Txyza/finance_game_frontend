# Default profile
PROFILE ?= prod

# Docker compose files
ifeq ($(PROFILE),dev)
	COMPOSE_FILE = docker-compose.yml
	ENV_FILE = .env
else
	COMPOSE_FILE = docker-compose.prod.yml
	ENV_FILE = .env.prod
endif

.DEFAULT_GOAL := help

.PHONY: help
help: ## Показать справку по командам
	@echo "Usage: make [command] [PROFILE=dev|prod]"
	@echo "Default profile: prod"
	@echo ""
	@echo "Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

.PHONY: run
run: ## Запустить контейнеры
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d
	@echo "Running with profile: $(PROFILE)"
	@if [ "$(PROFILE)" = "dev" ]; then \
		echo "Development server: http://localhost:5173"; \
	else \
		echo "Production server: https://cash-lvl.ru"; \
		echo "API endpoint: https://cash-lvl.ru/"; \
	fi

.PHONY: build
build: ## Собрать образы
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) build

.PHONY: stop
stop: ## Остановить контейнеры
	docker-compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down

.PHONY: logs
logs: ## Показать логи
	docker-compose -f $(COMPOSE_FILE) logs -f

.PHONY: restart
restart: stop run ## Перезапустить контейнеры

.PHONY: clean
clean: ## Очистить все контейнеры и образы
	docker-compose -f $(COMPOSE_FILE) down -v
	docker system prune -f

.PHONY: status
status: ## Показать статус контейнеров
	docker-compose -f $(COMPOSE_FILE) ps