/**
 * catalog.js — Каталог услуг (главный экран клиента)
 */

const CatalogScreen = {
  activeCategory: 'all',

  render() {
    const filtered = this.activeCategory === 'all'
      ? SERVICES
      : SERVICES.filter(s => s.category === this.activeCategory);

    const categoriesHTML = CATEGORIES.map(cat => `
      <button class="category-chip ${cat.id === this.activeCategory ? 'active' : ''}"
              onclick="CatalogScreen.filterBy('${cat.id}')">
        ${cat.label}
      </button>
    `).join('');

    const servicesHTML = filtered.map(s => `
      <div class="service-card" onclick="CatalogScreen.openService(${s.id})">
        <div class="service-card-photo" style="background: ${s.photoGradient}">
          ${s.emoji}
        </div>
        <div class="service-card-body">
          <div class="service-card-title">${s.title}</div>
          <div class="service-card-meta">
            <span>⏱ ${formatDuration(s.duration)}</span>
          </div>
          <div class="service-card-footer">
            <div class="service-price ${s.priceFrom ? 'from' : ''}">${formatPrice(s.price)}</div>
            <button class="btn-select" onclick="event.stopPropagation(); CatalogScreen.openService(${s.id})">
              Выбрать →
            </button>
          </div>
        </div>
      </div>
    `).join('');

    return `
      <div class="screen pb-main-btn">
        <div class="master-header">
          <div class="master-avatar">${MASTER.emoji}</div>
          <div>
            <div class="master-name">${MASTER.name}</div>
            <div class="master-spec">${MASTER.specialty}</div>
          </div>
        </div>

        <div class="categories-scroll">
          <div class="categories-inner">${categoriesHTML}</div>
        </div>

        <div class="services-list">
          ${servicesHTML.length ? servicesHTML : `
            <div class="empty-state">
              <div class="empty-icon">💅</div>
              <div class="empty-title">Услуги не найдены</div>
            </div>
          `}
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },

  filterBy(categoryId) {
    TelegramAPI.hapticLight();
    this.activeCategory = categoryId;
    document.getElementById('screen-container').innerHTML = this.render();
    this.init();
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
};

Router.register('catalog', CatalogScreen);
