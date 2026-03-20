/**
 * app.js — Основная логика приложения
 *
 * Содержит:
 * - Роутер (стек экранов, навигация)
 * - Рендер всех 6 экранов
 * - Обработчики событий
 *
 * ЭКРАНЫ:
 *   catalog   — Каталог услуг (главный)
 *   service   — Детали услуги
 *   datetime  — Выбор даты и времени
 *   summary   — Итог записи
 *   success   — Запись подтверждена
 *   bookings  — Мои записи
 *   master    — Профиль мастера
 */

const App = {

  // =============================================
  // СОСТОЯНИЕ ПРИЛОЖЕНИЯ
  // =============================================

  /** Стек экранов для навигации назад */
  stack: [],

  /** Текущая активная вкладка нижней навигации */
  currentTab: 'catalog',

  /** Данные текущей записи (собираются в процессе флоу) */
  booking: {
    service: null,   // объект услуги
    date: null,      // объект Date
    time: null,      // строка 'HH:MM'
    user: null,      // данные пользователя из Telegram
    phone: null,     // телефон (если дал)
  },

  /** Тестовые записи (копия для возможности отмены) */
  bookings: [...MOCK_BOOKINGS],

  // =============================================
  // ИНИЦИАЛИЗАЦИЯ
  // =============================================

  init() {
    // Инициализируем Telegram API
    TelegramAPI.init();

    // Сохраняем данные пользователя
    this.booking.user = TelegramAPI.getUser();

    // Показываем начальный экран
    this.showScreen('catalog', null, false);

    console.log('[App] Инициализация завершена');
  },

  // =============================================
  // РОУТЕР — НАВИГАЦИЯ
  // =============================================

  /**
   * Переходит на новый экран (push в стек)
   * @param {string} screenName
   * @param {*} data — данные для экрана
   * @param {boolean} [withAnim=true] — показывать анимацию
   */
  push(screenName, data, withAnim = true) {
    this.stack.push({ name: screenName, data });
    this.showScreen(screenName, data, withAnim, 'push');
  },

  /**
   * Возвращается на предыдущий экран (pop из стека)
   */
  pop() {
    if (this.stack.length <= 1) return;
    this.stack.pop();
    const prev = this.stack[this.stack.length - 1];
    this.showScreen(prev.name, prev.data, true, 'pop');
  },

  /**
   * Заменяет текущий экран (без добавления в стек)
   */
  replace(screenName, data) {
    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1] = { name: screenName, data };
    } else {
      this.stack.push({ name: screenName, data });
    }
    this.showScreen(screenName, data, true, 'push');
  },

  /**
   * Сбрасывает стек и переходит на корневой экран
   */
  goRoot(screenName = 'catalog', data = null) {
    this.stack = [{ name: screenName, data }];
    this.showScreen(screenName, data, true, 'pop');
    this.setActiveTab(screenName === 'bookings' ? 'bookings' : 'catalog');
  },

  /**
   * Переключение вкладки нижней навигации
   */
  goTab(tab) {
    if (this.currentTab === tab) return;
    TelegramAPI.hapticLight();
    this.currentTab = tab;
    this.setActiveTab(tab);

    const tabScreens = {
      catalog: 'catalog',
      bookings: 'bookings',
      master: 'master',
    };

    this.goRoot(tabScreens[tab]);
  },

  /** Обновляет активную вкладку в нижней навигации */
  setActiveTab(tab) {
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === tab);
    });
  },

  // =============================================
  // РЕНДЕР ЭКРАНОВ
  // =============================================

  /**
   * Рендерит экран в DOM
   * @param {string} name — имя экрана
   * @param {*} data — данные
   * @param {boolean} animate
   * @param {'push'|'pop'} direction
   */
  showScreen(name, data, animate = true, direction = 'push') {
    const container = document.getElementById('screen-container');

    // Генерируем HTML экрана
    const html = this.screens[name]?.render(data) || '<div class="screen"><p>Экран не найден</p></div>';

    // Вставляем в DOM
    container.innerHTML = html;

    // Применяем анимацию
    const screen = container.querySelector('.screen');
    if (screen && animate) {
      screen.classList.add(direction === 'pop' ? 'screen-enter-back' : 'screen-enter');
    }

    // Инициализируем экран (кнопки, события)
    this.screens[name]?.init?.(data);

    // Настраиваем BackButton
    const isRoot = this.stack.length <= 1 || name === 'success';
    if (isRoot) {
      TelegramAPI.hideBackButton();
    } else {
      TelegramAPI.showBackButton(() => {
        TelegramAPI.hapticLight();
        this.pop();
      });
    }
  },

  // =============================================
  // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
  // =============================================

  /** Показывает snackbar (уведомление снизу) */
  showSnackbar(message, actionLabel, actionFn) {
    // Удаляем предыдущий снекбар
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

    // Автоматически убираем через 4 секунды
    setTimeout(() => el.remove(), 4000);
  },

  // =============================================
  // ЭКРАНЫ
  // =============================================

  screens: {

    // ------------------------------------------
    // ЭКРАН 1: КАТАЛОГ УСЛУГ
    // ------------------------------------------
    catalog: {
      activeCategory: 'all',

      render() {
        const filtered = this.activeCategory === 'all'
          ? SERVICES
          : SERVICES.filter(s => s.category === this.activeCategory);

        const categoriesHTML = CATEGORIES.map(cat => `
          <button class="category-chip ${cat.id === this.activeCategory ? 'active' : ''}"
                  onclick="App.screens.catalog.filterBy('${cat.id}')">
            ${cat.label}
          </button>
        `).join('');

        const servicesHTML = filtered.map(s => `
          <div class="service-card" onclick="App.screens.catalog.openService(${s.id})">
            <div class="service-card-photo" style="background: ${s.photoGradient}">
              ${s.emoji}
            </div>
            <div class="service-card-body">
              <div class="service-card-title">${s.title}</div>
              <div class="service-card-meta">
                <span>⏱ ${formatDuration(s.duration)}</span>
              </div>
              <div class="service-card-footer">
                <div class="service-price ${s.priceFrom ? 'from' : ''}">${formatPrice(s.price)}</div>
                <button class="btn-select" onclick="event.stopPropagation(); App.screens.catalog.openService(${s.id})">
                  Выбрать →
                </button>
              </div>
            </div>
          </div>
        `).join('');

        return `
          <div class="screen pb-main-btn">
            <!-- Шапка мастера -->
            <div class="master-header">
              <div class="master-avatar">${MASTER.emoji}</div>
              <div>
                <div class="master-name">${MASTER.name}</div>
                <div class="master-spec">${MASTER.specialty}</div>
              </div>
            </div>

            <!-- Категории -->
            <div class="categories-scroll">
              <div class="categories-inner">
                ${categoriesHTML}
              </div>
            </div>

            <!-- Карточки услуг -->
            <div class="services-list">
              ${servicesHTML.length ? servicesHTML : `
                <div class="empty-state">
                  <div class="empty-icon">💅</div>
                  <div class="empty-title">Скоро появятся услуги</div>
                  <div class="empty-text">В этой категории пока нет услуг</div>
                </div>
              `}
            </div>
          </div>
        `;
      },

      init() {
        // На главном экране нет MainButton и BackButton
        TelegramAPI.hideMainButton();
        TelegramAPI.hideBackButton();
      },

      /** Фильтрует карточки по категории */
      filterBy(categoryId) {
        TelegramAPI.hapticLight();
        this.activeCategory = categoryId;
        // Перерисовываем только список (без анимации)
        const container = document.getElementById('screen-container');
        container.innerHTML = this.render();
        this.init();
      },

      /** Переходит на экран деталей услуги */
      openService(serviceId) {
        TelegramAPI.hapticLight();
        const service = SERVICES.find(s => s.id === serviceId);
        if (!service) return;

        // Сбрасываем данные записи
        App.booking.service = service;
        App.booking.date = null;
        App.booking.time = null;

        App.push('service', service);
      },
    },

    // ------------------------------------------
    // ЭКРАН 2: ДЕТАЛИ УСЛУГИ
    // ------------------------------------------
    service: {
      render(service) {
        if (!service) return '<div class="screen"></div>';

        return `
          <div class="screen pb-main-btn">
            <!-- Фото услуги (заглушка) -->
            <div class="service-detail-photo" style="background: ${service.photoGradient}">
              <span style="font-size:80px">${service.emoji}</span>
              <!-- Точки галереи (декоративные для MVP) -->
              <div class="gallery-dots">
                <div class="gallery-dot active"></div>
                <div class="gallery-dot"></div>
                <div class="gallery-dot"></div>
              </div>
            </div>

            <div class="service-detail-body">
              <!-- Название -->
              <div class="service-detail-title">${service.title}</div>

              <!-- Бейджи: длительность и цена -->
              <div class="badges-row">
                <div class="badge">⏱ ${formatDuration(service.duration)}</div>
                <div class="badge price">${service.priceFrom ? 'от ' : ''}${formatPrice(service.price)}</div>
              </div>

              <!-- Описание -->
              <div class="service-detail-desc" id="service-desc">
                ${service.shortDesc}
              </div>
              <button class="read-more-btn" id="read-more-btn" onclick="App.screens.service.toggleDesc()">
                Читать полностью ↓
              </button>

              <div class="divider" style="margin: 16px 0"></div>

              <!-- Блок мастера -->
              <div class="master-block">
                <div class="master-block-avatar">${MASTER.emoji}</div>
                <div>
                  <div class="master-block-name">${MASTER.name}</div>
                  <div class="master-block-rating">★ ${MASTER.rating} · ${MASTER.experience} опыта</div>
                </div>
              </div>
            </div>
          </div>
        `;
      },

      init(service) {
        // MainButton — основное действие экрана
        TelegramAPI.showMainButton(
          `Записаться — ${formatPrice(service.price)}`,
          () => {
            TelegramAPI.hapticMedium();
            App.push('datetime', service);
          }
        );
      },

      /** Разворачивает полное описание */
      toggleDesc() {
        const desc = document.getElementById('service-desc');
        const btn = document.getElementById('read-more-btn');
        const service = App.booking.service;
        if (!service) return;

        if (btn.textContent.includes('↓')) {
          desc.textContent = service.fullDesc;
          btn.textContent = 'Свернуть ↑';
        } else {
          desc.textContent = service.shortDesc;
          btn.textContent = 'Читать полностью ↓';
        }
      },
    },

    // ------------------------------------------
    // ЭКРАН 3: ВЫБОР ДАТЫ И ВРЕМЕНИ
    // ------------------------------------------
    datetime: {
      dates: [],
      selectedDateIndex: 0,
      selectedTime: null,

      render() {
        this.dates = getAvailableDates();
        this.selectedTime = null;

        const datesHTML = this.dates.map((date, index) => {
          const slots = generateSlots(date);
          const hasSlots = slots.some(s => !s.busy);

          return `
            <button class="date-chip ${index === 0 ? 'active' : ''}"
                    onclick="App.screens.datetime.selectDate(${index})">
              <span class="date-day-name">${DAY_NAMES_SHORT[date.getDay()]}</span>
              <span class="date-day-num">${date.getDate()}</span>
              ${hasSlots ? '<span class="date-has-slots">●</span>' : ''}
            </button>
          `;
        }).join('');

        const slotsHTML = this._renderSlots(0);

        return `
          <div class="screen pb-main-btn">
            <div class="step-indicator">Шаг 1 из 2</div>

            <!-- Горизонтальный скролл дат -->
            <div class="dates-scroll">
              <div class="dates-inner" id="dates-inner">
                ${datesHTML}
              </div>
            </div>

            <div class="section-title">Доступное время</div>

            <!-- Сетка слотов -->
            <div class="time-slots-grid" id="slots-grid">
              ${slotsHTML}
            </div>

            <!-- Сводка выбора -->
            <div class="booking-summary-bar" id="booking-summary-bar">
              <strong>${App.booking.service?.title || ''}</strong>
              <span id="selected-datetime-text">Выберите дату и время</span>
            </div>
          </div>
        `;
      },

      init() {
        // MainButton отключена до выбора слота
        TelegramAPI.showMainButton('Продолжить', () => {
          TelegramAPI.hapticMedium();
          App.push('summary', null);
        });
        TelegramAPI.disableMainButton();
      },

      /** Рендерит слоты для выбранного дня */
      _renderSlots(dateIndex) {
        const slots = generateSlots(this.dates[dateIndex]);

        if (!slots.length) {
          return '<div class="text-hint text-center" style="padding:20px;grid-column:span 3">Выходной день</div>';
        }

        return slots.map(slot => `
          <button class="time-slot ${slot.busy ? 'busy' : ''} ${this.selectedTime === slot.time ? 'selected' : ''}"
                  ${slot.busy ? 'disabled' : `onclick="App.screens.datetime.selectTime('${slot.time}')"`}>
            ${slot.time}
          </button>
        `).join('');
      },

      /** Выбор даты */
      selectDate(index) {
        TelegramAPI.hapticLight();
        this.selectedDateIndex = index;
        this.selectedTime = null;

        // Обновляем активную дату
        document.querySelectorAll('.date-chip').forEach((el, i) => {
          el.classList.toggle('active', i === index);
        });

        // Обновляем слоты
        document.getElementById('slots-grid').innerHTML = this._renderSlots(index);

        // Сбрасываем сводку
        document.getElementById('selected-datetime-text').textContent = 'Выберите время';

        // Отключаем MainButton
        TelegramAPI.disableMainButton();

        // Сохраняем дату в данные записи
        App.booking.date = this.dates[index];
        App.booking.time = null;
      },

      /** Выбор времени */
      selectTime(time) {
        TelegramAPI.hapticLight();
        this.selectedTime = time;

        // Обновляем выделение слота
        document.querySelectorAll('.time-slot').forEach(el => {
          el.classList.toggle('selected', el.textContent.trim() === time);
        });

        // Обновляем сводку
        const date = this.dates[this.selectedDateIndex];
        App.booking.date = date;
        App.booking.time = time;
        document.getElementById('selected-datetime-text').textContent = `${formatDate(date)} · ${time}`;

        // Активируем MainButton
        TelegramAPI.enableMainButton();
      },
    },

    // ------------------------------------------
    // ЭКРАН 4: ИТОГ ЗАПИСИ
    // ------------------------------------------
    summary: {
      render() {
        const { service, date, time, user, phone } = App.booking;
        if (!service || !date || !time) return '<div class="screen"></div>';

        const phoneRow = phone
          ? `<div class="client-row">
               <span class="client-row-label">Телефон</span>
               <span>${phone}</span>
             </div>`
          : '';

        return `
          <div class="screen pb-main-btn">
            <div class="summary-screen">
              <div class="summary-title">Ваша запись</div>

              <!-- Карточка сводки -->
              <div class="summary-card">
                <div class="summary-card-photo" style="background: ${service.photoGradient}">
                  ${service.emoji}
                </div>
                <div class="summary-card-body">
                  <div class="summary-service-name">${service.title}</div>
                  <div class="summary-row">
                    <span class="summary-row-icon">📅</span>
                    <span>${formatDateFull(date)}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-row-icon">🕑</span>
                    <span>${time}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-row-icon">📍</span>
                    <span>${MASTER.address}</span>
                  </div>
                  <div class="summary-row">
                    <span class="summary-row-icon">💳</span>
                    <span>${formatPrice(service.price)}</span>
                  </div>
                </div>
              </div>

              <!-- Данные клиента -->
              <div class="client-section">
                <div class="client-label">Ваши данные</div>
                <div class="client-row">
                  <span class="client-row-label">Имя</span>
                  <span>${user?.first_name || 'Не указано'}</span>
                </div>
                ${phoneRow}
                ${!phone ? `
                  <button class="btn-add-phone" onclick="App.screens.summary.addPhone()">
                    + Добавить телефон
                  </button>
                ` : ''}
              </div>

            </div>
          </div>
        `;
      },

      init() {
        TelegramAPI.showMainButton('Подтвердить запись', () => {
          this.confirm();
        });
      },

      /** Запрашивает телефон нативным диалогом Telegram */
      addPhone() {
        TelegramAPI.hapticLight();
        TelegramAPI.requestContact((contact) => {
          App.booking.phone = contact.phone_number;
          // Перерисовываем экран с обновлёнными данными
          App.replace('summary', null);
        });
      },

      /** Подтверждает запись */
      confirm() {
        TelegramAPI.hapticMedium();
        TelegramAPI.showMainButtonProgress();

        // Имитируем API-запрос (500ms задержка)
        setTimeout(() => {
          TelegramAPI.hideMainButtonProgress();

          // Добавляем запись в список
          const { service, date, time } = App.booking;
          App.bookings.unshift({
            id: 'b' + Date.now(),
            serviceId: service.id,
            serviceName: service.title,
            date: new Date(date),
            time,
            status: 'confirmed',
            price: service.price,
          });

          // Переходим на экран успеха
          App.push('success', null);
        }, 600);
      },
    },

    // ------------------------------------------
    // ЭКРАН 5: ЗАПИСЬ ПОДТВЕРЖДЕНА
    // ------------------------------------------
    success: {
      render() {
        const { service, date, time } = App.booking;

        return `
          <div class="screen">
            <div class="success-screen">
              <!-- Анимированный чекмарк -->
              <div class="success-checkmark">✅</div>

              <div class="success-title">Запись подтверждена!</div>
              <div class="success-subtitle">Ждём вас, ${App.booking.user?.first_name || 'дорогой клиент'} 🌸</div>

              <!-- Карточка с деталями -->
              <div class="success-card">
                <div class="summary-row">
                  <span class="summary-row-icon">💅</span>
                  <span style="font-weight:600">${service?.title || ''}</span>
                </div>
                <div style="height:8px"></div>
                <div class="summary-row">
                  <span class="summary-row-icon">📅</span>
                  <span>${date ? formatDateFull(date) : ''} · ${time || ''}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row-icon">📍</span>
                  <span>${MASTER.address}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-row-icon">💳</span>
                  <span style="font-weight:700">${service ? formatPrice(service.price) : ''}</span>
                </div>
              </div>

              <!-- Добавить в календарь -->
              <button class="btn-calendar" onclick="App.screens.success.addToCalendar()">
                📆 Добавить в календарь
              </button>

              <!-- Напоминание -->
              <div class="reminder-text">🔔 Напомним за 24 часа в этом чате</div>
            </div>
          </div>
        `;
      },

      init() {
        // Тактильный успех
        setTimeout(() => TelegramAPI.hapticSuccess(), 300);

        // MainButton — вернуться в каталог
        TelegramAPI.showMainButton('Вернуться в каталог', () => {
          TelegramAPI.hapticLight();
          // Сбрасываем данные записи
          App.booking.service = null;
          App.booking.date = null;
          App.booking.time = null;
          App.booking.phone = null;
          // Возвращаем на главную
          App.goRoot('catalog');
        });
      },

      addToCalendar() {
        TelegramAPI.hapticLight();
        const { service, date, time } = App.booking;
        if (!service || !date || !time) return;

        // Формируем дату для Calendar URL
        const [h, m] = time.split(':');
        const start = new Date(date);
        start.setHours(parseInt(h), parseInt(m), 0);
        const end = new Date(start.getTime() + service.duration * 60000);

        const pad = n => String(n).padStart(2, '0');
        const fmt = d => `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE`
          + `&text=${encodeURIComponent(service.title + ' — ' + MASTER.name)}`
          + `&dates=${fmt(start)}/${fmt(end)}`
          + `&location=${encodeURIComponent(MASTER.address)}`;

        window.open(url, '_blank');
      },
    },

    // ------------------------------------------
    // ЭКРАН 6: МОИ ЗАПИСИ
    // ------------------------------------------
    bookings: {
      activeTab: 'upcoming',

      render() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Разделяем на предстоящие и прошлые
        const upcoming = App.bookings.filter(b => {
          const d = new Date(b.date);
          d.setHours(0, 0, 0, 0);
          return d >= now && b.status !== 'cancelled';
        });

        const past = App.bookings.filter(b => {
          const d = new Date(b.date);
          d.setHours(0, 0, 0, 0);
          return d < now || b.status === 'cancelled';
        });

        const list = this.activeTab === 'upcoming' ? upcoming : past;

        const bookingsHTML = list.length
          ? list.map(b => this._renderCard(b)).join('')
          : `
            <div class="empty-state">
              <div class="empty-icon">${this.activeTab === 'upcoming' ? '📅' : '📋'}</div>
              <div class="empty-title">${this.activeTab === 'upcoming' ? 'Нет предстоящих записей' : 'История пуста'}</div>
              <div class="empty-text">${this.activeTab === 'upcoming' ? 'Запишитесь на первую процедуру' : 'Здесь будут ваши прошлые визиты'}</div>
              ${this.activeTab === 'upcoming' ? `<button class="btn-primary" onclick="App.goRoot('catalog')">Выбрать услугу</button>` : ''}
            </div>
          `;

        return `
          <div class="screen">
            <div class="bookings-screen">
              <div class="bookings-title">Мои записи</div>

              <!-- Вкладки -->
              <div class="tabs-row">
                <button class="tab-btn ${this.activeTab === 'upcoming' ? 'active' : ''}"
                        onclick="App.screens.bookings.switchTab('upcoming')">
                  Предстоящие
                </button>
                <button class="tab-btn ${this.activeTab === 'past' ? 'active' : ''}"
                        onclick="App.screens.bookings.switchTab('past')">
                  Прошлые
                </button>
              </div>

              <!-- Список записей -->
              <div id="bookings-list">
                ${bookingsHTML}
              </div>
            </div>
          </div>
        `;
      },

      init() {
        TelegramAPI.hideMainButton();
      },

      /** Рендер карточки записи */
      _renderCard(booking) {
        const statusLabels = {
          confirmed: 'Подтверждено',
          pending: 'Ожидает',
          cancelled: 'Отменено',
        };

        const isUpcoming = this.activeTab === 'upcoming';

        return `
          <div class="booking-card">
            <div class="booking-card-header">
              <div class="booking-service-name">${booking.serviceName}</div>
              <div class="status-badge ${booking.status}">${statusLabels[booking.status]}</div>
            </div>
            <div class="booking-card-date">
              📅 ${formatDateFull(new Date(booking.date))} · ${booking.time}
              &nbsp;&nbsp;💳 ${formatPrice(booking.price)}
            </div>
            ${isUpcoming ? `
              <div class="booking-actions">
                <button class="btn-cancel-booking" onclick="App.screens.bookings.cancelBooking('${booking.id}')">
                  Отменить
                </button>
                <button class="btn-rebook" onclick="App.screens.bookings.rebook(${booking.serviceId})">
                  Записаться снова
                </button>
              </div>
            ` : `
              <div class="booking-actions">
                <button class="btn-rebook" onclick="App.screens.bookings.rebook(${booking.serviceId})">
                  Записаться снова
                </button>
              </div>
            `}
          </div>
        `;
      },

      /** Переключение вкладок */
      switchTab(tab) {
        TelegramAPI.hapticLight();
        this.activeTab = tab;
        // Перерисовываем экран
        const container = document.getElementById('screen-container');
        container.innerHTML = this.render();
        this.init();
      },

      /** Отмена записи */
      cancelBooking(bookingId) {
        TelegramAPI.showConfirm('Отменить запись?', (confirmed) => {
          if (!confirmed) return;

          TelegramAPI.hapticError();
          const booking = App.bookings.find(b => b.id === bookingId);
          if (booking) booking.status = 'cancelled';

          // Перерисовываем
          const container = document.getElementById('screen-container');
          container.innerHTML = this.render();
          this.init();

          App.showSnackbar('Запись отменена');
        });
      },

      /** Повторная запись на ту же услугу */
      rebook(serviceId) {
        TelegramAPI.hapticLight();
        const service = SERVICES.find(s => s.id === serviceId);
        if (!service) return;

        App.booking.service = service;
        App.booking.date = null;
        App.booking.time = null;
        App.booking.phone = null;

        // Переходим к выбору даты
        App.currentTab = 'catalog';
        App.setActiveTab('catalog');
        App.stack = [{ name: 'catalog', data: null }];
        App.push('service', service);
      },
    },

    // ------------------------------------------
    // ЭКРАН: ПРОФИЛЬ МАСТЕРА
    // ------------------------------------------
    master: {
      render() {
        return `
          <div class="screen">
            <div class="master-profile-screen">
              <!-- Обложка -->
              <div class="master-cover">
                <div class="master-cover-avatar">${MASTER.emoji}</div>
                <div class="master-cover-name">${MASTER.name}</div>
                <div class="master-cover-spec">${MASTER.specialty}</div>
              </div>

              <!-- Статистика -->
              <div class="master-stats">
                <div class="master-stat">
                  <div class="master-stat-num">★ ${MASTER.rating}</div>
                  <div class="master-stat-label">Рейтинг</div>
                </div>
                <div class="master-stat">
                  <div class="master-stat-num">${MASTER.experience}</div>
                  <div class="master-stat-label">Опыт</div>
                </div>
                <div class="master-stat">
                  <div class="master-stat-num">${MASTER.clients}</div>
                  <div class="master-stat-label">Клиентов</div>
                </div>
              </div>

              <!-- О мастере -->
              <div class="master-info-section">
                <div class="master-info-title">О мастере</div>
                <div class="master-info-text">${MASTER.bio}</div>
              </div>

              <!-- Адрес -->
              <div class="master-info-section">
                <div class="master-info-title">Адрес</div>
                <div class="master-info-text">📍 ${MASTER.address}</div>
              </div>

              <!-- Часы работы -->
              <div class="master-info-section">
                <div class="master-info-title">Часы работы</div>
                <div class="master-info-text">🕑 ${MASTER.workingHours}</div>
              </div>

            </div>
          </div>
        `;
      },

      init() {
        TelegramAPI.hideMainButton();
      },
    },

  }, // конец screens

}; // конец App

// =============================================
// ЗАПУСК ПРИЛОЖЕНИЯ
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
