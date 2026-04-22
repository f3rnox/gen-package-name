import chalk from 'chalk'

import { fetchPackageInfo, type PackageInfo } from '../npm/fetch-package-info'
import { printPackageDetails } from '../ui/print-package-details'

/**
 * Fetches registry metadata for `packageName` and prints it. When the package
 * does not exist it is reported as available. Output is either human-readable
 * or JSON depending on `asJson`.
 *
 * @param {string} packageName The npm package name to inspect.
 * @param {boolean} asJson Whether to emit machine-readable JSON instead of prose.
 * @returns {Promise<number>} Always `0`; informational command, does not fail on
 *   a missing package.
 */
export const runInfoCommand = async (
  packageName: string,
  asJson: boolean
): Promise<number> => {
  const packageInfo: PackageInfo | null = await fetchPackageInfo(packageName)

  if (packageInfo === null) {
    if (asJson) {
      console.log(
        JSON.stringify({ name: packageName, available: true }, null, 2)
      )
    }

    return 0
  }

  if (asJson) {
    console.log(
      JSON.stringify(
        {
          name: packageInfo.name ?? packageName,
          version: packageInfo.version ?? null,
          description: packageInfo.description ?? null,
          homepage: packageInfo.homepage ?? null,
          available: false
        },
        null,
        2
      )
    )
    return 0
  }

  console.log(chalk.red(`${packageName} is taken`))
  printPackageDetails(packageInfo)
  return 0
}
