/* =========================================================
   AUDIO ENGINE
========================================================= */

import {
  audioContext,
  masterGain,
  FUNDAMENTAL,
  gains,
  bars,
  activeByGroup,
  soundingByGroup,
  activatedByGroup
} from './state.js';

/* =========================================================
   CREATE OSCILLATORS + UI
========================================================= */

export function createOscillators() {
  if (!audioContext || !masterGain) {
    throw new Error("AudioContext no inicializado");
  }

  const container = document.getElementById("bars");

  const groupContainers = [];

  for (let g = 0; g < 8; g++) {
    const group = document.createElement("div");

    group.style.height = "12.5vh";
    group.style.display = "flex";
    group.style.flexDirection = "column";

    container.appendChild(group);
    groupContainers.push(group);
  }

  for (let n = 1; n <= 255; n++) {

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const g = Math.floor(Math.log2(n));

    osc.type = "sine";
    osc.frequency.value = FUNDAMENTAL * n;

    gain.gain.value = 0;

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start();

    gains[n] = gain;

    /* ===== UI ===== */

    const row = document.createElement("div");
    row.className = "row";

    const groupSize = 2 ** g;

    row.style.height = `${100 / groupSize}%`;

    const track = document.createElement("div");
    track.className = "track";

    const bar = document.createElement("div");
    bar.className = "bar";

    if (g % 2 === 1) {
      bar.style.background = "red";
    }

    track.appendChild(bar);
    row.appendChild(track);

    groupContainers[g].appendChild(row);

    bars[n] = bar;
  }
}

/* =========================================================
   ENVELOPE / TRIGGER
========================================================= */

export function triggerOsc(n, g, delay = 0) {

  if (!audioContext) return;

  const gain = gains[n];
  if (!gain) return;

  const amp = 1 / n;
  const t = audioContext.currentTime + delay;

  activeByGroup[g].add(n);

  gain.gain.cancelScheduledValues(t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(amp, t + 4);
  gain.gain.linearRampToValueAtTime(0, t + 8);

  /* ===== empieza a sonar ===== */

  setTimeout(() => {

    soundingByGroup[g].add(n);

    activatedByGroup[g]++;

    const el = document.getElementById(`g${g + 1}Activated`);
    if (el) el.textContent = activatedByGroup[g];

  }, delay * 1000);

  /* ===== deja de sonar ===== */

  setTimeout(() => {

    soundingByGroup[g].delete(n);
    activeByGroup[g].delete(n);

  }, (delay + 8) * 1000);
}
