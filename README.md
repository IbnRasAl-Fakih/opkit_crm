# Opkit CRM

Тестовый CRM-проект с backend на NestJS и frontend на React + TypeScript.

Сейчас в проекте реализованы:
- регистрация и вход по JWT
- CRUD задач
- канбан и list-view
- WebSocket-обновление статусов задач

## Технологии

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
│  ├─ .env.example
│  └─ package.json
└─ README.md
```

## Требования

Локально должны быть установлены:
- Node.js 20+
- npm
- PostgreSQL 15+ или совместимая версия

## Настройка базы данных

1. Создай базу данных PostgreSQL:

```sql
CREATE DATABASE opkit_crm;
```

2. Проверь `backend/.env`.

Пример:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/opkit_crm?schema=public"
JWT_SECRET="opkit-crm-dev-secret"
JWT_EXPIRES_IN="1d"
```

## Локальный запуск backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate:dev
npm run start:dev
```

По умолчанию backend поднимается на:
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

## Локальный запуск frontend

1. Создай `frontend/.env`:

```env
VITE_API_URL="http://localhost:3000/api"
VITE_SOCKET_URL="http://localhost:3001"
```

2. Запусти frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен по адресу:
- `http://localhost:5173`

## Что где находится

Backend:
- `auth` — регистрация, вход, JWT guard
- `tasks` — CRUD задач и WebSocket-события
- `users` — список пользователей для выбора исполнителя
- `prisma` — подключение Prisma и схема БД

Frontend:
- `app` — router и providers
- `components` — общие компоненты
- `features/auth` — формы авторизации
- `features/tasks` — задачи, канбан, list-view, sidebar, модалка
- `icons` — локальные SVG-иконки как React-компоненты
- `pages` — page-level экраны
- `socket` — клиент WebSocket