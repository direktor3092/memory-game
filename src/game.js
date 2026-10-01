import { state } from './state.js';
import { updateCounters } from './ui.js';

// Привязывает игровую логику к уже отрисованному интерфейсу.
export function initGame({ board, counters }) {
  board.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    handleCardClick(card, counters);
  });
}

// Обрабатывает клик по одной карточке.
function handleCardClick(card, counters) {
  if (state.isLocked) return;
  if (state.gameOver) return;
  if (card.classList.contains('card--open')) return;
  if (card.classList.contains('card--matched')) return;

  // Переворачиваем карточку.
  card.classList.add('card--open');

  // Первая карточка в паре — запоминаем и выходим.
  if (!state.firstCard) {
    state.firstCard = card;
    return;
  }

  // Вторая карточка — ход засчитан.
  state.moves += 1;
  updateCounters(state, counters);

  // Проверка совпадения — на следующем шаге.
  state.firstCard = null;
}