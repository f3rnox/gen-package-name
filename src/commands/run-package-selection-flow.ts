import chalk from 'chalk'

import type { CliOptions } from '../cli/cli-options'
import { fetchPackageInfo } from '../npm/fetch-package-info'
import { printPackageDetails } from '../ui/print-package-details'
import { selectPackageName, type SelectedPackage } from './select-package-name'

/**
 * Runs the default interactive flow: prompts the user to pick a generated
 * package name, then either confirms availability or fetches and prints
 * registry details for the chosen (taken) name.
 *
 * @param {import('../cli/cli-options').CliOptions} options Resolved CLI options
 *   controlling generation and prompting.
 * @returns {Promise<void>}
 */
export const runPackageSelectionFlow = async (
  options: CliOptions
): Promise<void> => {
  const selectedPackage: SelectedPackage | null =
    await selectPackageName(options)
  if (selectedPackage === null) {
    console.log(chalk.yellow('\nExited without selecting a package.\n'))
    return
  }

  if (selectedPackage.isAvailable) {
    console.log(chalk.green(`\n${selectedPackage.name} is available.\n`))
    return
  }

  const packageInfo = await fetchPackageInfo(selectedPackage.name)
  if (packageInfo === null) {
    return
  }

  printPackageDetails(packageInfo)
}
