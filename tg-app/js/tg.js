/**
 * tg.js — Обёртка над Telegram WebApp API
 *
 * Упрощает работу с нативными компонентами Telegram:
 * MainButton, BackButton, HapticFeedback.
 *
 * Если приложение открыто в браузере (не в Telegram),
 * все методы работают как заглушки — ошибок нет.
 */

// Telegram WebApp объект
// SDK всегда создаёт window.Telegram.WebApp даже в браузере,
// поэтому проверяем initData — он пустой вне Telegram.
const _tgRaw = window.Telegram?.WebApp || null;
const TG = (_tgRaw?.initData?.length > 0) ? _tgRaw : null;

const TelegramAPI = {

  // ===== ИНИЦИАЛИЗАЦИЯ =====

  /** Вызывается один раз при старте приложения */
  init() {
    if (!TG) {
      console.log('[TG] Telegram WebApp не найден — режим браузера');
      return;
    }

    // Разворачиваем на весь экран (обязательно!)
    TG.expand();

    // Сообщаем Telegram что приложение готово
    TG.ready();

    // Применяем тему Telegram к CSS-переменным
    this.applyTheme();

    // Слушаем смену темы
    TG.onEvent('themeChanged', () => this.applyTheme());

    console.log('[TG] Инициализация завершена. Платформа:', TG.platform);
  },

  /** Применяет цвета темы Telegram к CSS-переменным */
  applyTheme() {
    if (!TG?.themeParams) return;

    const params = TG.themeParams;
    const root = document.documentElement;

    // Применяем только те переменные которые есть в теме
    if (params.bg_color)           root.style.setProperty('--tg-theme-bg-color', params.bg_color);
    if (params.text_color)         root.style.setProperty('--tg-theme-text-color', params.text_color);
    if (params.hint_color)         root.style.setProperty('--tg-theme-hint-color', params.hint_color);
    if (params.link_color)         root.style.setProperty('--tg-theme-link-color', params.link_color);
    if (params.button_color)       root.style.setProperty('--tg-theme-button-color', params.button_color);
    if (params.button_text_color)  root.style.setProperty('--tg-theme-button-text-color', params.button_text_color);
    if (params.secondary_bg_color) root.style.setProperty('--tg-theme-secondary-bg-color', params.secondary_bg_color);
  },

  // ===== ДАННЫЕ ПОЛЬЗОВАТЕЛЯ =====

  /** Возвращает данные пользователя Telegram или тестовые данные */
  getUser() {
    const user = TG?.initDataUnsafe?.user;
    if (user) return user;

    // Тестовые данные для разработки в браузере
    return {
      id: 12345678,
      first_name: 'Андрей',
      last_name: 'Смирнов',
      username: 'test_user',
    };
  },

  // ===== MAIN BUTTON =====

  /**
   * Настраивает и показывает MainButton
   * @param {string} text — текст кнопки
   * @param {Function} onClick — обработчик нажатия
   */
  showMainButton(text, onClick) {
    if (!TG) {
      this._showBrowserMainButton(text, onClick);
      return;
    }

    const btn = TG.MainButton;
    btn.setText(text);
    btn.enable();
    btn.hideProgress();

    // Удаляем предыдущие обработчики и вешаем новый
    btn.offClick(btn._currentHandler);
    btn._currentHandler = onClick;
    btn.onClick(onClick);

    btn.show();
  },

  /** Скрывает MainButton */
  hideMainButton() {
    if (!TG) {
      this._hideBrowserMainButton();
      return;
    }
    TG.MainButton.hide();
  },

  /** Отключает MainButton (серая, не кликабельная) */
  disableMainButton() {
    if (!TG) {
      const btn = document.getElementById('browser-main-button');
      if (btn) { btn.disabled = true; btn.style.opacity = '0.5'; }
      return;
    }
    TG.MainButton.disable();
  },

  /** Включает MainButton */
  enableMainButton() {
    if (!TG) {
      const btn = document.getElementById('browser-main-button');
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
      return;
    }
    TG.MainButton.enable();
  },

  /** Показывает индикатор загрузки на MainButton (во время запросов) */
  showMainButtonProgress() {
    if (!TG) {
      const btn = document.getElementById('browser-main-button');
      if (btn) { btn.disabled = true; btn.style.opacity = '0.7'; btn.textContent = '...'; }
      return;
    }
    TG.MainButton.showProgress(true); // true = оставить текст
    TG.MainButton.disable();
  },

  /** Скрывает индикатор загрузки на MainButton */
  hideMainButtonProgress() {
    if (!TG) {
      const btn = document.getElementById('browser-main-button');
      if (btn) { btn.disabled = false; btn.style.opacity = '1'; }
      return;
    }
    TG.MainButton.hideProgress();
    TG.MainButton.enable();
  },

  // ===== BACK BUTTON =====

  /**
   * Показывает BackButton и вешает обработчик
   * @param {Function} onClick
   */
  showBackButton(onClick) {
    if (TG) {
      // Внутри Telegram — нативная кнопка в шапке
      const btn = TG.BackButton;
      btn.offClick(btn._currentHandler);
      btn._currentHandler = onClick;
      btn.onClick(onClick);
      btn.show();
    } else {
      // В браузере — показываем HTML-кнопку для тестирования
      this._showBrowserBackButton(onClick);
    }
  },

  /** Скрывает BackButton */
  hideBackButton() {
    if (TG) {
      const btn = TG.BackButton;
      btn.offClick(btn._currentHandler);
      btn._currentHandler = null;
      btn.hide();
    } else {
      this._hideBrowserBackButton();
    }
  },

  /** Показывает кнопку «Назад» в браузере (только для тестирования) */
  _showBrowserBackButton(onClick) {
    let bar = document.getElementById('browser-back-bar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'browser-back-bar';
      bar.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0;
        max-width: 430px; margin: 0 auto;
        background: var(--tg-theme-bg-color);
        border-bottom: 1px solid var(--tg-theme-secondary-bg-color);
        padding: 10px 16px;
        z-index: 200;
        display: flex;
        align-items: center;
      `;
      document.getElementById('app').appendChild(bar);
    }
    bar.innerHTML = `
      <button onclick="" style="
        background: none; border: none; cursor: pointer;
        font-size: 15px; color: var(--tg-theme-link-color);
        display: flex; align-items: center; gap: 4px;
        padding: 4px 0; min-height: 44px;
      ">← Назад</button>
    `;
    bar.querySelector('button').onclick = onClick;
    bar.style.display = 'flex';

    // Добавляем отступ сверху чтобы контент не перекрывался
    document.getElementById('screen-container').style.paddingTop = '44px';
  },

  /** Скрывает браузерную кнопку «Назад» */
  _hideBrowserBackButton() {
    const bar = document.getElementById('browser-back-bar');
    if (bar) bar.style.display = 'none';
    document.getElementById('screen-container').style.paddingTop = '0';
  },

  /** Показывает кнопку MainButton в браузере (только для тестирования) */
  _showBrowserMainButton(text, onClick) {
    let btn = document.getElementById('browser-main-button');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'browser-main-button';
      btn.style.cssText = `
        position: fixed; bottom: 60px; left: 0; right: 0;
        max-width: 430px; margin: 0 auto;
        background: var(--tg-theme-button-color);
        color: var(--tg-theme-button-text-color);
        border: none; cursor: pointer;
        font-size: 15px; font-weight: 600;
        padding: 0 16px;
        height: 50px;
        z-index: 100;
        width: 100%;
      `;
      document.getElementById('app').appendChild(btn);
    }
    btn.textContent = text;
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.display = 'block';
    btn.onclick = onClick;
  },

  /** Скрывает браузерную MainButton */
  _hideBrowserMainButton() {
    const btn = document.getElementById('browser-main-button');
    if (btn) btn.style.display = 'none';
  },

  // ===== HAPTIC FEEDBACK =====

  /** Лёгкий импакт — тап по карточке, выбор слота */
  hapticLight() {
    TG?.HapticFeedback?.impactOccurred('light');
  },

  /** Средний импакт — переход к следующему шагу */
  hapticMedium() {
    TG?.HapticFeedback?.impactOccurred('medium');
  },

  /** Уведомление об успехе — экран подтверждения */
  hapticSuccess() {
    TG?.HapticFeedback?.notificationOccurred('success');
  },

  /** Уведомление об ошибке */
  hapticError() {
    TG?.HapticFeedback?.notificationOccurred('error');
  },

  // ===== ДИАЛОГИ =====

  /**
   * Нативный алерт Telegram (вместо window.alert)
   * @param {string} message
   * @param {Function} [callback]
   */
  showAlert(message, callback) {
    if (TG) {
      TG.showAlert(message, callback);
    } else {
      alert(message);
      if (callback) callback();
    }
  },

  /**
   * Нативный диалог подтверждения (вместо window.confirm)
   * @param {string} message
   * @param {Function} callback — получает true/false
   */
  showConfirm(message, callback) {
    if (TG) {
      TG.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  },

  // ===== ЗАПРОС КОНТАКТА =====

  /**
   * Запрашивает телефон пользователя через нативный диалог Telegram
   * @param {Function} onSuccess — получает объект контакта
   */
  requestContact(onSuccess) {
    if (!TG) {
      // В браузере симулируем
      onSuccess({ phone_number: '+7 (999) 000-00-00' });
      return;
    }

    TG.requestContact((status, contact) => {
      if (status && contact) {
        onSuccess(contact);
      }
    });
  },

  // ===== ЗАКРЫТИЕ =====

  /** Закрывает Mini App (возвращает в чат с ботом) */
  close() {
    if (TG) {
      TG.close();
    }
  },
};
