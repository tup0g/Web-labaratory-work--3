# PizzaCRUD — Лабораторна робота №3

Мобільний/веб застосунок для управління меню піцерії з повним CRUD.

## Стек технологій

| Рівень | Технологія |
|--------|-----------|
| Frontend | React Native (Expo) + TypeScript |
| Backend | Node.js + Express + TypeScript |
| База даних | SQLite (через пакет `sqlite3`) |
| Роутинг | React Navigation (Native Stack) |
| HTTP клієнт | Axios |

## Запуск проєкту

### Backend (порт 3001)
```bash
cd backend
npm install
npm run dev
```

### Frontend (React Native - Expo)
```bash
cd mobile
npm install
npm run web      # для запуску в браузері (найшвидше для скріншотів)
npm run android  # для запуску на Android емуляторі
npm run ios      # для запуску на iOS симуляторі
```

## Структура проєкту

```
Lab 3 Web/
├── backend/                  # Node.js + SQLite Backend
│   └── src/
│       ├── db/database.ts          
│       ├── models/Pizza.ts         
│       ├── dao/PizzaDAO.ts         
│       ├── controllers/PizzaController.ts
│       ├── routes/pizzaRoutes.ts
│       └── index.ts                
├── mobile/                   # React Native (Expo) застосунок
│   ├── src/
│   │   ├── api/pizzaApi.ts         
│   │   ├── types/Pizza.ts          
│   │   └── screens/
│   │       ├── PizzaListScreen.tsx # Список піц (екран 1)
│   │       └── PizzaFormScreen.tsx # Форма (екран 2)
│   ├── App.tsx               # Навігація
│   └── app.json
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
