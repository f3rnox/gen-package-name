import chalk from 'chalk'
import packageJson from 'package-json'

import { isPackageMissingError } from './is-package-missing-error.js'

export interface PackageInfo {
  name?: string
  version?: string
  description?: string
  homepage?: string
}

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
