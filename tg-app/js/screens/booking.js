/**
 * booking.js — Выбор даты и времени
 */

const BookingScreen = {
  dates: [],
  selectedDateIndex: 0,
  selectedTime: null,

  render() {
    this.dates = getAvailableDates();
    this.selectedTime = null;

    const datesHTML = this.dates.map((date, index) => {
      const slots = generateSlots(date);
      const hasSlots = slots.some(s => !s.busy);
      return `
        <button class="date-chip ${index === 0 ? 'active' : ''}"
                onclick="BookingScreen.selectDate(${index})">
          <span class="date-day-name">${DAY_NAMES_SHORT[date.getDay()]}</span>
          <span class="date-day-num">${date.getDate()}</span>
          ${hasSlots ? '<span class="date-has-slots">●</span>' : ''}
        </button>
      `;
    }).join('');

    return `
      <div class="screen pb-main-btn">
        <div class="step-indicator">Шаг 1 из 2</div>

        <div class="dates-scroll">
          <div class="dates-inner">${datesHTML}</div>
        </div>

        <div class="section-title">Доступное время</div>

        <div class="time-slots-grid" id="slots-grid">
          ${this._renderSlots(0)}
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

    document.querySelectorAll('.date-chip').forEach((el, i) => {
      el.classList.toggle('active', i === index);
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
