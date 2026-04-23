import chalk from 'chalk'

import type { GeneratedNameEntry } from '../types'

/**
 * Prints a batch of generated package names with their availability status.
 * Emits a JSON array when `asJson` is true, otherwise a colored, one-per-line
 * human-readable listing.
 *
 * @param {GeneratedNameEntry[]} entries Generated names, each paired with availability.
 * @param {boolean} asJson Whether to emit machine-readable JSON instead of prose.
 * @returns {void}
 */
export const printGeneratedNames = (
  entries: GeneratedNameEntry[],
  asJson: boolean
): void => {
  if (asJson) {
    console.log(JSON.stringify(entries, null, 2))
    return
  }

  for (const entry of entries) {
    const marker: string = entry.available
      ? chalk.green('available')
      : chalk.red('taken    ')

    console.log(`${marker}  ${entry.name}`)
  }
}
