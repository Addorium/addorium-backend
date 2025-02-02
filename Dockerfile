# Stage 1: Builder
FROM node:20.11.1-alpine AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile


# Копирование исходного кода и сборка
COPY . .

RUN pnpm prisma generate

RUN pnpm scan-perms

RUN pnpm build

# Stage 2: Production
FROM node:20.11.1-alpine AS production

RUN npm install -g pnpm

WORKDIR /app



# Копирование собранного приложения и установленных зависимостей
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/permissions.txt ./

# Установка переменных окружения (если нужно)
# ENV NODE_ENV=production

EXPOSE 4200

# Запуск приложения
CMD ["pnpm", "start:prod"]


