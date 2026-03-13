# Установка

Установка зависмостей:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

Инициалиация Prisma ORM

```bash
npx prisma init
```

```bash
npx prisma generate
```

Создаем файл и заполняем .env на основе .env.example

- DB Models -> prisma/schema.prisma
- Prisma Confog -> prisma.config.ts

# Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

# Работа с Prettier

Форматировать все файлы

```bash
npx prettier . --write
```

Проверить форматирование всех файлов

```bash
npx prettier . --check
```

Установить расширение в VS Code
- Prettier - Code formatter

Заходим в настройки
- Ctrl+,
- Ищем "editor"
- Находим Default formatter 
- Выбираем Prettier - Code formatter

# Работа с Prisma

| Команда | Описание |
| :--- | :--- |
| `npx prisma generate` | Генерация Prisma Client |
| `npx prisma db pull` | Импорт схемы из существующей БД |
| `npx prisma db push` | Синхронизация схемы с БД (без миграций) |
| `npx prisma migrate dev` | Создание и применение миграции (dev) |
| `npx prisma migrate deploy` | Применение миграций (prod) |
| `npx prisma studio` | Запуск GUI для работы с БД |
| `npx prisma format` | Форматирование schema.prisma |
| `npx prisma validate` | Проверка валидности схемы |

