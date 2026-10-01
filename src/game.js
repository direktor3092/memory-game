import { state } from './state.js';
import { updateCounters } from './ui.js';

// Сколько миллисекунд показываем несовпавшую пару.
const MISMATCH_DELAY = 1000;

export function initGame({ board, counters }) {
  board.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    handleCardClick(card, counters);
  });
}

function handleCardClick(card, counters) {
  if (state.isLocked) return;
  if (state.gameOver) return;
  if (card.classList.contains('card--open')) return;
  if (card.classList.contains('card--matched')) return;

  card.classList.add('card--open');

  // Первая карточка в паре — запоминаем и ждём вторую.
  if (!state.firstCard) {
    state.firstCard = card;
    return;
  }

  // Вторая карточка — ход засчитан.
  state.moves += 1;
  updateCounters(state, counters);

  const first = state.firstCard;
  state.firstCard = null;

  if (first.dataset.id === card.dataset.id) {
    handleMatch(first, card, counters);
  } else {
    handleMismatch(first, card);
  }
}

// Совпадение: обе карточки помечаем как найденные и остаются открытыми.
function handleMatch(card1, card2, counters) {
  card1.classList.add('card--matched');
  card2.classList.add('card--matched');

  state.matched += 1;
  updateCounters(state, counters);

  if (state.matched === 8) {
    state.gameOver = true;
    // модалка победы — Шаг 10
  }
}

// Несовпадение: блокируем клики и закрываем обе карточки через задержку.
function handleMismatch(card1, card2) {
  state.isLocked = true;

  state.closeTimer = setTimeout(() => {
    card1.classList.remove('card--open');
    card2.classList.remove('card--open');
    state.isLocked = false;
    state.closeTimer = null;
  }, MISMATCH_DELAY);
}