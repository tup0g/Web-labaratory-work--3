# PizzaCRUD — Лабораторна робота №3

Мобільний/веб застосунок для управління меню піцерії з повним CRUD.

## Стек технологій

| Рівень | Технологія |
|--------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| База даних | SQLite (через пакет `sqlite3`) |
| Роутинг | React Router DOM v6 |
| HTTP клієнт | Axios |

## Запуск проєкту

### Backend (порт 3001)
```bash
cd backend
npm install
npm run dev
```

### Frontend (порт 5173)
```bash
cd frontend
npm install
npm run dev
```

Відкрийте http://localhost:5173

## Структура проєкту

```
Lab 3 Web/
├── backend/
│   ├── src/
│   │   ├── db/database.ts          # Підключення до SQLite
│   │   ├── models/Pizza.ts         # Інтерфейс Pizza
│   │   ├── dao/PizzaDAO.ts         # Data Access Object
│   │   ├── controllers/PizzaController.ts
│   │   ├── routes/pizzaRoutes.ts
│   │   └── index.ts                # Express сервер
│   └── tsconfig.json
├── frontend/
│   └── src/
│       ├── api/pizzaApi.ts         # HTTP запити
│       ├── types/Pizza.ts          # Типи TypeScript
│       ├── pages/
│       │   ├── PizzaList.tsx       # Список піц (екран 1)
│       │   └── PizzaForm.tsx       # Форма створення/редагування (екран 2)
│       ├── App.tsx
│       └── index.css
├── database.sqlite                  # Файл БД (автостворюється)
└── .gitignore
```

## API Endpoints

| Метод | URL | Опис |
|-------|-----|------|
| GET | /api/pizzas | Список всіх піц |
| GET | /api/pizzas/:id | Піца за ID |
| POST | /api/pizzas | Створити піцу |
| PUT | /api/pizzas/:id | Оновити піцу |
| DELETE | /api/pizzas/:id | Видалити піцу |

## Атрибути сутності Pizza

| Атрибут | Тип | Опис |
|---------|-----|------|
| id | INTEGER | Первинний ключ (автоінкремент) |
| name | TEXT | Назва піци (обов'язкове) |
| price | REAL | Ціна в гривнях (обов'язкове, ≥ 0) |
| size | TEXT | Розмір: Мала / Середня / Велика |
| description | TEXT | Опис, інгредієнти |
