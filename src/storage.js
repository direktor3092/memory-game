const STORAGE_KEY = 'memory-game-leaderboard';
const MAX_RESULTS = 10;

// Возвращает массив результатов из localStorage.
// Если данных нет или они повреждены — возвращает пустой массив.
export function getResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Добавляет результат и сохраняет топ-10.
// result: { moves: number, date: string (ISO), country?, isp?, vpn? }
export function saveResult(result) {
  const results = getResults();
  results.push(result);

  // Сортировка: меньше ходов → выше; при равенстве — раньше дата → выше.
  results.sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return new Date(a.date) - new Date(b.date);
  });

  const top = results.slice(0, MAX_RESULTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top));

  return top;
}

// Форматирует дату ISO в ДД.ММ.ГГГГ.
export function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}