const STORAGE_KEY = 'memory-game-leaderboard';
const MAX_RESULTS = 10;

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


export function saveResult(result) {
  const results = getResults();
  results.push(result);

  results.sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return new Date(a.date) - new Date(b.date);
  });

  const top = results.slice(0, MAX_RESULTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(top));

  return top;
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}