import chalk from 'chalk'
import packageJson from 'package-json'

import type { PackageInfo } from '../types'
import { isPackageMissingError } from './is-package-missing-error'

/**
 * Fetches full registry metadata for `selectedPackage`. Returns `null` and
 * prints an availability/status message when the package does not exist or
 * has incomplete metadata; all other errors are rethrown.
 *
 * @param {string} selectedPackage The npm package name to fetch metadata for.
 * @returns {Promise<PackageInfo|null>} Metadata, or `null` when unavailable or
 *   incomplete.
 */
export const fetchPackageInfo = async (
  selectedPackage: string
): Promise<PackageInfo | null> => {
  console.log(
    chalk.magenta(`\nFetching package data for "${selectedPackage}"...\n`)
  )

  try {
    const packageInfo: PackageInfo = await packageJson(selectedPackage, {
      fullMetadata: true
    })
    return packageInfo
  } catch (error: unknown) {
    if (isPackageMissingError(error)) {
      console.log(
        chalk.bold.green(`Package \`${selectedPackage}\` is available`)
      )
      return null
    }

    if (error instanceof TypeError && error.message.includes("'latest'")) {
      console.log(
        chalk.bold.yellow(
          `Package \`${selectedPackage}\` exists but has incomplete registry metadata`
        )
      )
      return null
    }

    throw error
  }
}
