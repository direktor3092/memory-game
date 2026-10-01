import './styles/main.css';
import { buildDeck } from './cards.js';
import { renderApp } from './ui.js';
import { initGame } from './game.js';

const deck = buildDeck();
const { board, counters } = renderApp(deck);
initGame({ board, counters });