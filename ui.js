/* =========================================================
   UI
========================================================= */

import {
  gains,
  bars,
  soundingByGroup
} from './state.js';

/* =========================================================
   UPDATE UI LOOP
========================================================= */

export function updateUI() {

  renderBars();
  renderGroupActivity();

  requestAnimationFrame(updateUI);
}

/* =========================================================
   BARS VISUALIZATION
========================================================= */

function renderBars() {
  for (let n = 1; n <= 255; n++) {

    const gainNode = gains[n];
    const bar = bars[n];

    if (!gainNode || !bar) continue;

    const value = gainNode.gain.value;

    bar.style.width = `${value * 100}%`;
  }
}

/* =========================================================
   GROUP ACTIVITY DISPLAY
========================================================= */

function renderGroupActivity() {
  for (let g = 0; g < 8; g++) {

    const el = document.getElementById(`g${g + 1}Active`);
    if (!el) continue;

    el.textContent = soundingByGroup[g].size;
  }
}
