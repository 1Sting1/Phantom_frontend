# Phantom — Фронтенд приложения

## Описание проекта

**Phantom** — это современный мессенджер с форумом и системой аутентификации, разработанный в рамках курсового проекта. Фронтенд представляет собой SPA (Single Page Application) на базе Next.js 16 с использованием TypeScript и Tailwind CSS. Приложение взаимодействует с микросервисной архитектурой бэкенда через REST API.

Сайт доступен по адресу: **https://phantom-messenger.ru/**

---

## Технологический стек

| Технология | Версия | Назначение |
|---|---|---|
| **Next.js** | 16.0.3 | Фреймворк для React с SSR/SSG |
| **React** | 19 | Библиотека для построения UI |
| **TypeScript** | 5.x | Типизация JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS фреймворк |
| **Node.js** | 20 (Alpine) | Среда выполнения |
| **Docker** | — | Контейнеризация приложения |

---

## Структура проекта

```
frontend/
├── public/                    # Статические файлы (изображения .webp, .svg)
│   ├── ghost-3d.png           # Анимированный логотип (APNG, 73 кадра)
│   ├── cosmic-bg.webp         # Фоновое изображение
│   └── phantom-ghost.webp     # Логотип призрака
├── src/
│   ├── app/                   # Директория страниц (App Router Next.js)
│   │   ├── page.tsx           # Главная страница (Landing)
│   │   ├── layout.tsx         # Корневой layout приложения
│   │   ├── globals.css        # Глобальные стили
│   │   ├── login/page.tsx     # Страница входа
│   │   ├── register/page.tsx  # Страница регистрации
│   │   ├── profile/page.tsx   # Личный кабинет
│   │   ├── forum/
│   │   │   ├── page.tsx       # Список тредов форума
│   │   │   ├── new/page.tsx   # Создание нового треда
│   │   │   └── threads/[id]/page.tsx  # Страница треда с комментариями
│   │   ├── install/page.tsx   # Страница скачивания
│   │   ├── docs/page.tsx      # Документация
│   │   └── donate/page.tsx    # Страница поддержки
│   ├── components/            # Переиспользуемые React-компоненты
│   │   ├── Header.tsx         # Навигационная шапка
│   │   ├── Footer.tsx         # Подвал сайта
│   │   ├── Hero.tsx           # Главный блок Landing-страницы
│   │   ├── Features.tsx       # Блок с возможностями приложения
│   │   ├── Carousel.tsx       # Карусель с демонстрацией интерфейса
│   │   ├── ForumCTA.tsx       # CTA-блок перехода на форум
│   │   ├── DownloadCTA.tsx    # CTA-блок скачивания
│   │   └── GhostAvatar.tsx    # Компонент выбора аватара
│   ├── context/
│   │   └── LanguageContext.tsx  # Контекст language (i18n) + хук useLanguage
│   ├── hooks/
│   │   └── useOS.ts           # Хук определения операционной системы пользователя
│   └── translations/
│       ├── ru.ts              # Словарь локализации (Русский)
│       └── en.ts              # Словарь локализации (Английский)
├── next.config.ts             # Конфигурация Next.js (rewrites, proxy)
├── tailwind.config.ts         # Конфигурация Tailwind CSS
├── Dockerfile                 # Инструкции сборки Docker-образа
├── docker-compose.yml         # Конфигурация Docker Compose
└── package.json               # Зависимости проекта
```

---

## Ключевые возможности

### 1. Аутентификация
- Вход по **e-mail и паролю** через `POST /api/v1/auth/login`
- **Регистрация** с проверкой силы пароля в реальном времени (метрика: длина, цифры, заглавные буквы)
- **Проверка занятости никнейма** — debounced-запрос к `/api/v1/public/user/check-nickname` во время набора текста
- Хранение JWT-токена в состоянии React-контекста (`useAuth`)

### 2. Форум
- **Список тредов** с поиском по ключевым словам (клиентский фильтр через `useMemo`)
- **Сортировка** — по дате (новые/старые) и количеству ответов
- **Категории** — динамически загружаются из бэкенда и локализуются
- **Вложенные комментарии** (стиль Reddit/YouTube) — дерево ответов строится рекурсивно на основе поля `parent_post_id`
- **Создание треда** — форма с выбором категории, заголовком и содержимым
- **Удаление** тредов и комментариев — только для автора, с диалогом подтверждения и мгновенным обновлением UI (без перезагрузки страницы)

### 3. Перевод комментариев
- Кнопка «Перевести» под каждым комментарием
- При нажатии отправляется запрос на собственный прокси-сервер `POST /api/v1/localization/translate`, который проксирует запрос к публичному Google Translate API
- Повторное нажатие — показывает оригинальный текст («Оригинал»)
- Панель перевода при **написании** ответа — кнопки «→ EN 🇬🇧» и «→ RU 🇷🇺»

### 4. Профиль пользователя
- Просмотр и редактирование никнейма (inline-редактирование)
- Выбор аватара из 5 вариантов (компонент `GhostAvatar.tsx`)
- Проверка уникальности никнейма при сохранении (обработка `409 Conflict` от сервера)

### 5. Локализация (i18n)
- Два языка: **Русский** и **English**
- Переключение в подвале сайта через `LanguageContext`
- Все системные строки (сообщения об ошибках, кнопки браузерной валидации) переведены и не зависят от языка браузера

### 6. Определение ОС
- Хук `useOS.ts` определяет операционную систему пользователя по `navigator.userAgent`
- На странице `/install` автоматически показывается кнопка скачивания для нужной платформы
- Поддержка ручного переопределения через URL-параметр `?os=android`

---

## Оптимизации производительности

- **WebP-формат**: все растровые изображения (PNG, JPG) конвертированы в `.webp`, что уменьшает размер файлов в среднем на 65%
- **Исключение**: `ghost-3d.png` сохранён в формате APNG (Animated PNG, 73 кадра анимации)
- **GPU-ускорение**: CSS-свойства анимированных элементов переведены на `will-change: transform` для устранения прокрутки в 60fps
- **Убраны** тяжёлые CSS-свойства `mix-blend-multiply` и `mix-blend-screen` на крупных блоках

---

## Конфигурация Next.js (API Proxy)

Так как фронтенд и бэкенд расположены на разных доменах, в `next.config.ts` настроены **rewrites** (прокси-перенаправления), чтобы обойти ограничения браузера на кросс-доменные CORS-запросы:

```typescript
// next.config.ts
async rewrites() {
  return [
    {
      source: '/api/v1/:path*',
      destination: 'http://api-gateway:8080/api/v1/:path*',
    },
  ];
}
```

Все запросы с фронтенда вида `/api/v1/...` Next.js-сервер автоматически перенаправляет на внутренний API Gateway.

---

## Сборка и запуск

### Локально (через Docker)

```bash
# Клонировать репозиторий
git clone https://github.com/1Sting1/Phantom_frontend.git
cd Phantom_frontend

# Запустить контейнер
docker compose up -d --build
```

Приложение будет доступно на `http://localhost:3005`

### Разработка (dev-сервер)

```bash
npm install
npm run dev
```

Приложение будет доступно на `http://localhost:3000`

---

## Dockerfile

Сборка выполняется в два этапа (multi-stage build):

```dockerfile
# Этап 1: Сборка
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # Turbopack production build

# Этап 2: Запуск
FROM node:20-alpine AS runner
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
CMD ["node", "server.js"]
```

---

## Взаимодействие с бэкендом

Фронтенд взаимодействует со следующими микросервисами через API Gateway:

| Эндпоинт | Микросервис | Описание |
|---|---|---|
| `POST /api/v1/auth/login` | auth-service | Вход |
| `POST /api/v1/auth/register` | auth-service | Регистрация |
| `GET /api/v1/user/profile` | user-service | Профиль |
| `PUT /api/v1/user/profile` | user-service | Обновление профиля |
| `GET /api/v1/public/user/check-nickname` | user-service | Проверка никнейма |
| `GET /api/v1/forum/threads` | forum-service | Список тредов |
| `POST /api/v1/forum/threads` | forum-service | Создать тред |
| `DELETE /api/v1/forum/threads/:id` | forum-service | Удалить тред |
| `GET /api/v1/forum/threads/:id/posts` | forum-service | Комментарии треда |
| `POST /api/v1/forum/posts` | forum-service | Добавить комментарий |
| `DELETE /api/v1/forum/posts/:id` | forum-service | Удалить комментарий |
| `POST /api/v1/localization/translate` | localization-service | Перевод текста |

---

## Деплой на сервер

Проект задеплоен на VPS (Ubuntu 20.04, IP: 194.87.62.219) с использованием **Docker Compose** и реверс-прокси **Traefik** с автоматическим SSL-сертификатом Let's Encrypt.

Алгоритм обновления на сервере:
```bash
# 1. Получить изменения из репозитория
git pull origin main

# 2. Пересобрать и запустить контейнер
docker compose up -d --build
```

---

## Репозиторий

- **GitHub:** https://github.com/1Sting1/Phantom_frontend
- **Основная ветка:** `main`
- **Ветка разработки:** `front`
