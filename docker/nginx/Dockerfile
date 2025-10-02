FROM nginx:alpine

# Устанавливаем необходимые пакеты
RUN apk add --no-cache curl

# Удаляем дефолтную конфигурацию
RUN rm /etc/nginx/conf.d/default.conf

# Копируем нашу конфигурацию - используем production конфиг
COPY docker/nginx/nginx.prod.conf /etc/nginx/nginx.conf

# Создаем директории
RUN mkdir -p /var/log/nginx /var/cache/nginx

# Создаем пользователя nginx если его нет
RUN addgroup -g 101 -S nginx || true
RUN adduser -S nginx -u 101 -G nginx || true

# Устанавливаем права
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]