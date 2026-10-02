import { state } from './state.js';
import { updateCounters } from './ui.js';
import { createModal } from './modal.js';
import { el } from './dom.js';

let winModal = null;

export function initGame({ board, counters }) {
  board.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    handleCardClick(card, counters);
  });
}

function handleCardClick(card, counters) {
  if (state.isLocked || state.gameOver) return;
  if (card.classList.contains('card--open')) return;
  if (card.classList.contains('card--matched')) return;

  card.classList.add('card--open');

  if (!state.firstCard) {
    state.firstCard = card;
    return;
  }

  state.moves += 1;
  updateCounters(state, counters);

  const firstCard = state.firstCard;
  state.firstCard = null;

  // Ждём, пока вторая карточка закончит переворот.
  // transitionend на .card__inner сработает, когда transform завершится.
  const inner = card.querySelector('.card__inner');

  const onFlipEnd = (event) => {
    // Игнорируем всплытие от других свойств (например, opacity).
    if (event.propertyName !== 'transform') return;
    inner.removeEventListener('transitionend', onFlipEnd);

    if (firstCard.dataset.id === card.dataset.id) {
      handleMatch(firstCard, card, counters);
    } else {
      handleMismatch(firstCard, card, counters);
    }
  };

  inner.addEventListener('transitionend', onFlipEnd);
}
function handleMatch(card1, card2, counters) {
  card1.classList.add('card--matched');
  card2.classList.add('card--matched');

  state.matched += 1;
  updateCounters(state, counters);

  if (state.matched === 8) {
    state.gameOver = true;
    showWinModal();
  }
}

function handleMismatch(card1, card2, counters) {
  state.isLocked = true;

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