// Данные карточек: 8 котов, каждый встречается дважды.
// Поле `nickname` используется как alt и как подпись на открытой карточке.

const BASE = import.meta.env.BASE_URL;

export const CARD_DATA = [
  { id: 'cat-1', image: `${BASE}images/cards/cat-1.webp`, nickname: 'Мурка' },
  { id: 'cat-2', image: `${BASE}images/cards/cat-2.webp`, nickname: 'Энви' },
  { id: 'cat-3', image: `${BASE}images/cards/cat-3.webp`, nickname: 'Мячик' },
  { id: 'cat-4', image: `${BASE}images/cards/cat-4.webp`, nickname: 'Вангоша' },
  { id: 'cat-5', image: `${BASE}images/cards/cat-5.webp`, nickname: 'Миссис Мяу' },
  { id: 'cat-6', image: `${BASE}images/cards/cat-6.webp`, nickname: 'Эби' },
  { id: 'cat-7', image: `${BASE}images/cards/cat-7.webp`, nickname: 'Шива' },
  { id: 'cat-8', image: `${BASE}images/cards/cat-8.webp`, nickname: 'Пряник' },
];
// Перемешивание Фишера — Йетса. Возвращает новый массив.
export function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// Собирает колоду из 16 карточек (каждая пара дважды) и перемешивает.
export function buildDeck() {
  const doubled = CARD_DATA.flatMap((card) => [
    { ...card, uid: `${card.id}-a` },
    { ...card, uid: `${card.id}-b` },
  ]);

  return shuffle(doubled);
}