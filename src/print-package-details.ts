import chalk from 'chalk'

import { formatPackageOutput } from './format-package-output.js'
import type { PackageInfo } from './fetch-package-info.js'

export const printPackageDetails = (packageInfo: PackageInfo): void => {
  console.log(chalk.bold.red('Package name is taken'))
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
