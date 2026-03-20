/**
 * summary.js — Итог записи (шаг 2 из 2)
 */

const SummaryScreen = {
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

          <div class="client-section">
            <div class="client-label">Ваши данные</div>
            <div class="client-row">
              <span class="client-row-label">Имя</span>
              <span>${user?.first_name || 'Не указано'}</span>
            </div>
            ${phoneRow}
            ${!phone ? `
              <button class="btn-add-phone" onclick="SummaryScreen.addPhone()">
                + Добавить телефон
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.showMainButton('Подтвердить запись', () => this.confirm());
  },

  addPhone() {
    TelegramAPI.hapticLight();
    TelegramAPI.requestContact(contact => {
      App.booking.phone = contact.phone_number;
      Router.replace('summary', null);
    });
  },

  confirm() {
    TelegramAPI.hapticMedium();
    TelegramAPI.showMainButtonProgress();

    setTimeout(() => {
      TelegramAPI.hideMainButtonProgress();
      const { service, date, time } = App.booking;
      App.bookings.unshift({
        id: 'b' + Date.now(),
        serviceId:   service.id,
        serviceName: service.title,
        date:        new Date(date),
        time,
        status: 'confirmed',
        price:  service.price,
      });
      Router.push('success', null);
    }, 600);
  },
};

Router.register('summary', SummaryScreen);
