/* =========================================================
   UI
========================================================= */

import {
  gains,
  bars,
  soundingByGroup
} from './state.js';

/* =========================================================
   UPDATE UI
========================================================= */

export function updateUI() {

  /* ===== barras ===== */

  for (let n = 1; n <= 255; n++) {

    const gain = gains[n];

    const bar = bars[n];

    if (!gain || !bar) continue;

    const v = gain.gain.value;

    bar.style.width = `${v * 100}%`;
  }

  /* ===== osciladores activos ===== */

  for (let g = 0; g < 8; g++) {

    const el =
      document.getElementById(`g${g + 1}Active`);

    if (!el) continue;

    el.textContent =
      soundingByGroup[g].size;
  }

  requestAnimationFrame(updateUI);
}
