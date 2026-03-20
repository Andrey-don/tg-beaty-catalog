/**
 * dashboard.js — Дашборд мастера (главный экран)
 *
 * Содержит: приветствие, ссылка на бота, ближайшие записи,
 * быстрые действия (как в курсе).
 */

const DashboardScreen = {
  render() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Ближайшие записи (сегодня + завтра)
    const upcoming = MASTER_BOOKINGS
      .filter(b => {
        const d = new Date(b.date); d.setHours(0, 0, 0, 0);
        return d >= now && b.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 4);

    // Статистика
    const monthIncome = MASTER_BOOKINGS
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.price, 0);

    const pendingCount = MASTER_BOOKINGS.filter(b => b.status === 'pending').length;

    const bookingsHTML = upcoming.length
      ? upcoming.map(b => this._renderBookingCard(b)).join('')
      : `<div class="empty-state-master">
           <div style="font-size:40px">📅</div>
           <div style="color:var(--tg-theme-hint-color);font-size:14px">Нет предстоящих записей</div>
         </div>`;

    return `
      <div class="screen">
        <div class="dashboard-screen">

          <div class="dashboard-greeting">Привет, ${MASTER.name.split(' ')[0]}! 👋</div>
          <div class="dashboard-date">${formatDateFull(new Date())}</div>

          <!-- Ссылка на бота -->
          <div class="summary-card" style="margin-bottom:20px">
            <div class="summary-card-body">
              <div style="font-size:12px;color:var(--tg-theme-hint-color);margin-bottom:6px">🔗 Ваша ссылка для клиентов</div>
              <div style="font-size:14px;color:var(--tg-theme-link-color);margin-bottom:10px">t.me/anna_beauty_bot</div>
              <button class="btn-primary" style="width:100%;font-size:14px"
                      onclick="DashboardScreen.copyLink()">Скопировать ссылку</button>
            </div>
          </div>

          <!-- Статистика -->
          <div class="dashboard-stats">
            <div class="stat-card" style="cursor:pointer" onclick="TelegramAPI.hapticLight(); Router.push('master-bookings', null)">
              <div class="stat-card-value accent">${pendingCount}</div>
              <div class="stat-card-label">Новых заявок</div>
            </div>
            <div class="stat-card">
              <div class="stat-card-value">${MASTER_BOOKINGS.length}</div>
              <div class="stat-card-label">Всего записей</div>
            </div>
            <div class="stat-card" style="grid-column: span 2">
              <div class="stat-card-value accent">${formatPrice(monthIncome)}</div>
              <div class="stat-card-label">Доход (подтверждённые)</div>
            </div>
          </div>

          <!-- Ближайшие записи -->
          <div class="dashboard-section-title">
            Ближайшие записи
            <span onclick="TelegramAPI.hapticLight(); Router.push('master-bookings', null)"
                  style="font-size:13px;color:var(--tg-theme-link-color);cursor:pointer">
              Все записи →
            </span>
          </div>
          ${bookingsHTML}

          <!-- Быстрые действия -->
          <div class="dashboard-section-title" style="margin-top:20px">Быстрые действия</div>
          <div class="dashboard-stats">
            <div class="stat-card" style="cursor:pointer;text-align:center"
                 onclick="TelegramAPI.hapticLight(); Router.push('master-services', null)">
              <div style="font-size:32px;margin-bottom:6px">✂️</div>
              <div class="stat-card-label" style="font-size:13px;font-weight:600">Услуги</div>
              <div class="stat-card-label">${SERVICES.length} услуг</div>
            </div>
            <div class="stat-card" style="cursor:pointer;text-align:center"
                 onclick="TelegramAPI.hapticLight(); Router.push('master-portfolio', null)">
              <div style="font-size:32px;margin-bottom:6px">🖼</div>
              <div class="stat-card-label" style="font-size:13px;font-weight:600">Фото</div>
              <div class="stat-card-label">${MASTER_PORTFOLIO.length} фото</div>
            </div>
            <div class="stat-card" style="cursor:pointer;text-align:center"
                 onclick="TelegramAPI.hapticLight(); Router.push('master-schedule', null)">
              <div style="font-size:32px;margin-bottom:6px">📅</div>
              <div class="stat-card-label" style="font-size:13px;font-weight:600">График</div>
              <div class="stat-card-label">Пн–Пт, Сб</div>
            </div>
            <div class="stat-card" style="cursor:pointer;text-align:center"
                 onclick="TelegramAPI.hapticLight(); Router.push('master-profile', null)">
              <div style="font-size:32px;margin-bottom:6px">👤</div>
              <div class="stat-card-label" style="font-size:13px;font-weight:600">Профиль</div>
              <div class="stat-card-label">Изменить</div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },

  _renderBookingCard(b) {
    const isPending = b.status === 'pending';
    return `
      <div class="dashboard-booking-card">
        <div class="dashboard-booking-time">${b.time}</div>
        <div class="dashboard-booking-info">
          <div class="dashboard-booking-client">${b.clientName}</div>
          <div class="dashboard-booking-service">${b.serviceName} · ${formatPrice(b.price)}</div>
          <div style="font-size:12px;margin-top:2px;color:var(--tg-theme-hint-color)">
            ${formatDate(new Date(b.date))}
          </div>
        </div>
        ${isPending ? `
          <button class="btn-icon" style="background:var(--tg-theme-button-color);color:white;width:auto;padding:0 10px;border-radius:10px;font-size:12px;font-weight:600"
                  onclick="DashboardScreen.confirmBooking('${b.id}')">✓</button>
        ` : `<div class="status-badge confirmed" style="font-size:11px">✓</div>`}
      </div>
    `;
  },

  confirmBooking(id) {
    TelegramAPI.hapticSuccess();
    const b = MASTER_BOOKINGS.find(b => b.id === id);
    if (b) b.status = 'confirmed';
    Router.replace('dashboard', null);
    App.refreshMasterNav();
    App.showSnackbar('Запись подтверждена ✓');
  },

  copyLink() {
    TelegramAPI.hapticLight();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('t.me/anna_beauty_bot').then(() => {
        App.showSnackbar('Ссылка скопирована!');
      });
    } else {
      App.showSnackbar('Ссылка: t.me/anna_beauty_bot');
    }
  },
};

Router.register('dashboard', DashboardScreen);
