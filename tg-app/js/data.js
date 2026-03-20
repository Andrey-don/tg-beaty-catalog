/**
 * data.js — Данные приложения
 *
 * Здесь хранятся все данные: мастер, услуги, тестовые записи.
 * В реальном проекте эти данные будут приходить с сервера (API).
 *
 * КАК ИЗМЕНИТЬ ДАННЫЕ МАСТЕРА: отредактируй объект MASTER ниже.
 * КАК ДОБАВИТЬ УСЛУГУ: добавь объект в массив SERVICES.
 * КАК ИЗМЕНИТЬ КАТЕГОРИИ: отредактируй массив CATEGORIES.
 */

// =============================================
// ДАННЫЕ МАСТЕРА
// =============================================
const MASTER = {
  name: 'Анна Иванова',
  emoji: '💅',                              // Эмодзи-аватар
  specialty: 'Маникюр, педикюр · 5 лет',
  bio: 'Мастер маникюра и педикюра с 5-летним опытом. Специализируюсь на долговечном покрытии, уходовых процедурах и дизайне ногтей. Работаю только с профессиональными материалами.',
  experience: '5 лет',
  clients: '247',
  rating: '4.9',
  address: 'ул. Тверская, 15, оф 3',
  workingHours: 'Пн–Пт 10:00–19:00, Сб 11:00–17:00',
  phone: '+7 (999) 000-00-00',
  bookingsCount: '247',
  nextAvailable: 'завтра, 10:00',
};

// =============================================
// КАТЕГОРИИ УСЛУГ
// Порядок: первая всегда «Все»
// =============================================
const CATEGORIES = [
  { id: 'all',      label: 'Все' },
  { id: 'manicure', label: 'Маникюр' },
  { id: 'pedicure', label: 'Педикюр' },
  { id: 'design',   label: 'Дизайн' },
  { id: 'care',     label: 'Уход' },
];

// =============================================
// УСЛУГИ
// КАК ДОБАВИТЬ УСЛУГУ: скопируй один объект и измени поля.
// Поле priceFrom: true — показывает «от X ₽»
// =============================================
const SERVICES = [
  {
    id: 1,
    category: 'manicure',
    emoji: '💅',
    // Цвет заглушки фото (градиент)
    photoGradient: 'linear-gradient(135deg, #fce4ec, #f48fb1)',
    title: 'Маникюр с гель-лаком',
    shortDesc: 'Аппаратная обработка кутикулы + стойкое покрытие',
    fullDesc: 'Аппаратная обработка кутикулы, придание желаемой формы ногтям, нанесение базы и цветного гель-лака с финишным покрытием TopCoat. Держится до 3–4 недель. Выбор из 200+ оттенков.',
    duration: 90,   // минуты
    price: 2000,
    priceFrom: true,
  },
  {
    id: 2,
    category: 'manicure',
    emoji: '✨',
    photoGradient: 'linear-gradient(135deg, #f3e5f5, #ce93d8)',
    title: 'Маникюр классический',
    shortDesc: 'Обработка кутикулы, форма, покрытие обычным лаком',
    fullDesc: 'Обработка кутикулы, придание формы ногтям и полировка. Нанесение обычного лака по желанию. Идеально для тех, кто делает маникюр впервые или хочет минимальный уход.',
    duration: 60,
    price: 1200,
    priceFrom: false,
  },
  {
    id: 3,
    category: 'manicure',
    emoji: '💎',
    photoGradient: 'linear-gradient(135deg, #e8eaf6, #9fa8da)',
    title: 'Наращивание ногтей',
    shortDesc: 'Моделирование на формах, гель или акрил',
    fullDesc: 'Наращивание ногтей на мягких формах с использованием геля или акрила. Придание желаемой длины и формы. Возможно нанесение дизайна. Подходит для восстановления и удлинения.',
    duration: 120,
    price: 3500,
    priceFrom: true,
  },
  {
    id: 4,
    category: 'pedicure',
    emoji: '🦶',
    photoGradient: 'linear-gradient(135deg, #fbe9e7, #ff8a65)',
    title: 'Педикюр классический',
    shortDesc: 'Обработка стоп, форма ногтей, уход',
    fullDesc: 'Полный уход за ногтями стоп: обработка, придание формы, полировка. Удаление огрубевшей кожи на пятках. Увлажняющий крем в финале. Без покрытия лаком.',
    duration: 60,
    price: 2500,
    priceFrom: false,
  },
  {
    id: 5,
    category: 'pedicure',
    emoji: '👠',
    photoGradient: 'linear-gradient(135deg, #fce4ec, #ef9a9a)',
    title: 'Педикюр с покрытием',
    shortDesc: 'Классический педикюр + гель-лак',
    fullDesc: 'Все процедуры классического педикюра плюс стойкое покрытие гель-лаком. Держится до 4 недель. Выбор цвета из каталога. Идеально перед пляжным сезоном или праздниками.',
    duration: 90,
    price: 3000,
    priceFrom: false,
  },
  {
    id: 6,
    category: 'design',
    emoji: '🎨',
    photoGradient: 'linear-gradient(135deg, #e0f2f1, #80cbc4)',
    title: 'Дизайн ногтей',
    shortDesc: 'Рисунки, стемпинг, втирка, фольга',
    fullDesc: 'Авторский дизайн на любой вкус: ручные рисунки, геометрия, цветочные мотивы, стемпинг, фольга, втирка. Возможно как дополнение к маникюру, так и отдельная услуга.',
    duration: 30,
    price: 500,
    priceFrom: true,
  },
  {
    id: 7,
    category: 'care',
    emoji: '🌿',
    photoGradient: 'linear-gradient(135deg, #f1f8e9, #aed581)',
    title: 'SPA-уход за руками',
    shortDesc: 'Парафинотерапия + маска + массаж',
    fullDesc: 'Интенсивное питание и увлажнение кожи рук. Включает горячую парафинотерапию, питательную маску и расслабляющий массаж. Кожа становится мягкой и шелковистой. Рекомендуем 1 раз в месяц.',
    duration: 45,
    price: 1500,
    priceFrom: false,
  },
  {
    id: 8,
    category: 'care',
    emoji: '💆',
    photoGradient: 'linear-gradient(135deg, #e3f2fd, #90caf9)',
    title: 'Укрепление ногтей',
    shortDesc: 'Восстановление, укрепляющая база, биогель',
    fullDesc: 'Курс по восстановлению тонких, ломких и расслаивающихся ногтей. Нанесение укрепляющей базы или биогеля без цвета. Добавляет толщину и защищает от расслоения.',
    duration: 45,
    price: 800,
    priceFrom: false,
  },
];

// =============================================
// ГЕНЕРАЦИЯ ТЕСТОВЫХ ВРЕМЕННЫХ СЛОТОВ
// В реальном проекте будут приходить с сервера
// =============================================

/**
 * Возвращает массив слотов для заданной даты.
 * Некоторые слоты случайно помечаются как занятые.
 * @param {Date} date
 * @returns {Array<{time: string, busy: boolean}>}
 */
function generateSlots(date) {
  const dayOfWeek = date.getDay(); // 0 = воскресенье

  // В воскресенье не работаем
  if (dayOfWeek === 0) return [];

  // В субботу сокращённое расписание
  const startHour = 10;
  const endHour = dayOfWeek === 6 ? 17 : 19;

  const slots = [];
  const busyPattern = [false, false, true, false, true, false, false, true, false, false, true, false, false, false, false, false, true, false];

  let index = 0;
  for (let h = startHour; h < endHour; h++) {
    for (let m of [0, 30]) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      slots.push({
        time,
        // Используем детерминированный паттерн для стабильности демо
        busy: busyPattern[index % busyPattern.length],
      });
      index++;
    }
  }

  return slots;
}

/**
 * Возвращает массив дат для выбора (ближайшие 14 дней, пропуская воскресенья).
 * @returns {Array<Date>}
 */
function getAvailableDates() {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let current = new Date(today);
  let added = 0;

  while (added < 14) {
    // Пропускаем воскресенье
    if (current.getDay() !== 0) {
      dates.push(new Date(current));
      added++;
    }
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// =============================================
// РАСПИСАНИЕ МАСТЕРА
// =============================================
const MASTER_SCHEDULE = {
  1: { enabled: true,  start: '10:00', end: '19:00', label: 'Пн' },
  2: { enabled: true,  start: '10:00', end: '19:00', label: 'Вт' },
  3: { enabled: true,  start: '10:00', end: '19:00', label: 'Ср' },
  4: { enabled: true,  start: '10:00', end: '19:00', label: 'Чт' },
  5: { enabled: true,  start: '10:00', end: '19:00', label: 'Пт' },
  6: { enabled: true,  start: '11:00', end: '17:00', label: 'Сб' },
  0: { enabled: false, start: '10:00', end: '18:00', label: 'Вс' },
};

// =============================================
// ЗАПИСИ КЛИЕНТОВ (для экрана мастера)
// =============================================
const MASTER_BOOKINGS = [
  {
    id: 'mb1',
    clientName: 'Мария К.',
    serviceId: 1,
    serviceName: 'Маникюр с гель-лаком',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })(),
    time: '11:00',
    status: 'confirmed',
    price: 2000,
    phone: '+7 (999) 111-22-33',
  },
  {
    id: 'mb2',
    clientName: 'Елена В.',
    serviceId: 5,
    serviceName: 'Педикюр с покрытием',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; })(),
    time: '13:00',
    status: 'pending',
    price: 3000,
    phone: '+7 (988) 444-55-66',
  },
  {
    id: 'mb3',
    clientName: 'Ирина М.',
    serviceId: 7,
    serviceName: 'SPA-уход за руками',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 2); return d; })(),
    time: '15:30',
    status: 'confirmed',
    price: 1500,
    phone: '+7 (916) 777-88-99',
  },
  {
    id: 'mb4',
    clientName: 'Анастасия П.',
    serviceId: 3,
    serviceName: 'Наращивание ногтей',
    date: (() => { const d = new Date(); d.setDate(d.getDate() - 2); return d; })(),
    time: '12:00',
    status: 'confirmed',
    price: 3500,
    phone: '+7 (925) 100-20-30',
  },
  {
    id: 'mb5',
    clientName: 'Ольга Д.',
    serviceId: 2,
    serviceName: 'Маникюр классический',
    date: (() => { const d = new Date(); d.setDate(d.getDate() + 3); return d; })(),
    time: '10:00',
    status: 'pending',
    price: 1200,
    phone: '+7 (903) 222-33-44',
  },
];

// =============================================
// ПОРТФОЛИО МАСТЕРА (заглушки фото)
// =============================================
const MASTER_PORTFOLIO = [
  { id: 'p1', gradient: 'linear-gradient(135deg, #fce4ec, #f48fb1)', emoji: '💅', title: 'Нюдовый маникюр' },
  { id: 'p2', gradient: 'linear-gradient(135deg, #f3e5f5, #ce93d8)', emoji: '✨', title: 'Цветочный дизайн' },
  { id: 'p3', gradient: 'linear-gradient(135deg, #e8eaf6, #9fa8da)', emoji: '💎', title: 'Геометрия' },
  { id: 'p4', gradient: 'linear-gradient(135deg, #e0f2f1, #80cbc4)', emoji: '🎨', title: 'Акварель' },
  { id: 'p5', gradient: 'linear-gradient(135deg, #fbe9e7, #ff8a65)', emoji: '🌸', title: 'Розовый педикюр' },
  { id: 'p6', gradient: 'linear-gradient(135deg, #f1f8e9, #aed581)', emoji: '🌿', title: 'Минимализм' },
];

// Флаг онбординга мастера
let MASTER_ONBOARDING_DONE = false;

// =============================================
// ТЕСТОВЫЕ ЗАПИСИ (для экрана «Мои записи»)
// =============================================
const MOCK_BOOKINGS = [
  {
    id: 'b1',
    serviceId: 1,
    serviceName: 'Маникюр с гель-лаком',
    date: (() => {
      // Завтра
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d;
    })(),
    time: '14:00',
    status: 'confirmed',   // confirmed | pending | cancelled
    price: 2000,
  },
  {
    id: 'b2',
    serviceId: 4,
    serviceName: 'Педикюр классический',
    date: (() => {
      // Через 3 дня
      const d = new Date();
      d.setDate(d.getDate() + 3);
      return d;
    })(),
    time: '11:00',
    status: 'pending',
    price: 2500,
  },
  {
    id: 'b3',
    serviceId: 7,
    serviceName: 'SPA-уход за руками',
    date: (() => {
      // 5 дней назад
      const d = new Date();
      d.setDate(d.getDate() - 5);
      return d;
    })(),
    time: '16:30',
    status: 'confirmed',
    price: 1500,
  },
];

// =============================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ДЛЯ ДАТ
// =============================================

const DAY_NAMES_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const MONTH_NAMES_GEN = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

/** Форматирует дату как «Вт, 24 марта» */
function formatDate(date) {
  const day = DAY_NAMES_SHORT[date.getDay()];
  return `${day}, ${date.getDate()} ${MONTH_NAMES_GEN[date.getMonth()]}`;
}

/** Форматирует дату как «Вт, 24 марта 2026» */
function formatDateFull(date) {
  const day = DAY_NAMES_SHORT[date.getDay()];
  return `${day}, ${date.getDate()} ${MONTH_NAMES_GEN[date.getMonth()]} ${date.getFullYear()}`;
}

/** Форматирует цену как «2 000 ₽» */
function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ₽';
}

/** Форматирует длительность как «90 мин» */
function formatDuration(minutes) {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h} ч ${m} мин` : `${h} ч`;
  }
  return `${minutes} мин`;
}
