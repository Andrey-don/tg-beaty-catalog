/**
 * summary.js — Итог записи (шаг 2 из 2)
 */

const SummaryScreen = {
  render() {
    const { service, date, time, user, phone } = App.booking;
    if (!service || !date || !time) return '<div class="screen"></div>';

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

            <div class="form-group" style="margin-bottom:10px">
              <label class="form-label">Имя</label>
              <input class="form-input" id="client-name" type="text"
                     value="${user?.first_name || ''}"
                     placeholder="Ваше имя">
            </div>

            <div class="form-group" style="margin-bottom:10px">
              <label class="form-label">Телефон</label>
              <input class="form-input" id="client-phone" type="tel"
                     value="${phone || ''}"
                     placeholder="+7 (999) 000-00-00">
            </div>

            <button class="btn-add-phone" onclick="SummaryScreen.fillFromTelegram()">
              📲 Использовать номер из Telegram
            </button>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.showMainButton('Подтвердить запись', () => this.confirm());
  },

  fillFromTelegram() {
    TelegramAPI.hapticLight();
    TelegramAPI.requestContact(contact => {
      const phoneInput = document.getElementById('client-phone');
      if (phoneInput) phoneInput.value = contact.phone_number;
      App.booking.phone = contact.phone_number;
    });
  },

  confirm() {
    // Читаем редактируемые поля перед сохранением
    const nameVal  = document.getElementById('client-name')?.value?.trim();
    const phoneVal = document.getElementById('client-phone')?.value?.trim();

    if (nameVal)  App.booking.user = { ...App.booking.user, first_name: nameVal };
    if (phoneVal) App.booking.phone = phoneVal;

    TelegramAPI.hapticMedium();
    TelegramAPI.showMainButtonProgress();

    setTimeout(() => {
      TelegramAPI.hideMainButtonProgress();

      const { service, date, time, user, phone } = App.booking;

      // Добавляем в список записей клиента
      App.bookings.unshift({
        id:          'b' + Date.now(),
        serviceId:   service.id,
        serviceName: service.title,
        date:        new Date(date),
        time,
        status: 'confirmed',
        price:  service.price,
      });

      // Добавляем в список мастера как «ожидает подтверждения»
      MASTER_BOOKINGS.unshift({
        id:          'mb' + Date.now(),
        clientName:  user?.first_name || 'Клиент',
        serviceId:   service.id,
        serviceName: service.title,
        date:        new Date(date),
        time,
        status:      'pending',
        price:       service.price,
        phone:       phone || 'не указан',
      });

      Router.push('success', null);
    }, 600);
  },
};

Router.register('summary', SummaryScreen);
