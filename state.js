/* =========================================================
   STATE (fuente única de verdad)
========================================================= */

// Audio
export let audioContext = null;
export let masterGain = null;

// Constantes
export const FUNDAMENTAL = 32.703;

// Buffers de audio / UI
export const gains = [];
export const bars = [];

// Estado por grupo
export const activeByGroup = Array.from({ length: 8 }, () => new Set());
export const soundingByGroup = Array.from({ length: 8 }, () => new Set());
export const activatedByGroup = Array(8).fill(0);

/* =========================================================
   SETTERS CONTROLADOS (evitar duplicar AudioContext)
========================================================= */

export function setAudioContext(ctx) {
  audioContext = ctx;
}

export function setMasterGain(gain) {
  masterGain = gain;
}
