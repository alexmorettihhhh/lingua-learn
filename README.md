# LinguaLearn - Приложение для изучения языков

Интерактивное веб-приложение для эффективного изучения иностранных языков с использованием техник интервального повторения и элементов геймификации.

## Особенности

- **Интервальное повторение**: Алгоритм, основанный на кривой забывания Эббингауза, для оптимального запоминания слов и фраз
- **Геймификация**: Система очков, достижений и уровней для повышения мотивации
- **Разнообразные упражнения**: Карточки, тесты, аудирование и другие форматы заданий
- **Отслеживание прогресса**: Детальная статистика и визуализация вашего прогресса
- **Персонализация**: Адаптация под ваш уровень и интересы

## Технологии

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- База данных: MongoDB
- Аутентификация: JWT

## Установка и запуск

### Требования
- Node.js (v14+)
- npm или yarn
- MongoDB

### Установка

1. Клонировать репозиторий
```
git clone https://github.com/yourusername/lingua-learn.git
cd lingua-learn
```

2. Установить зависимости
```
# Установка зависимостей для бэкенда
cd server
npm install

# Установка зависимостей для фронтенда
cd ../client
npm install
```

3. Настройка переменных окружения
```
# В директории server создайте файл .env
cp .env.example .env
# Отредактируйте .env файл, указав необходимые параметры
```

4. Запуск приложения
```
# Запуск бэкенда
cd server
npm run dev

# Запуск фронтенда (в отдельном терминале)
cd client
npm start
```

## Структура проекта

```
lingua-learn/
├── client/             # Фронтенд на React
├── server/             # Бэкенд на Node.js/Express
├── docs/               # Документация
└── README.md           # Этот файл
```

## Лицензия

MIT 