/**
 * master-bookings.js — Записи клиентов (экран мастера)
 */

const MasterBookingsScreen = {
  activeTab: 'upcoming',

  render() {
    const now = new Date(); now.setHours(0, 0, 0, 0);

    const upcoming = MASTER_BOOKINGS.filter(b => {
      const d = new Date(b.date); d.setHours(0, 0, 0, 0);
      return d >= now && b.status !== 'cancelled';
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const past = MASTER_BOOKINGS.filter(b => {
      const d = new Date(b.date); d.setHours(0, 0, 0, 0);
      return d < now || b.status === 'cancelled';
    });

    const list = this.activeTab === 'upcoming' ? upcoming : past;

    const cardsHTML = list.length
      ? list.map(b => this._renderCard(b)).join('')
      : `<div class="empty-state">
           <div class="empty-icon">📅</div>
           <div class="empty-title">Нет записей</div>
         </div>`;

    return `
      <div class="screen">
        <div class="master-bookings-screen">
          <div class="page-title">Записи клиентов</div>

          <div class="tabs-row">
            <button class="tab-btn ${this.activeTab === 'upcoming' ? 'active' : ''}"
                    onclick="MasterBookingsScreen.switchTab('upcoming')">Предстоящие</button>
            <button class="tab-btn ${this.activeTab === 'past' ? 'active' : ''}"
                    onclick="MasterBookingsScreen.switchTab('past')">Прошлые</button>
          </div>

          ${cardsHTML}
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },

  _renderCard(b) {
    const labels = {
      confirmed: 'Подтверждено',
      pending:   'Ожидает',
      cancelled: 'Отменено',
      propose:   'Новое время ↕',
    };
    const isPending = b.status === 'pending';
    const isPropose = b.status === 'propose';

    let actionsHTML = '';

    if (isPending) {
      actionsHTML = `
        <div class="master-booking-actions">
          <button class="btn-confirm-booking"
                  onclick="MasterBookingsScreen.confirm('${b.id}')">✓ Подтвердить</button>
          <button class="btn-propose-booking"
                  onclick="MasterBookingsScreen.togglePropose('${b.id}')">📅 Другое время</button>
          <button class="btn-cancel-booking"
                  onclick="MasterBookingsScreen.cancel('${b.id}')">Отменить</button>
        </div>
        <div class="propose-form" id="propose-form-${b.id}" style="display:none">
          <div class="form-row">
            <input class="form-input" type="date" id="propose-date-${b.id}">
            <input class="form-input" type="time" id="propose-time-${b.id}">
          </div>
          <button class="btn-confirm-booking" style="width:100%"
                  onclick="MasterBookingsScreen.sendProposal('${b.id}')">Отправить предложение</button>
        </div>
      `;
    } else if (isPropose) {
      const proposedFormatted = b.proposedDate ? formatDateFull(new Date(b.proposedDate)) : '';
      actionsHTML = `
        <div style="font-size:13px;color:var(--tg-theme-hint-color);margin-bottom:8px">
          Предложено: <strong style="color:var(--tg-theme-text-color)">${proposedFormatted} · ${b.proposedTime || ''}</strong>
        </div>
        <div class="master-booking-actions">
          <button class="btn-cancel-booking"
                  onclick="MasterBookingsScreen.cancelProposal('${b.id}')">Отменить предложение</button>
        </div>
      `;
    }

    return `
      <div class="master-booking-card">
        <div class="master-booking-top">
          <div>
            <div class="master-booking-client">${b.clientName}</div>
            <div class="master-booking-service">${b.serviceName}</div>
          </div>
          <div class="status-badge ${b.status}">${labels[b.status] || b.status}</div>
        </div>
        <div class="master-booking-datetime">
          📅 ${formatDateFull(new Date(b.date))} · ${b.time} &nbsp;·&nbsp; 💳 ${formatPrice(b.price)}
        </div>
        <div class="master-booking-phone">📞 ${b.phone}</div>
        ${actionsHTML}
      </div>
    `;
  },

  confirm(id) {
    TelegramAPI.hapticSuccess();
    const mb = MASTER_BOOKINGS.find(b => b.id === id);
    if (mb) {
      mb.status = 'confirmed';
      // sync client booking
      if (mb.clientBookingId) {
        const cb = App.bookings.find(b => b.id === mb.clientBookingId);
        if (cb) cb.status = 'confirmed';
      }
    }
    Router.replace('master-bookings', null);
    App.refreshMasterNav();
    App.showSnackbar('Запись подтверждена ✓');
  },

  cancel(id) {
    TelegramAPI.showConfirm('Отменить запись клиента?', confirmed => {
      if (!confirmed) return;
      TelegramAPI.hapticError();
      const mb = MASTER_BOOKINGS.find(b => b.id === id);
      if (mb) {
        mb.status = 'cancelled';
        // sync client booking
        if (mb.clientBookingId) {
          const cb = App.bookings.find(b => b.id === mb.clientBookingId);
          if (cb) cb.status = 'cancelled';
        }
      }
      Router.replace('master-bookings', null);
      App.refreshMasterNav();
      App.showSnackbar('Запись отменена');
    });
  },

  togglePropose(id) {
    const form = document.getElementById('propose-form-' + id);
    if (form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
  },

  sendProposal(id) {
    const dateVal = document.getElementById('propose-date-' + id).value;
    const timeVal = document.getElementById('propose-time-' + id).value;
    if (!dateVal || !timeVal) { TelegramAPI.showAlert('Укажите дату и время'); return; }
    TelegramAPI.hapticLight();
    const mb = MASTER_BOOKINGS.find(b => b.id === id);
    if (mb) {
      mb.status = 'propose';
      mb.proposedDate = new Date(dateVal);
      mb.proposedTime = timeVal;
      if (mb.clientBookingId) {
        const cb = App.bookings.find(b => b.id === mb.clientBookingId);
        if (cb) {
          cb.status = 'propose';
          cb.proposedDate = new Date(dateVal);
          cb.proposedTime = timeVal;
          cb.masterBookingId = id;
        }
      }
    }
    Router.replace('master-bookings', null);
    App.refreshMasterNav();
    App.showSnackbar('Предложение отправлено клиенту 📅');
  },

  cancelProposal(id) {
    TelegramAPI.hapticLight();
    const mb = MASTER_BOOKINGS.find(b => b.id === id);
    if (mb) {
      mb.status = 'pending';
      mb.proposedDate = null;
      mb.proposedTime = null;
      if (mb.clientBookingId) {
        const cb = App.bookings.find(b => b.id === mb.clientBookingId);
        if (cb) {
          cb.status = 'pending';
          cb.proposedDate = null;
          cb.proposedTime = null;
        }
      }
    }
    Router.replace('master-bookings', null);
    App.refreshMasterNav();
    App.showSnackbar('Предложение отменено');
  },

  switchTab(tab) {
    TelegramAPI.hapticLight();
    this.activeTab = tab;
    document.getElementById('screen-container').innerHTML = this.render();
    this.init();
  },
};

Router.register('master-bookings', MasterBookingsScreen);
