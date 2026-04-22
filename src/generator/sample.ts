/**
 * Returns a uniformly random element from `items` using `Math.random`.
 * Intended for non-cryptographic use. Callers must ensure `items` is
 * non-empty; an empty array yields `undefined` cast as `T`.
 *
 * @template T
 * @param {T[]} items The array to sample from.
 * @returns {T} One randomly chosen element.
 */
export const sample = <T>(items: T[]): T =>
  items[Math.floor(Math.random() * items.length)]
