/**
 * service-edit.js — Форма добавления / редактирования услуги
 */

const ServiceEditScreen = {
  render(data) {
    const s = data?.service;
    const isNew = data?.isNew ?? true;

    return `
      <div class="screen pb-main-btn">
        <div class="service-edit-screen">
          <div class="page-title">${isNew ? 'Новая услуга' : 'Редактировать'}</div>

          <!-- Фото-заглушка -->
          <div class="photo-placeholder" style="margin-bottom:20px">
            <div class="photo-icon">📷</div>
            <div>Нажмите, чтобы добавить фото</div>
          </div>

          <div class="form-group">
            <label class="form-label">Название</label>
            <input class="form-input" id="edit-title" type="text"
                   placeholder="Маникюр с гель-лаком"
                   value="${s?.title || ''}">
          </div>

          <div class="form-group">
            <label class="form-label">Краткое описание</label>
            <input class="form-input" id="edit-short-desc" type="text"
                   placeholder="Аппаратная обработка кутикулы + стойкое покрытие"
                   value="${s?.shortDesc || ''}">
          </div>

          <div class="form-group">
            <label class="form-label">Полное описание</label>
            <textarea class="form-textarea" id="edit-full-desc"
                      placeholder="Подробное описание услуги...">${s?.fullDesc || ''}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Цена (₽)</label>
              <input class="form-input" id="edit-price" type="number"
                     placeholder="2000" value="${s?.price || ''}">
            </div>
            <div class="form-group">
              <label class="form-label">Длительность (мин)</label>
              <input class="form-input" id="edit-duration" type="number"
                     placeholder="90" value="${s?.duration || ''}">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Категория</label>
            <select class="form-input" id="edit-category">
              ${CATEGORIES.filter(c => c.id !== 'all').map(c => `
                <option value="${c.id}" ${s?.category === c.id ? 'selected' : ''}>${c.label}</option>
              `).join('')}
            </select>
          </div>

        </div>
      </div>
    `;
  },

  init(data) {
    TelegramAPI.showMainButton(
      data?.isNew ? 'Добавить услугу' : 'Сохранить',
      () => this.save(data)
    );
  },

  save(data) {
    const title    = document.getElementById('edit-title').value.trim();
    const price    = parseInt(document.getElementById('edit-price').value);
    const duration = parseInt(document.getElementById('edit-duration').value);

    if (!title || !price || !duration) {
      TelegramAPI.showAlert('Заполните название, цену и длительность');
      TelegramAPI.hapticError();
      return;
    }

    TelegramAPI.hapticSuccess();
    TelegramAPI.showMainButtonProgress();

    setTimeout(() => {
      if (data?.isNew) {
        SERVICES.push({
          id:            Date.now(),
          category:      document.getElementById('edit-category').value,
          emoji:         '✨',
          photoGradient: 'linear-gradient(135deg, #f3e5f5, #ce93d8)',
          title,
          shortDesc:     document.getElementById('edit-short-desc').value.trim(),
          fullDesc:      document.getElementById('edit-full-desc').value.trim(),
          duration,
          price,
          priceFrom:     false,
        });
      } else {
        const s = SERVICES.find(s => s.id === data.service.id);
        if (s) {
          s.title     = title;
          s.price     = price;
          s.duration  = duration;
          s.shortDesc = document.getElementById('edit-short-desc').value.trim();
          s.fullDesc  = document.getElementById('edit-full-desc').value.trim();
          s.category  = document.getElementById('edit-category').value;
        }
      }

      TelegramAPI.hideMainButtonProgress();
      Router.pop();
      App.showSnackbar(data?.isNew ? 'Услуга добавлена' : 'Изменения сохранены');
    }, 400);
  },
};

Router.register('service-edit', ServiceEditScreen);
