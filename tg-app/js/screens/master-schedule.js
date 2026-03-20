/**
 * master-schedule.js — Расписание мастера
 */

const MasterScheduleScreen = {
  render() {
    const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

    const daysHTML = DAY_ORDER.map(dayNum => {
      const day = MASTER_SCHEDULE[dayNum];
      const isEnabled = day.enabled;

      return `
        <div class="schedule-day ${isEnabled ? '' : 'disabled'}" id="schedule-day-${dayNum}">
          <div class="schedule-day-header">
            <div class="schedule-day-name">${day.label}</div>
            <label class="schedule-toggle">
              <input type="checkbox" ${isEnabled ? 'checked' : ''}
                     onchange="MasterScheduleScreen.toggleDay(${dayNum}, this.checked)">
              <div class="toggle-track"></div>
              <div class="toggle-thumb"></div>
            </label>
          </div>
          <div class="schedule-hours">
            <span>С</span>
            <input class="schedule-time-input" type="time" value="${day.start}"
                   onchange="MasterScheduleScreen.updateTime(${dayNum}, 'start', this.value)"
                   ${isEnabled ? '' : 'disabled'}>
            <span>до</span>
            <input class="schedule-time-input" type="time" value="${day.end}"
                   onchange="MasterScheduleScreen.updateTime(${dayNum}, 'end', this.value)"
                   ${isEnabled ? '' : 'disabled'}>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="screen pb-main-btn">
        <div class="schedule-screen">
          <div class="page-title">Расписание</div>
          ${daysHTML}
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.showMainButton('Сохранить расписание', () => {
      TelegramAPI.hapticSuccess();
      TelegramAPI.showMainButtonProgress();
      setTimeout(() => {
        TelegramAPI.hideMainButtonProgress();
        Router.pop();
        App.showSnackbar('Расписание сохранено ✓');
      }, 400);
    });
  },

  toggleDay(dayNum, enabled) {
    TelegramAPI.hapticLight();
    MASTER_SCHEDULE[dayNum].enabled = enabled;
    const dayEl = document.getElementById(`schedule-day-${dayNum}`);
    dayEl.classList.toggle('disabled', !enabled);
    dayEl.querySelectorAll('.schedule-time-input').forEach(el => {
      el.disabled = !enabled;
    });
  },

  updateTime(dayNum, field, value) {
    MASTER_SCHEDULE[dayNum][field] = value;
  },
};

Router.register('master-schedule', MasterScheduleScreen);
