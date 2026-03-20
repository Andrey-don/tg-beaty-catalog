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
    const labels = { confirmed: 'Подтверждено', pending: 'Ожидает', cancelled: 'Отменено' };
    const isPending = b.status === 'pending';

    return `
      <div class="master-booking-card">
        <div class="master-booking-top">
          <div>
            <div class="master-booking-client">${b.clientName}</div>
            <div class="master-booking-service">${b.serviceName}</div>
          </div>
          <div class="status-badge ${b.status}">${labels[b.status]}</div>
        </div>
        <div class="master-booking-datetime">
          📅 ${formatDateFull(new Date(b.date))} · ${b.time} &nbsp;·&nbsp; 💳 ${formatPrice(b.price)}
        </div>
        <div class="master-booking-phone">📞 ${b.phone}</div>
        ${isPending ? `
          <div class="master-booking-actions">
            <button class="btn-confirm-booking"
                    onclick="MasterBookingsScreen.confirm('${b.id}')">✓ Подтвердить</button>
            <button class="btn-cancel-booking"
                    onclick="MasterBookingsScreen.cancel('${b.id}')">Отменить</button>
          </div>
        ` : ''}
      </div>
    `;
  },

  confirm(id) {
    TelegramAPI.hapticSuccess();
    const b = MASTER_BOOKINGS.find(b => b.id === id);
    if (b) b.status = 'confirmed';
    Router.replace('master-bookings', null);
    App.refreshMasterNav();
    App.showSnackbar('Запись подтверждена ✓');
  },

  cancel(id) {
    TelegramAPI.showConfirm('Отменить запись клиента?', confirmed => {
      if (!confirmed) return;
      TelegramAPI.hapticError();
      const b = MASTER_BOOKINGS.find(b => b.id === id);
      if (b) b.status = 'cancelled';
      Router.replace('master-bookings', null);
      App.refreshMasterNav();
      App.showSnackbar('Запись отменена');
    });
  },

  switchTab(tab) {
    TelegramAPI.hapticLight();
    this.activeTab = tab;
    document.getElementById('screen-container').innerHTML = this.render();
    this.init();
  },
};

Router.register('master-bookings', MasterBookingsScreen);
