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
const TG = window.Telegram?.WebApp || null;

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
    if (!TG) return;

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
    if (!TG) return;
    TG.MainButton.hide();
  },

  /** Отключает MainButton (серая, не кликабельная) */
  disableMainButton() {
    if (!TG) return;
    TG.MainButton.disable();
  },

  /** Включает MainButton */
  enableMainButton() {
    if (!TG) return;
    TG.MainButton.enable();
  },

  /** Показывает индикатор загрузки на MainButton (во время запросов) */
  showMainButtonProgress() {
    if (!TG) return;
    TG.MainButton.showProgress(true); // true = оставить текст
    TG.MainButton.disable();
  },

  /** Скрывает индикатор загрузки на MainButton */
  hideMainButtonProgress() {
    if (!TG) return;
    TG.MainButton.hideProgress();
    TG.MainButton.enable();
  },

  // ===== BACK BUTTON =====

  /**
   * Показывает BackButton и вешает обработчик
   * @param {Function} onClick
   */
  showBackButton(onClick) {
    if (!TG) return;

    const btn = TG.BackButton;
    // Удаляем предыдущий обработчик
    btn.offClick(btn._currentHandler);
    btn._currentHandler = onClick;
    btn.onClick(onClick);
    btn.show();
  },

  /** Скрывает BackButton */
  hideBackButton() {
    if (!TG) return;
    const btn = TG.BackButton;
    btn.offClick(btn._currentHandler);
    btn._currentHandler = null;
    btn.hide();
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
