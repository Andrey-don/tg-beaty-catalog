/**
 * onboarding.js — Приветственный экран мастера
 * Один экран со всеми разделами — без листания шагов.
 */

const OnboardingScreen = {
  render() {
    return `
      <div class="screen pb-main-btn">
        <div class="onboarding-screen">

          <div class="onboarding-illustration">👋</div>
          <div class="onboarding-title">Добро пожаловать!</div>
          <div class="onboarding-desc">
            Управляйте своим бизнесом — расписанием, услугами и записями клиентов.
          </div>

          <!-- Управление -->
          <div class="onboarding-section-label">Управление</div>
          <div class="onboarding-features">
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.goScreen('master-schedule')">
              <div class="onboarding-feature-icon">📅</div>
              <div class="onboarding-feature-text"><strong>Расписание</strong>Управляйте рабочими днями и часами</div>
              <div class="onboarding-arrow">›</div>
            </div>
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.goScreen('master-services')">
              <div class="onboarding-feature-icon">✂️</div>
              <div class="onboarding-feature-text"><strong>Услуги</strong>Добавляйте и редактируйте прайс-лист</div>
              <div class="onboarding-arrow">›</div>
            </div>
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.goScreen('master-bookings')">
              <div class="onboarding-feature-icon">👥</div>
              <div class="onboarding-feature-text"><strong>Клиенты</strong>Подтверждайте и отменяйте записи</div>
              <div class="onboarding-arrow">›</div>
            </div>
          </div>

          <!-- Настройки -->
          <div class="onboarding-section-label">Настройки</div>
          <div class="onboarding-features">
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.goScreen('master-services')">
              <div class="onboarding-feature-icon">💰</div>
              <div class="onboarding-feature-text"><strong>Цены</strong>Установите актуальные цены на услуги</div>
              <div class="onboarding-arrow">›</div>
            </div>
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.goScreen('master-services')">
              <div class="onboarding-feature-icon">⏱</div>
              <div class="onboarding-feature-text"><strong>Длительность</strong>Укажите время каждой процедуры</div>
              <div class="onboarding-arrow">›</div>
            </div>
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.goScreen('master-portfolio')">
              <div class="onboarding-feature-icon">🎨</div>
              <div class="onboarding-feature-text"><strong>Фото и портфолио</strong>Добавьте работы для клиентов</div>
              <div class="onboarding-arrow">›</div>
            </div>
          </div>

          <!-- Информация -->
          <div class="onboarding-section-label">Информация</div>
          <div class="onboarding-features">
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.copyLink()">
              <div class="onboarding-feature-icon">🔗</div>
              <div class="onboarding-feature-text"><strong>Ваша ссылка</strong>t.me/anna_beauty_bot</div>
              <div class="onboarding-arrow">⎘</div>
            </div>
            <div class="onboarding-feature">
              <div class="onboarding-feature-icon">🔔</div>
              <div class="onboarding-feature-text"><strong>Уведомления</strong>Приходят сразу при новой записи</div>
            </div>
            <div class="onboarding-feature onboarding-feature-link"
                 onclick="OnboardingScreen.goScreen('dashboard')">
              <div class="onboarding-feature-icon">📊</div>
              <div class="onboarding-feature-text"><strong>Статистика</strong>Отслеживайте доход и записи</div>
              <div class="onboarding-arrow">›</div>
            </div>
          </div>

        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.showMainButton('Начать работу', () => {
      TelegramAPI.hapticMedium();
      MASTER_ONBOARDING_DONE = true;
      Router.goRoot('dashboard');
    });

    // Кнопка «Назад» — переключиться в режим клиента
    TelegramAPI.showBackButton(() => {
      TelegramAPI.hapticLight();
      App.switchMode('client');
    });
  },

  goScreen(screenName) {
    TelegramAPI.hapticLight();
    Router.push(screenName, null);
  },

  copyLink() {
    TelegramAPI.hapticLight();
    if (navigator.clipboard) {
      navigator.clipboard.writeText('t.me/anna_beauty_bot').then(() => {
        App.showSnackbar('Ссылка скопирована!');
      });
    } else {
      App.showSnackbar('t.me/anna_beauty_bot');
    }
  },
};

Router.register('onboarding', OnboardingScreen);
