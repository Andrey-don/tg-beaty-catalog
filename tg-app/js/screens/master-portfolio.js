/**
 * master-portfolio.js — Портфолио мастера
 */

const MasterPortfolioScreen = {
  render() {
    const photosHTML = MASTER_PORTFOLIO.map(p => `
      <div class="portfolio-item" style="background: ${p.gradient}"
           onclick="TelegramAPI.hapticLight(); Router.push('photo', p)">
        <div class="portfolio-item-emoji">${p.emoji}</div>
        <div class="portfolio-item-title">${p.title}</div>
      </div>
    `).join('');

    return `
      <div class="screen pb-main-btn">
        <div class="portfolio-screen">
          <div class="page-title">Портфолио</div>
          <div class="portfolio-grid">
            ${photosHTML}
            <div class="portfolio-add" onclick="MasterPortfolioScreen.addPhoto()">
              <div class="portfolio-add-icon">+</div>
              <div class="portfolio-add-text">Добавить фото</div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },

  addPhoto() {
    TelegramAPI.hapticLight();
    TelegramAPI.showAlert('В реальном приложении здесь откроется загрузка фото из галереи.');
  },
};

Router.register('master-portfolio', MasterPortfolioScreen);
