import './styles/main.css';
import { buildDeck } from './cards.js';
import { renderApp } from './ui.js';
import { initGame } from './game.js';
import { openLeaderboard } from './leaderboard.js';

const deck = buildDeck();
const { board, counters, newGameBtn, leaderboardBtn } = renderApp(deck);

initGame({ board, counters, newGameBtn });
leaderboardBtn.addEventListener('click', openLeaderboard);