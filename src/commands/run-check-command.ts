import chalk from 'chalk'

import { checkPackageAvailability } from '../npm/check-package-availability'

/**
 * Checks whether a single package name is available on npm and prints the
 * result. Emits JSON when `asJson` is true, otherwise a colored status line.
 *
 * @param {string} packageName The npm package name to check.
 * @param {boolean} asJson Whether to emit machine-readable JSON instead of prose.
 * @returns {Promise<number>} `0` when the package is available, `1` when taken.
 */
export const runCheckCommand = async (
  packageName: string,
  asJson: boolean
): Promise<number> => {
  const isAvailable: boolean = await checkPackageAvailability(packageName)

  if (asJson) {
    console.log(
      JSON.stringify({ name: packageName, available: isAvailable }, null, 2)
    )
  } else if (isAvailable) {
    console.log(chalk.green(`${packageName} is available`))
  } else {
    console.log(chalk.red(`${packageName} is taken`))
  }

  return isAvailable ? 0 : 1
}
