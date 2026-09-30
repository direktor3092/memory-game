/**
 * Глобальное состояние игры.
 * Все модули импортируют этот объект и меняют его поля.
 */
export const state = {
  moves: 0,               // число ходов
  matched: 0,             // число найденных пар
  firstCard: null,        // DOM-элемент первой открытой карточки
  isLocked: false,        // блокировка кликов (пока пара не закрылась)
  gameOver: false,        // игра завершена
  closeTimer: null,       // id таймера закрытия несовпавшей пары
  consecutiveMisses: 0,   // промахи подряд (для куклы-скримера)
};

/**
 * Сбрасывает состояние к началу новой игры.
 * Отменяет активный таймер, если он был.
 */
export function resetState() {
  if (state.closeTimer) {
    clearTimeout(state.closeTimer);
    state.closeTimer = null;
  }

  state.moves = 0;
  state.matched = 0;
  state.firstCard = null;
  state.isLocked = false;
  state.gameOver = false;
  state.consecutiveMisses = 0;
}