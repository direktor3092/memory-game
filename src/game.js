import { state, resetState } from './state.js';
import { updateCounters, renderCards } from './ui.js';
import { createModal } from './modal.js';
import { el } from './dom.js';
import { saveResult } from './storage.js';
import { buildDeck } from './cards.js';
import { playSound, stopBackground, startBackground } from './audio.js';

let winModal = null;
let gameContext = null;

export function initGame({ board, counters, newGameBtn }) {
  gameContext = { board, counters };

  board.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    handleCardClick(card, counters);
  });

  newGameBtn.addEventListener('click', startNewGame);
}

// Начинает новую игру: отменяет таймер, закрывает модалку, сбрасывает всё.
export function startNewGame() {
  if (!gameContext) return;
  const { board, counters } = gameContext;

  // 1. Отменяем таймер закрытия несовпавшей пары.
  if (state.closeTimer) {
    clearTimeout(state.closeTimer);
    state.closeTimer = null;
  }

  // 2. Закрываем модалку победы, если открыта.
  if (winModal) winModal.close();

  // 3. Сбрасываем состояние.
  resetState();

  // 4. Обновляем счётчики на странице.
  updateCounters(state, counters);

  // 5. Перемешиваем и перерисовываем поле.
  const deck = buildDeck();
  renderCards(board, deck);
  startBackground();
}

function handleCardClick(card, counters) {
  if (state.isLocked || state.gameOver) return;
  if (card.classList.contains('card--open')) return;
  if (card.classList.contains('card--matched')) return;

  card.classList.add('card--open');
  playSound('flip');

  if (!state.firstCard) {
    state.firstCard = card;
    return;
  }

  state.moves += 1;
  updateCounters(state, counters);

  const firstCard = state.firstCard;
  state.firstCard = null;
  state.isLocked = true;

  const finishPair = () => {
    if (firstCard.dataset.id === card.dataset.id) {
      handleMatch(firstCard, card, counters);
    } else {
      handleMismatch(firstCard, card, counters);
    }
  };

  // Если анимации отключены системно — transitionend не сработает.
  // Проверяем медиа-запрос и, если нужно, вызываем логику сразу.
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion) {
    finishPair();
    return;
  }

  const inner = card.querySelector('.card__inner');

  const onFlipEnd = (event) => {
    if (event.propertyName !== 'transform') return;
    inner.removeEventListener('transitionend', onFlipEnd);
    finishPair();
  };

  inner.addEventListener('transitionend', onFlipEnd);
}

function handleMatch(card1, card2, counters) {
  card1.classList.add('card--matched');
  card2.classList.add('card--matched');

  state.matched += 1;
  playSound('match');
  state.isLocked = false;

  updateCounters(state, counters);

  if (state.matched === 8) {
    state.gameOver = true;

    saveResult({
      moves: state.moves,
      date: new Date().toISOString(),
    });
    playSound('win');
    stopBackground();
    showWinModal();
  }
}

function handleMismatch(card1, card2, counters) {
  playSound('mismatch');
  state.closeTimer = setTimeout(() => {
    card1.classList.remove('card--open');
    card2.classList.remove('card--open');
    state.closeTimer = null;
    state.isLocked = false;
    updateCounters(state, counters);
  }, 1000);
}

function showWinModal() {
  if (!winModal) {
    winModal = createModal({ title: 'Победа!' });
  }

  const catImage = el('img', {
    className: 'win__cat',
    src: '/images/logo.webp',
    alt: '',
  });

  const text = el('p', {
    textContent: `Ты нашёл все пары за ${state.moves} ходов!`,
  });

  winModal.setBody([catImage, text]);

  const newGameBtn = el('button', {
    className: 'button button--primary',
    type: 'button',
    textContent: 'Новая игра',
    onClick: () => startNewGame(),
  });

  const closeBtn = el('button', {
    className: 'button',
    type: 'button',
    textContent: 'Закрыть',
    onClick: () => winModal.close(),
  });

  winModal.setActions([newGameBtn, closeBtn]);
  winModal.open();
}