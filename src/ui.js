import { el } from './dom.js';

// Создаёт контейнер приложения и наполняет его.
// Возвращает ссылки на важные узлы — их будем обновлять в game.js.
export function renderApp(deck) {
  const header = createHeader();
  const counters = createCounters();
  const board = createBoard(deck);

  const app = el('div', { className: 'app' }, [
    header,
    counters.container,
    board,
  ]);
  document.body.append(app);

  return { board, counters };
}

// Шапка: заголовок и две кнопки. Обработчики пока пустые.
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

  const title = el('h1', { className: 'header__title', textContent: 'Котячья память' });

  return el('header', { className: 'header' }, [
    title,
    el('nav', { className: 'header__nav' }, [newGameBtn, leaderboardBtn]),
  ]);
}

// Счётчики ходов и найденных пар.
// Храним ссылки на span, чтобы потом менять только их текст.
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

// Игровое поле 4×4. Рендерит все 16 карточек рубашкой вверх.
function createBoard(deck) {
  const cards = deck.map(createCard);
  return el('main', { className: 'board' }, cards);
}

// Одна карточка: рубашка + лицевая сторона (фото + кличка).
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
    'div',
    {
      className: 'card',
      'data-uid': card.uid,
      'data-id': card.id,
    },
    [el('div', { className: 'card__inner' }, [back, front])]
  );
}

// Обновляет значения счётчиков на странице.
export function updateCounters({ moves, matched }, counters) {
  counters.movesValue.textContent = String(moves);
  counters.matchedValue.textContent = String(matched);
}