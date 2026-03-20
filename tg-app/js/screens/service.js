/**
 * service.js — Детали услуги
 */

const ServiceScreen = {
  render(service) {
    if (!service) return '<div class="screen"></div>';

    return `
      <div class="screen pb-main-btn">
        <div class="service-detail-photo" style="background: ${service.photoGradient}"
             onclick="ServiceScreen.openPhoto('${service.id}')">
          <span style="font-size:80px">${service.emoji}</span>
          <div class="gallery-dots">
            <div class="gallery-dot active"></div>
            <div class="gallery-dot"></div>
            <div class="gallery-dot"></div>
          </div>
        </div>

        <div class="service-detail-body">
          <div class="service-detail-title">${service.title}</div>

          <div class="badges-row">
            <div class="badge">⏱ ${formatDuration(service.duration)}</div>
            <div class="badge price">${service.priceFrom ? 'от ' : ''}${formatPrice(service.price)}</div>
          </div>

          <div class="service-detail-desc" id="service-desc">${service.shortDesc}</div>
          <button class="read-more-btn" id="read-more-btn" onclick="ServiceScreen.toggleDesc()">
            Читать полностью ↓
          </button>

          <div class="divider" style="margin: 16px 0"></div>

          <div class="master-block">
            <div class="master-block-avatar">${MASTER.emoji}</div>
            <div>
              <div class="master-block-name">${MASTER.name}</div>
              <div class="master-block-rating">★ ${MASTER.rating} · ${MASTER.experience} опыта</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init(service) {
    TelegramAPI.showMainButton(
      `Записаться — ${formatPrice(service.price)}`,
      () => {
        TelegramAPI.hapticMedium();
        Router.push('booking', service);
      }
    );
  },

  toggleDesc() {
    const desc = document.getElementById('service-desc');
    const btn = document.getElementById('read-more-btn');
    const service = App.booking.service;
    if (!service) return;

    if (btn.textContent.includes('↓')) {
      desc.textContent = service.fullDesc;
      btn.textContent = 'Свернуть ↑';
    } else {
      desc.textContent = service.shortDesc;
      btn.textContent = 'Читать полностью ↓';
    }
  },

  openPhoto(serviceId) {
    TelegramAPI.hapticLight();
    const service = SERVICES.find(s => s.id == serviceId);
    if (service) Router.push('photo', service);
  },
};

Router.register('service', ServiceScreen);
