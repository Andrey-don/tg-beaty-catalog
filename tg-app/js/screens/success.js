/**
 * success.js — Запись подтверждена
 */

const SuccessScreen = {
  render() {
    const { service, date, time } = App.booking;
    return `
      <div class="screen">
        <div class="success-screen">
          <div class="success-checkmark">✅</div>
          <div class="success-title">Запись подтверждена!</div>
          <div class="success-subtitle">Ждём вас, ${App.booking.user?.first_name || 'дорогой клиент'} 🌸</div>

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

          <button class="btn-calendar" onclick="SuccessScreen.addToCalendar()">
            📆 Добавить в календарь
          </button>
          <div class="reminder-text">🔔 Напомним за 24 часа в этом чате</div>
        </div>
      </div>
    `;
  },

  init() {
    setTimeout(() => TelegramAPI.hapticSuccess(), 300);

    TelegramAPI.showMainButton('Вернуться в каталог', () => {
      TelegramAPI.hapticLight();
      App.booking.service = null;
      App.booking.date    = null;
      App.booking.time    = null;
      App.booking.phone   = null;
      Router.goRoot('catalog');
      App._setActiveTab('catalog');
    });
  },

  addToCalendar() {
    TelegramAPI.hapticLight();
    const { service, date, time } = App.booking;
    if (!service || !date || !time) return;

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
};

Router.register('success', SuccessScreen);
