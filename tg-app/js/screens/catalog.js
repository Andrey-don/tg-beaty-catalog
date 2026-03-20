/**
 * catalog.js — Главный экран клиента (профиль мастера + услуги)
 */

const CatalogScreen = {

  render() {
    // Инициалы из имени
    const initials = MASTER.name.split(' ').map(w => w[0]).slice(0, 2).join('');

    const portfolioHTML = MASTER_PORTFOLIO.map(item => `
      <div class="profile-portfolio-item" style="background: ${item.gradient}"
           onclick="CatalogScreen.openPhoto('${item.id}')">
        <span class="profile-portfolio-emoji">${item.emoji}</span>
      </div>
    `).join('');

    const servicesHTML = SERVICES.map(s => `
      <div class="profile-service-row" onclick="CatalogScreen.openService(${s.id})">
        <div class="profile-service-icon" style="background: ${s.photoGradient}">${s.emoji}</div>
        <div class="profile-service-info">
          <div class="profile-service-name">${s.title}</div>
          <div class="profile-service-duration">⏱ ${formatDuration(s.duration)}</div>
        </div>
        <div class="profile-service-price">${formatPrice(s.price)}</div>
      </div>
    `).join('');

    return `
      <div class="screen pb-main-btn">

        <!-- Профиль мастера -->
        <div class="profile-header">
          <div class="profile-avatar">${initials}</div>
          <div class="profile-name">${MASTER.name}</div>
          <div class="profile-spec">${MASTER.specialty}</div>
          <div class="profile-address">📍 ${MASTER.address}</div>
          <div class="profile-stats">${MASTER.bookingsCount} записей &nbsp;·&nbsp; Ближайшее: ${MASTER.nextAvailable}</div>
          <div class="profile-actions">
            <button class="profile-btn" onclick="CatalogScreen.callMaster()">
              <span>📞</span> Позвонить
            </button>
            <button class="profile-btn" onclick="CatalogScreen.writeMaster()">
              <span>✉️</span> Написать
            </button>
          </div>
        </div>

        <!-- Портфолио -->
        <div class="profile-section-label">Работы</div>
        <div class="profile-portfolio-grid">${portfolioHTML}</div>

        <!-- Услуги -->
        <div class="profile-section-label">Услуги</div>
        <div class="profile-services-list">${servicesHTML}</div>

      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },

  openService(serviceId) {
    TelegramAPI.hapticLight();
    const service = SERVICES.find(s => s.id === serviceId);
    if (!service) return;
    App.booking.service = service;
    App.booking.date = null;
    App.booking.time = null;
    Router.push('service', service);
  },

  openPhoto(photoId) {
    TelegramAPI.hapticLight();
    const item = MASTER_PORTFOLIO.find(p => p.id === photoId);
    if (!item) return;
    Router.push('photo', item);
  },

  callMaster() {
    TelegramAPI.hapticLight();
    if (MASTER.phone) window.open(`tel:${MASTER.phone}`);
  },

  writeMaster() {
    TelegramAPI.hapticLight();
    App.showSnackbar('Написать мастеру в Telegram');
  },
};

Router.register('catalog', CatalogScreen);
