# Stage 1: Builder
FROM node:20.11.1-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Копирование исходного кода и сборка
COPY . .
RUN yarn build

# Stage 2: Production
FROM node:20.11.1-alpine AS production

WORKDIR /app

# Копирование собранного приложения и установленных зависимостей
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Установка переменных окружения (если нужно)
# ENV NODE_ENV=production

# Запуск приложения
CMD ["yarn", "start:prod"]

EXPOSE 4200
