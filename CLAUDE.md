# CLAUDE.md — Правила работы с проектом

Паспорт проекта: [project.md](project.md)
Исследование: [research.md](research.md)
Техническое задание: [brief.md](brief.md)
План разработки: [PLAN.md](PLAN.md)

---

## Текущее состояние проекта

> Обновлено: март 2026

**Подготовительный этап завершён.** Разработка не начата.

| Файл | Статус |
|---|---|
| `research.md` | Готов — исследование конкурентов и UX |
| `project.md` | Готов — паспорт проекта |
| `brief.md` | Готов — техническое задание |
| `PLAN.md` | Готов — план разработки |
| Код | Не начат |

**Git:** репозиторий `Andrey-don/tg-beaty-catalog` на GitHub, ветка `main`.

---

## Архитектура проекта

**Стек:**
- **Фронтенд:** React + TypeScript + Vite
- **Стили:** Tailwind CSS
- **TMA SDK:** `@telegram-apps/sdk`
- **Роутинг:** React Router (SPA, BackButton управляет стеком)
- **Бэкенд:** Node.js + Express
- **БД:** PostgreSQL
- **Бот:** Grammy или Telegraf
- **Деплой:** Vercel (фронт) + Railway (бэкенд + бот)

**Структура папок (планируемая):**
```
tg-beaty-catalog/
├── frontend/
│   ├── src/
│   │   ├── screens/        # Экраны: Catalog, ServiceDetail, Booking, etc.
│   │   ├── components/     # UI-компоненты: ServiceCard, SlotPicker, etc.
│   │   ├── hooks/          # useTelegram, useBooking, etc.
│   │   ├── api/            # Запросы к бэкенду
│   │   └── App.tsx
│   └── index.html
├── backend/
│   ├── src/
│   │   ├── routes/         # API эндпоинты
│   │   ├── models/         # БД-модели
│   │   └── bot/            # Telegram бот
│   └── index.ts
└── docs/                   # research.md, project.md, brief.md, PLAN.md
```

---

## Telegram Mini App — обязательные правила

### Инициализация (всегда)
```javascript
Telegram.WebApp.expand();   // Развернуть на весь экран
Telegram.WebApp.ready();    // После первого рендера
```

### MainButton
- Показывать только на экранах с основным действием
- Текст — контекстный: «Записаться — 2 000 ₽», «Подтвердить», «Закрыть»
- `MainButton.disable()` пока форма/выбор не заполнены
- `MainButton.showProgress()` во время API-запросов
- `MainButton.hide()` при уходе с экрана

### BackButton
- `BackButton.show()` на всех экранах кроме root (Каталог)
- `BackButton.hide()` на root-экране
- Всегда вешать обработчик `BackButton.onClick(() => navigateBack())`

### Цвета
- **Только** CSS-переменные `--tg-theme-*`
- Никаких хардкод-цветов (`#ffffff`, `#000000` и т.д.)
- Это обязательно для поддержки светлой и тёмной темы

### HapticFeedback
- `impactOccurred('light')` — тап по карточке, выбор слота
- `impactOccurred('medium')` — переход к следующему шагу
- `notificationOccurred('success')` — success-экран записи
- `notificationOccurred('error')` — ошибка

---

## Дизайн-система

Визуальный стиль: **тёплый минимализм / бьюти-эстетика**

- Карточки услуг: фото в полную ширину, скруглённые углы 16–20px
- Цена: всегда крупно, всегда видна на карточке
- Длительность: рядом с ценой, иконка ⏱
- Skeleton-загрузка для всех асинхронных данных
- Нижняя навигация: 3 вкладки (Услуги / Записи / Мастер)

---

## Правила работы AI

- **Перед созданием файлов** — объяснить, что и зачем
- **Перед установкой зависимостей** — предложить более лёгкую альтернативу если есть
- **Не менять структуру экранов** без явного запроса
- **Не добавлять функции v2** (оплата, отзывы, лояльность) в MVP без явного запроса
- Всегда использовать нативные TMA-компоненты (MainButton, BackButton) — не дублировать кастомными
- **Проверять тёмную тему** — не хардкодить цвета
- Коммиты с `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`
- **Git push:** сначала проверить `git credential-manager` — не просить пароль у пользователя
- При любых сомнениях — задавать вопросы, а не принимать решения самостоятельно
