import chalk from 'chalk'

import type { PackageChoice } from '../types'

/**
 * Builds an inquirer-compatible choice entry for a generated package name,
 * pairing the raw name (used as the choice value) with a colored label that
 * surfaces its availability status.
 *
 * @param {string} packageName The npm package name to render as a choice.
 * @param {boolean} isAvailable Whether the name is currently available on npm.
 * @returns {PackageChoice} `{ name, value }` suitable for an inquirer list prompt.
 */
export const buildPackageChoice = (
  packageName: string,
  isAvailable: boolean
): PackageChoice => {
  const statusLabel: string = isAvailable
    ? chalk.green('(available)')
    : chalk.red('(taken)')

  return {
    name: `${packageName} ${statusLabel}`,
    value: packageName
  }
}
