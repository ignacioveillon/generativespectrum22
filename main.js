/* =========================================================
   MAIN
========================================================= */

import {
  setAudioContext,
  setMasterGain,
  activeByGroup,
  soundingByGroup,
  activatedByGroup
} from './state.js';

import {
  groups,
  combinations
} from './groups.js';

import {
  createOscillators,
  triggerOsc
} from './audio.js';

import {
  updateUI
} from './ui.js';

/* =========================================================
   START BUTTON
========================================================= */

document.getElementById("start").onclick = async () => {

  document.getElementById("start").remove();

  const ctx = new AudioContext();
  await ctx.resume();

  const master = ctx.createGain();
  master.gain.value = 0.25;
  master.connect(ctx.destination);

  setAudioContext(ctx);
  setMasterGain(master);

  createOscillators();
  updateUI();
  startCycle();
};

/* =========================================================
   MAIN CYCLE
========================================================= */

async function startCycle() {

  while (true) {

    /* ===== reset activaciones ===== */
    for (let g = 0; g < 8; g++) {
      activatedByGroup[g] = 0;

      const el = document.getElementById(`g${g + 1}Activated`);
      if (el) el.textContent = 0;
    }

    /* ===== combinación aleatoria ===== */
    const combo =
      combinations[Math.floor(Math.random() * combinations.length)];

    /* ===== limpiar estado ===== */
    for (let g = 0; g < 8; g++) {
      activeByGroup[g].clear();
      soundingByGroup[g].clear();
    }

    /* ===== UI estado grupos ===== */
    for (let g = 0; g < 8; g++) {
      const el = document.getElementById(`g${g + 1}State`);
      if (!el) continue;

      el.textContent = combo.includes(g) ? "1" : "0";
    }

    /* ===== selección de osciladores ===== */
    let selected = [];
    const oscCountByGroup = Array(8).fill(0);

    combo.forEach(g => {

      const list = [...groups[g].indices];
      const k = 1 + Math.floor(Math.random() * list.length);

      oscCountByGroup[g] = k;

      list.sort(() => Math.random() - 0.5);

      selected.push(
        ...list.slice(0, k).map(n => ({ n, g }))
      );
    });

    /* ===== UI counts ===== */
    for (let g = 0; g < 8; g++) {
      const el = document.getElementById(`g${g + 1}Count`);
      if (!el) continue;

      el.textContent = combo.includes(g) ? oscCountByGroup[g] : 0;
    }

    /* ===== shuffle ===== */
    selected.sort(() => Math.random() - 0.5);

    /* ===== trigger audio ===== */
    for (const { n, g } of selected) {
      triggerOsc(
        n,
        g,
        Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 8)
      );
    }

    /* ===== esperar fin de actividad ===== */
    await new Promise(resolve => {
      const check = () => {
        const anyActive = activeByGroup.some(set => set.size > 0);

        if (!anyActive) resolve();
        else setTimeout(check, 50);
      };

      check();
    });
  }
}
