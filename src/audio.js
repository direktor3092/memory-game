// Управление звуками и фоновой музыкой.
const BASE = import.meta.env.BASE_URL;

const SOUND_PATHS = {
  flip: `${BASE}sounds/flip.mp3`,
  match: `${BASE}sounds/match.mp3`,
  mismatch: `${BASE}sounds/mismatch.mp3`,
  win: `${BASE}sounds/win.mp3`,
};

const BG_PATH = `${BASE}sounds/background.mp3`;
const MUTE_KEY = 'memory-game-muted';

let muted = false;
let background = null;
let backgroundStarted = false;
const sounds = {};

export function initAudio() {
  for (const [name, src] of Object.entries(SOUND_PATHS)) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.volume = name === 'win' ? 0.7 : 0.5;
    sounds[name] = audio;
  }

  background = new Audio(BG_PATH);
  background.loop = true;
  background.volume = 0.25;
  background.preload = 'auto';

  muted = localStorage.getItem(MUTE_KEY) === 'true';
}

// Короткий звук. Если уже играет — перезапускает.
export function playSound(name) {
  if (muted) return;
  const audio = sounds[name];
  if (!audio) return;

  try {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } catch {
    // тихо игнорируем — файл ещё не загрузился и т.п.
  }
}

// Запуск фоновой музыки. Вызывать только после действия пользователя.
export function startBackground() {
  if (muted || !background || backgroundStarted) return;
  backgroundStarted = true;
  background.play().catch(() => {});
}

export function stopBackground() {
  if (!background) return;
  background.pause();
  background.currentTime = 0;
  backgroundStarted = false;
}

export function toggleMute() {
  muted = !muted;
  localStorage.setItem(MUTE_KEY, String(muted));

  if (muted) {
    stopBackground();
  } else if (background && background.paused) {
    backgroundStarted = false;
    startBackground();
  }

  return muted;
}

export function isMuted() {
  return muted;
}