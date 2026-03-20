/**
 * success.js — Заявка отправлена, ожидание подтверждения мастера
 */

const SuccessScreen = {
  render() {
    const { service, date, time } = App.booking;
    return `
      <div class="screen">
        <div class="success-screen">
          <div class="success-checkmark">📨</div>
          <div class="success-title">Заявка отправлена! 📨</div>
          <div class="success-subtitle">Ожидайте подтверждения мастера, ${App.booking.user?.first_name || 'клиент'} 🌸</div>

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

          <div class="reminder-text">🔔 Мастер подтвердит или предложит другое время</div>
        </div>
      </div>
    `;
  },

  init() {
    setTimeout(() => TelegramAPI.hapticSuccess(), 300);

    TelegramAPI.showMainButton('Вернуться к услугам', () => {
      TelegramAPI.hapticLight();
      App.booking.service = null;
      App.booking.date    = null;
      App.booking.time    = null;
      App.booking.phone   = null;
      Router.goRoot('catalog');
      App._setActiveTab('catalog');
    });
  },
};

Router.register('success', SuccessScreen);
