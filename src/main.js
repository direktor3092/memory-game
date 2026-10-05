import './styles/main.css';
import { buildDeck } from './cards.js';
import { renderApp, updateMuteButton } from './ui.js';
import { initGame } from './game.js';
import { openLeaderboard } from './leaderboard.js';
import { initAudio, startBackground, toggleMute, isMuted } from './audio.js';

initAudio();

const deck = buildDeck();
const { board, counters, newGameBtn, leaderboardBtn, muteBtn } = renderApp(deck);

updateMuteButton(muteBtn, isMuted());

initGame({ board, counters, newGameBtn });
leaderboardBtn.addEventListener('click', openLeaderboard);

// Фоновая музыка стартует после первого клика по странице.
document.addEventListener('click', startBackground, { once: true });

// Кнопка mute
muteBtn.addEventListener('click', () => {
  const newMuted = toggleMute();
  updateMuteButton(muteBtn, newMuted);
});
const winImage = new Image();
winImage.src = `${import.meta.env.BASE_URL}images/logo.webp`;