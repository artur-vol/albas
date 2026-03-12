[![CI Pipeline](https://github.com/artur-vol/albas/actions/workflows/ci.yaml/badge.svg)](https://github.com/artur-vol/albas/actions/workflows/ci.yaml)

# 📚 Library Management System (MERN, MongoDB, Swagger)

## 🛠️ Інструкція по запуску

### 1. Клонування репозиторію

```bash
git clone https://github.com/<твій-логін>/library-system.git
cd library-system
````

### 2. Створення `.env` файлів

У директоріях `backend/` та `frontend/` необхідно створити файли `.env`, взявши за основу `.env.example`, що розташовані відповідно в кожній частині.

> ✅ **У полі `JWT_SECRET` вкажіть будь-яке рандомне слово латиницею.**

### 3. Запуск сервісів через Docker

У кореневій директорії проєкту виконайте команду:

```bash
docker compose up --build -d
```

Це автоматично підніме всі контейнери: MongoDB, бекенд і фронтенд.

### 4. Доступ до системи

* **Service**: [http://localhost:5001](http://localhost:5001)



