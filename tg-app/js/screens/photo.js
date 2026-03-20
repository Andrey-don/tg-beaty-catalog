/**
 * photo.js — Просмотр фото (полноэкранная галерея)
 */

const PhotoScreen = {
  render(item) {
    const gradient = item?.photoGradient || item?.gradient || '#f0f0f0';
    const emoji    = item?.emoji || '💅';
    const title    = item?.title || item?.shortDesc || '';

    return `
      <div class="screen" style="background:#000">
        <div class="photo-viewer" style="background: ${gradient}">
          <span style="font-size:120px">${emoji}</span>
          ${title ? `<div class="photo-viewer-title">${title}</div>` : ''}
        </div>
      </div>
    `;
  },

  init() {
    TelegramAPI.hideMainButton();
  },
};

Router.register('photo', PhotoScreen);
