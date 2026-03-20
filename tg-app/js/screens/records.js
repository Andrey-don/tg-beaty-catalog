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
    const b = booking;
    const labels = {
      confirmed: 'Подтверждено',
      pending:   'Ожидает',
      cancelled: 'Отменено',
      propose:   'Новое время',
    };
    const isUpcoming = this.activeTab === 'upcoming';

    if (b.status === 'propose') {
      const proposedFormatted = b.proposedDate ? formatDateFull(new Date(b.proposedDate)) : '';
      return `
        <div class="booking-card">
          <div class="booking-card-header">
            <div class="booking-service-name">${b.serviceName}</div>
            <div class="status-badge propose">${labels['propose']}</div>
          </div>
          <div class="booking-card-date">
            📅 ${formatDateFull(new Date(b.date))} · ${b.time}
            &nbsp;&nbsp;💳 ${formatPrice(b.price)}
          </div>
          <div class="propose-notice">
            📅 Мастер предлагает другое время:<br>
            <strong>${proposedFormatted} · ${b.proposedTime || ''}</strong>
          </div>
          <div class="booking-actions">
            <button class="btn-rebook"
                    onclick="RecordsScreen.acceptProposal('${b.id}')">✓ Принять</button>
            <button class="btn-cancel-booking"
                    onclick="RecordsScreen.rejectProposal('${b.id}')">Отклонить</button>
          </div>
        </div>
      `;
    }

    if (b.status === 'pending') {
      return `
        <div class="booking-card">
          <div class="booking-card-header">
            <div class="booking-service-name">${b.serviceName}</div>
            <div class="status-badge pending">${labels['pending']}</div>
          </div>
          <div class="booking-card-date">
            📅 ${formatDateFull(new Date(b.date))} · ${b.time}
            &nbsp;&nbsp;💳 ${formatPrice(b.price)}
          </div>
          <div style="font-size:13px;color:var(--tg-theme-hint-color);margin-bottom:12px">
            Ожидает мастера
          </div>
          ${isUpcoming ? `
            <div class="booking-actions">
              <button class="btn-cancel-booking"
                      onclick="RecordsScreen.cancelBooking('${b.id}')">Отменить</button>
            </div>
          ` : ''}
        </div>
      `;
    }

    // confirmed / cancelled
    return `
      <div class="booking-card">
        <div class="booking-card-header">
          <div class="booking-service-name">${b.serviceName}</div>
          <div class="status-badge ${b.status}">${labels[b.status] || b.status}</div>
        </div>
        <div class="booking-card-date">
          📅 ${formatDateFull(new Date(b.date))} · ${b.time}
          &nbsp;&nbsp;💳 ${formatPrice(b.price)}
        </div>
        ${isUpcoming && b.status === 'confirmed' ? `
          <div class="booking-actions">
            <button class="btn-cancel-booking"
                    onclick="RecordsScreen.cancelBooking('${b.id}')">Отменить</button>
            <button class="btn-rebook"
                    onclick="RecordsScreen.rebook(${b.serviceId})">Записаться снова</button>
          </div>
        ` : `
          <div class="booking-actions">
            <button class="btn-rebook"
                    onclick="RecordsScreen.rebook(${b.serviceId})">Записаться снова</button>
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

  acceptProposal(bookingId) {
    TelegramAPI.hapticSuccess();
    const cb = App.bookings.find(b => b.id === bookingId);
    if (cb) {
      cb.status = 'confirmed';
      cb.date = cb.proposedDate;
      cb.time = cb.proposedTime;
      // sync master booking
      if (cb.masterBookingId) {
        const mb = MASTER_BOOKINGS.find(b => b.id === cb.masterBookingId);
        if (mb) {
          mb.status = 'confirmed';
          mb.date = cb.proposedDate;
          mb.time = cb.proposedTime;
        }
      }
    }
    document.getElementById('screen-container').innerHTML = this.render();
    this.init();
    App.showSnackbar('Новое время подтверждено ✓');
  },

  rejectProposal(bookingId) {
    TelegramAPI.showConfirm('Отклонить предложение мастера?', confirmed => {
      if (!confirmed) return;
      TelegramAPI.hapticError();
      const cb = App.bookings.find(b => b.id === bookingId);
      if (cb) {
        cb.status = 'cancelled';
        if (cb.masterBookingId) {
          const mb = MASTER_BOOKINGS.find(b => b.id === cb.masterBookingId);
          if (mb) mb.status = 'cancelled';
        }
      }
      document.getElementById('screen-container').innerHTML = this.render();
      this.init();
      App.showSnackbar('Предложение отклонено');
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
