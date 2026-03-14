/**
 * Mulberry32 PRNG — fast, high quality, seeded
 * Same seed always produces the same sequence.
 * RULE: All stochastic positioning MUST use this — never Math.random()
 */
export function seededRNG(seed: number): () => number {
  let s = seed;
  return function(): number {
    s += 0x6D2B79F5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Shuffle an array using seeded RNG */
export function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick a random element */
export function seededPick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}
