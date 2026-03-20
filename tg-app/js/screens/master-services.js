/**
 * master-services.js — Управление услугами (экран мастера)
 */

const MasterServicesScreen = {
  render() {
    const servicesHTML = SERVICES.map(s => `
      <div class="master-service-card">
        <div class="master-service-emoji">${s.emoji}</div>
        <div class="master-service-info">
          <div class="master-service-name">${s.title}</div>
          <div class="master-service-meta">
            ${formatDuration(s.duration)} · ${s.priceFrom ? 'от ' : ''}${formatPrice(s.price)}
          </div>
        </div>
        <div class="master-service-actions">
          <button class="btn-icon" onclick="MasterServicesScreen.editService(${s.id})" title="Редактировать">✏️</button>
          <button class="btn-icon" onclick="MasterServicesScreen.deleteService(${s.id})" title="Удалить">🗑</button>
        </div>
      </div>
    `).join('');

    return `
      <div class="screen pb-main-btn">
        <div class="master-services-screen">
          <div class="page-title">Мои услуги</div>
          ${servicesHTML}
          <button class="btn-add-service" onclick="MasterServicesScreen.addService()">
            + Добавить услугу
          </button>
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },

  editService(id) {
    TelegramAPI.hapticLight();
    const service = SERVICES.find(s => s.id === id);
    Router.push('service-edit', { service, isNew: false });
  },

  addService() {
    TelegramAPI.hapticLight();
    Router.push('service-edit', { service: null, isNew: true });
  },

  deleteService(id) {
    TelegramAPI.showConfirm('Удалить услугу?', confirmed => {
      if (!confirmed) return;
      TelegramAPI.hapticError();
      const idx = SERVICES.findIndex(s => s.id === id);
      if (idx !== -1) SERVICES.splice(idx, 1);
      Router.replace('master-services', null);
      App.showSnackbar('Услуга удалена');
    });
  },
};

Router.register('master-services', MasterServicesScreen);
