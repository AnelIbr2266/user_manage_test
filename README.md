# Сервис работы с пользователями

## Функциональность
- Регистрация и аутентификация пользователей
- Получение информации о пользователях
- Ролевая модель (admin/user)
- Блокировка/разблокировка аккаунтов

## Установка
### Шаги установки
```bash
git clone https://github.com/AnelIbr2266/user_manage_test.git
cd user_manage
npm install
```

## Конфигурация

Создайте файл .env в корне проекта:

```env
# Базовые настройки
PORT=3000
JWT_SECRET=your_secret
JWT_EXPIRES_IN=24h

# Настройки БД
DB_TYPE=sqlite
DB_NAME=your_name
```

## Использование API

### Авторизация
| Метод | Эндпоинт | Описание                                       |
|-------|--------|------------------------------------------------|
| POST  | /register | Регистрация пользователя                       |
| POST  | /login | Вход в систему                                 |
| GET   | /    | Список пользователей для админа                |
| GET   | /:id | Информация о пользователе( админ или сам юзер) |
| PATCH | /:id/block | Блокировка (сам себя или админ)                |

## Примеры запросов

### Регистрация пользователя
```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Подопытный 1",
    "birthDate": "2000-01-01",
    "email": "abcd@mail.com",
    "password": "password123"
  }'
```

### Получение списка пользователей
```bash
curl -X GET http://localhost:3000/ \
  -H "Authorization: Bearer ваш_токен"
```

## Запуск
```bash
npm run dev
```
