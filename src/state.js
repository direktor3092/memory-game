export const state = {
  moves: 0,               
  matched: 0,             
  firstCard: null,        
  isLocked: false,        
  gameOver: false,        
  closeTimer: null,       
  consecutiveMisses: 0,   
};

export function resetState() {
  if (state.closeTimer) {
    clearTimeout(state.closeTimer);
    state.closeTimer = null;
  }

  state.moves = 0;
  state.matched = 0;
  state.firstCard = null;
  state.isLocked = false;
  state.gameOver = false;
  state.consecutiveMisses = 0;
}