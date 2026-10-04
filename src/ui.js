import { el } from './dom.js';

// Создаёт контейнер приложения и наполняет его.
// Возвращает ссылки на важные узлы — их будем обновлять в game.js.
export function renderApp(deck) {
  const header = createHeader();
  const counters = createCounters();
  const board = createBoard(deck);

  const app = el('div', { className: 'app' }, [
    header.element,
    counters.container,
    board,
  ]);
  document.body.append(app);

  return {
    board,
    counters,
    newGameBtn: header.newGameBtn,
    leaderboardBtn: header.leaderboardBtn,
    muteBtn: header.muteBtn,
  };
}

// Шапка: заголовок и две кнопки. Обработчики вешает main.js.
function createHeader() {
  const newGameBtn = el('button', {
    className: 'button button--primary',
    type: 'button',
    textContent: 'Новая игра',
  });

  const leaderboardBtn = el('button', {
    className: 'button',
    type: 'button',
    textContent: 'Таблица лидеров',
  });

  const muteBtn = el('button', {
    className: 'button button--icon',
    type: 'button',
    textContent: '🔊',
    'aria-label': 'Выключить звук',
  });

  const title = el('h1', { className: 'header__title', textContent: 'Котячья память' });

  const element = el('header', { className: 'header' }, [
    title,
    el('nav', { className: 'header__nav' }, [newGameBtn, leaderboardBtn, muteBtn]),  // ← muteBtn тут
  ]);

  return { element, newGameBtn, leaderboardBtn, muteBtn };  // ← и тут
}

// Счётчики ходов и найденных пар.
function createCounters() {
  const movesValue = el('span', { className: 'counter__value', textContent: '0' });
  const matchedValue = el('span', { className: 'counter__value', textContent: '0' });

  const moves = el('div', { className: 'counter' }, [
    el('span', { className: 'counter__label', textContent: 'Ходы:' }),
    movesValue,
  ]);

  const matched = el('div', { className: 'counter' }, [
    el('span', { className: 'counter__label', textContent: 'Пары:' }),
    matchedValue,
    el('span', { className: 'counter__label', textContent: '/ 8' }),
  ]);

  const container = el('div', { className: 'counters' }, [moves, matched]);

  return { container, movesValue, matchedValue };
}

// Игровое поле 4×4.
function createBoard(deck) {
  const board = el('main', { className: 'board' });
  renderCards(board, deck);
  return board;
}

// Перерисовывает карточки внутри контейнера.
export function renderCards(container, deck) {
  const cards = deck.map(createCard);
  container.replaceChildren(...cards);
}

// Одна карточка: рубашка + лицевая сторона.
function createCard(card) {
  const back = el('div', { className: 'card__face card__face--back' });

  const front = el('div', { className: 'card__face card__face--front' }, [
    el('img', {
      className: 'card__img',
      src: card.image,
      alt: card.nickname,
    }),
    el('span', { className: 'card__nickname', textContent: card.nickname }),
  ]);

  return el(
    'button',
    {
      className: 'card',
      type: 'button',
      'data-uid': card.uid,
      'data-id': card.id,
      'aria-label': 'Открыть карточку',
    },
    [el('div', { className: 'card__inner' }, [back, front])]
  );
}

// Обновляет значения счётчиков.
export function updateCounters({ moves, matched }, counters) {
  counters.movesValue.textContent = String(moves);
  counters.matchedValue.textContent = String(matched);
}

export function updateMuteButton(muteBtn, muted) {
  muteBtn.textContent = muted ? '🔇' : '🔊';
  muteBtn.setAttribute('aria-label', muted ? 'Включить звук' : 'Выключить звук');
}