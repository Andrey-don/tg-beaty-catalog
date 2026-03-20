/**
 * records.js — Мои записи (экран клиента)
 */

const RecordsScreen = {
  activeTab: 'upcoming',

  render() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = App.bookings.filter(b => {
      const d = new Date(b.date); d.setHours(0, 0, 0, 0);
      return d >= now && b.status !== 'cancelled';
    });

    const past = App.bookings.filter(b => {
      const d = new Date(b.date); d.setHours(0, 0, 0, 0);
      return d < now || b.status === 'cancelled';
    });

    const list = this.activeTab === 'upcoming' ? upcoming : past;

    const bookingsHTML = list.length
      ? list.map(b => this._renderCard(b)).join('')
      : `
        <div class="empty-state">
          <div class="empty-icon">${this.activeTab === 'upcoming' ? '📅' : '📋'}</div>
          <div class="empty-title">${this.activeTab === 'upcoming' ? 'Нет предстоящих записей' : 'История пуста'}</div>
          <div class="empty-text">${this.activeTab === 'upcoming'
            ? 'Запишитесь на первую процедуру'
            : 'Здесь будут ваши прошлые визиты'}</div>
          ${this.activeTab === 'upcoming'
            ? `<button class="btn-primary" onclick="Router.goRoot('catalog'); App._setActiveTab('catalog')">Выбрать услугу</button>`
            : ''}
        </div>
      `;

    return `
      <div class="screen">
        <div class="bookings-screen">
          <div class="bookings-title">Мои записи</div>

          <div class="tabs-row">
            <button class="tab-btn ${this.activeTab === 'upcoming' ? 'active' : ''}"
                    onclick="RecordsScreen.switchTab('upcoming')">Предстоящие</button>
            <button class="tab-btn ${this.activeTab === 'past' ? 'active' : ''}"
                    onclick="RecordsScreen.switchTab('past')">Прошлые</button>
          </div>

          <div id="bookings-list">${bookingsHTML}</div>
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },

  _renderCard(booking) {
    const labels = { confirmed: 'Подтверждено', pending: 'Ожидает', cancelled: 'Отменено' };
    const isUpcoming = this.activeTab === 'upcoming';
    return `
      <div class="booking-card">
        <div class="booking-card-header">
          <div class="booking-service-name">${booking.serviceName}</div>
          <div class="status-badge ${booking.status}">${labels[booking.status]}</div>
        </div>
        <div class="booking-card-date">
          📅 ${formatDateFull(new Date(booking.date))} · ${booking.time}
          &nbsp;&nbsp;💳 ${formatPrice(booking.price)}
        </div>
        ${isUpcoming ? `
          <div class="booking-actions">
            <button class="btn-cancel-booking"
                    onclick="RecordsScreen.cancelBooking('${booking.id}')">Отменить</button>
            <button class="btn-rebook"
                    onclick="RecordsScreen.rebook(${booking.serviceId})">Записаться снова</button>
          </div>
        ` : `
          <div class="booking-actions">
            <button class="btn-rebook"
                    onclick="RecordsScreen.rebook(${booking.serviceId})">Записаться снова</button>
          </div>
        `}
      </div>
    `;
  },

  switchTab(tab) {
    TelegramAPI.hapticLight();
    this.activeTab = tab;
    document.getElementById('screen-container').innerHTML = this.render();
    this.init();
  },

  cancelBooking(bookingId) {
    TelegramAPI.showConfirm('Отменить запись?', confirmed => {
      if (!confirmed) return;
      TelegramAPI.hapticError();
      const b = App.bookings.find(b => b.id === bookingId);
      if (b) b.status = 'cancelled';
      document.getElementById('screen-container').innerHTML = this.render();
      this.init();
      App.showSnackbar('Запись отменена');
    });
  },

  rebook(serviceId) {
    TelegramAPI.hapticLight();
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;
    App.booking.service = service;
    App.booking.date    = null;
    App.booking.time    = null;
    App.booking.phone   = null;
    App._setActiveTab('catalog');
    Router.stack = [{ name: 'catalog', data: null }];
    Router.push('service', service);
  },
};

Router.register('records', RecordsScreen);
