/**
 * booking.js — Выбор даты и времени
 */

const MONTH_NAMES = ['Январь','Февраль','Март','Апрель','Май','Июнь',
                     'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];

const BookingScreen = {
  dates: [],
  selectedDateIndex: 0,
  selectedTime: null,

  render() {
    this.dates = getAvailableDates();
    this.selectedTime = null;

    // Найти первый день, где есть свободные слоты
    const firstAvail = this.dates.findIndex(d => generateSlots(d).some(s => !s.busy));
    this.selectedDateIndex = firstAvail >= 0 ? firstAvail : 0;

    const first = this.dates[0];
    const last  = this.dates[this.dates.length - 1];
    const monthLabel = first.getMonth() === last.getMonth()
      ? `${MONTH_NAMES[first.getMonth()]} ${first.getFullYear()}`
      : `${MONTH_NAMES[first.getMonth()]} — ${MONTH_NAMES[last.getMonth()]} ${last.getFullYear()}`;

    // Смещение первой даты (неделя начинается с Пн: Пн=0 … Вс=6)
    const startOffset = (first.getDay() + 6) % 7;
    const emptyPad = Array(startOffset).fill('<div class="cal-day empty"></div>').join('');

    const dayHeaders = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']
      .map(d => `<div class="cal-header">${d}</div>`).join('');

    const dayCells = this.dates.map((date, index) => {
      const slots   = generateSlots(date);
      const hasFree = slots.some(s => !s.busy);
      const isDisabled = !hasFree;
      const isActive   = index === this.selectedDateIndex;
      const isSunday   = date.getDay() === 0;
      return `
        <button class="cal-day ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''} ${isSunday ? 'sunday' : ''}"
                data-idx="${index}"
                ${isDisabled ? 'disabled' : `onclick="BookingScreen.selectDate(${index})"`}>
          <span class="cal-day-num">${date.getDate()}</span>
          ${hasFree ? '<span class="cal-dot">●</span>' : ''}
        </button>
      `;
    }).join('');

    return `
      <div class="screen pb-main-btn">
        <div class="step-indicator">Шаг 1 из 2</div>

        <div class="cal-wrap">
          <div class="cal-month-label">${monthLabel}</div>
          <div class="cal-day-names">${dayHeaders}</div>
          <div class="cal-grid">
            ${emptyPad}
            ${dayCells}
          </div>
        </div>

        <div class="section-title">Доступное время</div>

        <div class="time-slots-grid" id="slots-grid">
          ${this._renderSlots(this.selectedDateIndex)}
        </div>

        <div class="booking-summary-bar" id="booking-summary-bar">
          <strong>${App.booking.service?.title || ''}</strong>
          <span id="selected-datetime-text">Выберите дату и время</span>
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.showMainButton('Продолжить', () => {
      TelegramAPI.hapticMedium();
      Router.push('summary', null);
    });
    TelegramAPI.disableMainButton();
  },

  _renderSlots(dateIndex) {
    const slots = generateSlots(this.dates[dateIndex]);
    if (!slots.length) {
      return '<div class="text-hint text-center" style="padding:20px;grid-column:span 3">Выходной день</div>';
    }
    return slots.map(slot => `
      <button class="time-slot ${slot.busy ? 'busy' : ''} ${this.selectedTime === slot.time ? 'selected' : ''}"
              ${slot.busy ? 'disabled' : `onclick="BookingScreen.selectTime('${slot.time}')"`}>
        ${slot.time}
      </button>
    `).join('');
  },

  selectDate(index) {
    TelegramAPI.hapticLight();
    this.selectedDateIndex = index;
    this.selectedTime = null;

    document.querySelectorAll('.cal-day[data-idx]').forEach(el => {
      el.classList.toggle('active', parseInt(el.dataset.idx) === index);
    });
    document.getElementById('slots-grid').innerHTML = this._renderSlots(index);
    document.getElementById('selected-datetime-text').textContent = 'Выберите время';
    TelegramAPI.disableMainButton();

    App.booking.date = this.dates[index];
    App.booking.time = null;
  },

  selectTime(time) {
    TelegramAPI.hapticLight();
    this.selectedTime = time;

    document.querySelectorAll('.time-slot').forEach(el => {
      el.classList.toggle('selected', el.textContent.trim() === time);
    });

    const date = this.dates[this.selectedDateIndex];
    App.booking.date = date;
    App.booking.time = time;
    document.getElementById('selected-datetime-text').textContent =
      `${formatDate(date)} · ${time}`;

    TelegramAPI.enableMainButton();
  },
};

Router.register('booking', BookingScreen);
