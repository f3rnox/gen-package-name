import chalk from 'chalk'

import type { PackageInfo } from '../npm/fetch-package-info'
import { formatPackageOutput } from './format-package-output'

/**
 * Prints a human-readable summary of an npm package's registry metadata
 * (name, version, description, homepage) with missing fields substituted by
 * empty strings before formatting.
 *
 * @param {import('../npm/fetch-package-info').PackageInfo} packageInfo Registry
 *   metadata as returned by `fetchPackageInfo`.
 * @returns {void}
 */
export const printPackageDetails = (packageInfo: PackageInfo): void => {
  console.log(chalk.bold.green('Package details'))
  console.log(
    formatPackageOutput({
      name: packageInfo.name ?? '',
      version: packageInfo.version ?? '',
      description: packageInfo.description ?? '',
      homepage: packageInfo.homepage ?? ''
    })
  )
}
