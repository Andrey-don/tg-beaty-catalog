/**
 * client-master-profile.js — Профиль мастера (вид клиента)
 */

const ClientMasterProfileScreen = {
  render() {
    return `
      <div class="screen">
        <div class="master-profile-screen">
          <div class="master-cover">
            <div class="master-cover-avatar">${MASTER.emoji}</div>
            <div class="master-cover-name">${MASTER.name}</div>
            <div class="master-cover-spec">${MASTER.specialty}</div>
          </div>

          <div class="master-stats">
            <div class="master-stat">
              <div class="master-stat-num">★ ${MASTER.rating}</div>
              <div class="master-stat-label">Рейтинг</div>
            </div>
            <div class="master-stat">
              <div class="master-stat-num">${MASTER.experience}</div>
              <div class="master-stat-label">Опыт</div>
            </div>
            <div class="master-stat">
              <div class="master-stat-num">${MASTER.clients}</div>
              <div class="master-stat-label">Клиентов</div>
            </div>
          </div>

          <div class="master-info-section">
            <div class="master-info-title">О мастере</div>
            <div class="master-info-text">${MASTER.bio}</div>
          </div>

          <div class="master-info-section">
            <div class="master-info-title">Адрес</div>
            <div class="master-info-text">📍 ${MASTER.address}</div>
          </div>

          <div class="master-info-section">
            <div class="master-info-title">Часы работы</div>
            <div class="master-info-text">🕑 ${MASTER.workingHours}</div>
          </div>
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },
};

Router.register('master-profile-client', ClientMasterProfileScreen);
