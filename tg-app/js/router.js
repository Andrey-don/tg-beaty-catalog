/**
 * router.js — Роутер приложения
 *
 * Управляет стеком экранов, анимациями переходов,
 * BackButton. Каждый экран регистрирует себя через
 * Router.register(name, screenObject).
 */

const Router = {

  /** Стек навигации: [{name, data}, ...] */
  stack: [],

  /** Реестр экранов */
  _registry: {},

  /**
   * Регистрирует экран в роутере.
   * Вызывается в конце каждого screen-файла.
   */
  register(name, screen) {
    this._registry[name] = screen;
  },

  /** Переход вперёд — добавляет экран в стек */
  push(name, data, animate = true) {
    this.stack.push({ name, data });
    this._show(name, data, animate, 'push');
  },

  /** Назад — удаляет верхний экран из стека */
  pop() {
    if (this.stack.length <= 1) return;
    this.stack.pop();
    const prev = this.stack[this.stack.length - 1];
    this._show(prev.name, prev.data, true, 'pop');
  },

  /** Заменяет текущий экран без добавления в стек */
  replace(name, data) {
    if (this.stack.length > 0) {
      this.stack[this.stack.length - 1] = { name, data };
    } else {
      this.stack.push({ name, data });
    }
    this._show(name, data, true, 'push');
  },

  /** Сбрасывает стек и переходит на корневой экран */
  goRoot(name, data = null) {
    this.stack = [{ name, data }];
    this._show(name, data, true, 'pop');
  },

  /** Рендерит экран и управляет BackButton */
  _show(name, data, animate, direction) {
    const screen = this._registry[name];
    if (!screen) {
      console.error('[Router] Экран не найден:', name);
      return;
    }

    const container = document.getElementById('screen-container');
    container.innerHTML = screen.render(data);

    // Анимация перехода
    const el = container.querySelector('.screen');
    if (el && animate) {
      el.classList.add(direction === 'pop' ? 'screen-enter-back' : 'screen-enter');
    }

    // Инициализация экрана (кнопки, события)
    screen.init?.(data);

    // BackButton
    const isRoot = this.stack.length <= 1;
    if (isRoot) {
      // В мастер-режиме на корневом экране — кнопка «Назад» переключает в клиент
      if (typeof App !== 'undefined' && App.mode === 'master') {
        TelegramAPI.showBackButton(() => {
          TelegramAPI.hapticLight();
          App.switchMode('client');
        });
      } else {
        TelegramAPI.hideBackButton();
      }
    } else {
      TelegramAPI.showBackButton(() => {
        TelegramAPI.hapticLight();
        this.pop();
      });
    }
  },
};
