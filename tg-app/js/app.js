/**
 * app.js — Инициализация и глобальное состояние
 *
 * Запускается последним, после загрузки всех экранов.
 * Содержит: режим (client/master), данные записи,
 * навигацию по вкладкам, snackbar.
 */

const App = {

  /** Текущий режим: 'client' | 'master' */
  mode: 'client',

  /** Данные текущей записи клиента */
  booking: {
    service: null,
    date:    null,
    time:    null,
    user:    null,
    phone:   null,
  },

  /** Список записей клиента */
  bookings: [],

  // =============================================
  // ИНИЦИАЛИЗАЦИЯ
  // =============================================

  init() {
    TelegramAPI.init();

    this.booking.user = TelegramAPI.getUser();
    this.bookings = [...MOCK_BOOKINGS];

    // Определяем режим
    // В браузере: ?mode=master в URL
    // В Telegram: по user.id (здесь всегда client для демо)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'master') {
      this.mode = 'master';
    }

    // Кнопка переключения режимов — только в браузере (не в Telegram)
    // initData пустой когда открыто вне Telegram
    const isInsideTelegram = window.Telegram?.WebApp?.initData?.length > 0;
    if (!isInsideTelegram) {
      this._renderModeToggle();
    }

    // Рендерим нижнюю навигацию под текущий режим
    this._renderNav();

    // Показываем стартовый экран
    if (this.mode === 'master') {
      // Если онбординг ещё не пройден — показываем его
      if (!MASTER_ONBOARDING_DONE) {
        Router.stack = [{ name: 'onboarding', data: null }];
        Router._show('onboarding', null, false, 'push');
      } else {
        Router.stack = [{ name: 'dashboard', data: null }];
        Router._show('dashboard', null, false, 'push');
      }
    } else {
      Router.stack = [{ name: 'catalog', data: null }];
      Router._show('catalog', null, false, 'push');
    }

    console.log('[App] Запуск. Режим:', this.mode);
  },

  // =============================================
  // НАВИГАЦИЯ ПО ВКЛАДКАМ
  // =============================================

  goTab(tab) {
    TelegramAPI.hapticLight();
    this._setActiveTab(tab);

    const tabMap = {
      // Клиент
      catalog:  'catalog',
      bookings: 'records',
      master:   'master-profile-client',
      // Мастер
      dashboard: 'dashboard',
      schedule:  'master-schedule',
      services:  'master-services',
    };

    Router.goRoot(tabMap[tab]);
  },

  _setActiveTab(tab) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
  },

  // =============================================
  // НИЖНЯЯ НАВИГАЦИЯ
  // =============================================

  _renderNav() {
    const nav = document.getElementById('bottom-nav');

    if (this.mode === 'master') {
      nav.innerHTML = `
        <button class="nav-item active" data-tab="dashboard" onclick="App.goTab('dashboard')">
          <span class="nav-icon">📊</span>
          <span class="nav-label">Главная</span>
        </button>
        <button class="nav-item" data-tab="schedule" onclick="App.goTab('schedule')">
          <span class="nav-icon">📅</span>
          <span class="nav-label">Расписание</span>
        </button>
        <button class="nav-item" data-tab="services" onclick="App.goTab('services')">
          <span class="nav-icon">✂️</span>
          <span class="nav-label">Услуги</span>
        </button>
      `;
    } else {
      nav.innerHTML = `
        <button class="nav-item active" data-tab="catalog" onclick="App.goTab('catalog')">
          <span class="nav-icon">✂️</span>
          <span class="nav-label">Услуги</span>
        </button>
        <button class="nav-item" data-tab="bookings" onclick="App.goTab('bookings')">
          <span class="nav-icon">📅</span>
          <span class="nav-label">Записи</span>
        </button>
        <button class="nav-item" data-tab="master" onclick="App.goTab('master')">
          <span class="nav-icon">👤</span>
          <span class="nav-label">Мастер</span>
        </button>
      `;
    }
  },

  // =============================================
  // ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ (только браузер)
  // =============================================

  _renderModeToggle() {
    const toggle = document.createElement('div');
    toggle.id = 'mode-toggle';
    toggle.innerHTML = `
      <button class="${this.mode === 'client' ? 'active' : ''}" onclick="App.switchMode('client')">Клиент</button>
      <span>/</span>
      <button class="${this.mode === 'master' ? 'active' : ''}" onclick="App.switchMode('master')">Мастер</button>
    `;
    document.getElementById('app').appendChild(toggle);
  },

  switchMode(mode) {
    const url = window.location.pathname + (mode === 'master' ? '?mode=master' : '');
    window.location.href = url;
  },

  // =============================================
  // SNACKBAR
  // =============================================

  showSnackbar(message, actionLabel, actionFn) {
    document.querySelector('.snackbar')?.remove();

    const el = document.createElement('div');
    el.className = 'snackbar';
    el.innerHTML = `
      <span>${message}</span>
      ${actionLabel ? `<button class="snackbar-action">${actionLabel}</button>` : ''}
    `;

    if (actionLabel && actionFn) {
      el.querySelector('.snackbar-action').onclick = () => {
        el.remove();
        actionFn();
      };
    }

    document.getElementById('app').appendChild(el);
    setTimeout(() => el.remove(), 4000);
  },
};

// =============================================
// ЗАПУСК
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
