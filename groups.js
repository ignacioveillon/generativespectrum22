/* =========================================================
   GROUPS (modelo matemático puro)
========================================================= */

// Construcción de grupos
let cursor = 1;

export const groups = [];

for (let i = 0; i < 8; i++) {
  const size = 2 ** i;

  groups.push({
    index: i,
    indices: Array.from({ length: size }, (_, k) => cursor + k)
  });

  cursor += size;
}

// Combinaciones posibles (1..255)
export const combinations = [];

for (let mask = 1; mask < 256; mask++) {
  const combo = [];

  for (let i = 0; i < 8; i++) {
    if (mask & (1 << i)) combo.push(i);
  }

  combinations.push(combo);
}
