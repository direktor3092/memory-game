import { el } from './dom.js';
import { createModal } from './modal.js';
import { getResults, formatDate } from './storage.js';

let modal = null;

export function openLeaderboard() {
  if (!modal) {
    modal = createModal({ title: 'Таблица лидеров' });
  }

  const results = getResults();

  if (results.length === 0) {
    modal.setBody(
      el('p', {
        className: 'leaderboard__empty',
        textContent: 'Пока нет результатов',
      })
    );
  } else {
    modal.setBody(createTable(results));
  }

  const closeBtn = el('button', {
    className: 'button',
    type: 'button',
    textContent: 'Закрыть',
    onClick: () => modal.close(),
  });

  modal.setActions([closeBtn]);
  modal.open();
}

function createTable(results) {
  const rows = results.map((result, index) => {
    return el('tr', { className: 'leaderboard__row' }, [
      el('td', { className: 'leaderboard__cell leaderboard__cell--place', textContent: String(index + 1) }),
      el('td', { className: 'leaderboard__cell', textContent: String(result.moves) }),
      el('td', { className: 'leaderboard__cell', textContent: formatDate(result.date) }),
    ]);
  });

  const thead = el('thead', {}, [
    el('tr', {}, [
      el('th', { className: 'leaderboard__head', textContent: '#' }),
      el('th', { className: 'leaderboard__head', textContent: 'Ходы' }),
      el('th', { className: 'leaderboard__head', textContent: 'Дата' }),
    ]),
  ]);

  const tbody = el('tbody', {}, rows);
  const table = el('table', { className: 'leaderboard__table' }, [thead, tbody]);

  return table;
}