import './styles/main.css';
import { buildDeck } from './cards.js';
import { renderApp } from './ui.js';

const deck = buildDeck();
renderApp(deck);