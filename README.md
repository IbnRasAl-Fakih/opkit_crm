# Opkit CRM

Тестовый CRM-проект с backend на NestJS и frontend на React + TypeScript.

Сейчас в проекте реализованы:
- регистрация и вход по JWT
- CRUD задач
- канбан и list-view
- WebSocket-обновление задач
- клиентская валидация форм

## Стек

Backend:
- NestJS
- Prisma ORM
- PostgreSQL
- JWT
- bcryptjs
- WebSocket (`ws`)
- class-validator

Frontend:
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Структура проекта

```text
opkit_crm/
├─ backend/
│  ├─ prisma/
│  │  ├─ migrations/
│  │  └─ schema.prisma
│  ├─ src/
│  │  ├─ auth/
│  │  ├─ common/
│  │  ├─ prisma/
│  │  ├─ tasks/
│  │  ├─ users/
│  │  ├─ app.module.ts
│  │  └─ main.ts
│  ├─ .env
│  └─ package.json
├─ frontend/
│  ├─ public/
│  │  └─ images/
│  ├─ src/
│  │  ├─ app/
│  │  ├─ components/
│  │  ├─ features/
│  │  │  ├─ auth/
│  │  │  └─ tasks/
│  │  ├─ hooks/
│  │  ├─ icons/
│  │  ├─ pages/
│  │  ├─ socket/
│  │  ├─ types/
│  │  └─ main.tsx
│  ├─ .env
│  └─ package.json
├─ docker-compose.yml
├─ setup-db.ps1
├─ run-dev.ps1
├─ run-dev.bat
└─ README.md
```

## Требования

Локально должны быть установлены:
- Node.js 20+
- npm
- Docker Desktop или Docker Engine с `docker compose`

## Переменные окружения

### Backend

Файл: `backend/.env`

```env
DATABASE_URL="postgresql://postgres:qwerty123@localhost:5433/opkit_crm?schema=public"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="1d"
```

### Frontend

Файл: `frontend/.env`

```env
VITE_API_URL="http://localhost:3000/api"
VITE_SOCKET_URL="http://localhost:3001"
```

## Запуск базы данных

В проекте добавлен `docker-compose.yml` для PostgreSQL.

Ручной запуск:

```bash
docker compose up -d
```

База будет доступна на:
- `localhost:5433`

Контейнер:
- `opkit_crm_postgres`

## Применение миграций

После старта базы нужно применить Prisma-миграции:

```bash
cd backend
npm run prisma:migrate:deploy
```

Или через скрипт из корня проекта:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup-db.ps1
```

Что делает `setup-db.ps1`:
- поднимает PostgreSQL через Docker Compose
- ждет `healthy`-статус контейнера
- применяет Prisma-миграции

## Быстрый запуск всего проекта

Из корня проекта:

```bat
.\run-dev.bat
```

Или:

```powershell
powershell -ExecutionPolicy Bypass -File .\run-dev.ps1
```

Что делает `run-dev`:
- вызывает `setup-db.ps1`
- запускает backend в отдельном окне PowerShell
- запускает frontend в отдельном окне PowerShell

## Ручной локальный запуск

### 1. Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run start:dev
```

Backend по умолчанию поднимается на:
- REST API: `http://localhost:3000/api`
- WebSocket: `ws://localhost:3001/ws`

Основные роуты:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен по адресу:
- `http://localhost:5173`

## Полезные команды

Поднять БД:

```bash
docker compose up -d
```

Остановить БД:

```bash
docker compose down
```

Посмотреть статус контейнера:

```bash
docker compose ps
```

Применить миграции:

```bash
cd backend
npm run prisma:migrate:deploy
```

Сгенерировать Prisma client:

```bash
cd backend
npm run prisma:generate
```

Собрать frontend:

```bash
cd frontend
npm run build
```

## Что где находится

Backend:
- `auth` — регистрация, вход, JWT guard
- `tasks` — CRUD задач и WebSocket-события
- `users` — список пользователей для выбора исполнителя
- `prisma` — Prisma client и схема БД

Frontend:
- `app` — router и providers
- `components` — общие компоненты
- `features/auth` — формы авторизации
- `features/tasks` — задачи, канбан, list-view, sidebar, модалка
- `icons` — локальные SVG-иконки как React-компоненты
- `pages` — page-level экраны
- `socket` — клиент WebSocket
