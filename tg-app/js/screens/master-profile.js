/**
 * master-profile.js — Профиль мастера (редактирование)
 */

const MasterProfileScreen = {
  render() {
    return `
      <div class="screen pb-main-btn">
        <div class="master-profile-edit">

          <div class="profile-avatar-section">
            <div class="profile-avatar-big">${MASTER.emoji}</div>
            <div class="profile-avatar-hint">Изменить фото</div>
          </div>

          <div class="form-group">
            <label class="form-label">Имя</label>
            <input class="form-input" id="profile-name" type="text" value="${MASTER.name}">
          </div>

          <div class="form-group">
            <label class="form-label">Специализация</label>
            <input class="form-input" id="profile-specialty" type="text" value="${MASTER.specialty}">
          </div>

          <div class="form-group">
            <label class="form-label">О себе</label>
            <textarea class="form-textarea" id="profile-bio">${MASTER.bio}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Адрес</label>
            <input class="form-input" id="profile-address" type="text" value="${MASTER.address}">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Опыт</label>
              <input class="form-input" id="profile-experience" type="text" value="${MASTER.experience}">
            </div>
            <div class="form-group">
              <label class="form-label">Клиентов</label>
              <input class="form-input" id="profile-clients" type="text" value="${MASTER.clients}">
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.showMainButton('Сохранить профиль', () => this.save());
  },

  save() {
    TelegramAPI.hapticMedium();
    TelegramAPI.showMainButtonProgress();

    setTimeout(() => {
      MASTER.name       = document.getElementById('profile-name').value.trim() || MASTER.name;
      MASTER.specialty  = document.getElementById('profile-specialty').value.trim() || MASTER.specialty;
      MASTER.bio        = document.getElementById('profile-bio').value.trim() || MASTER.bio;
      MASTER.address    = document.getElementById('profile-address').value.trim() || MASTER.address;
      MASTER.experience = document.getElementById('profile-experience').value.trim() || MASTER.experience;
      MASTER.clients    = document.getElementById('profile-clients').value.trim() || MASTER.clients;

      TelegramAPI.hideMainButtonProgress();
      Router.pop();
      App.showSnackbar('Профиль сохранён ✓');
    }, 400);
  },
};

Router.register('master-profile', MasterProfileScreen);
