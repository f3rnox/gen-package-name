import chalk from 'chalk'

import type { PackageInfo } from '../npm/fetch-package-info'
import { formatPackageOutput } from './format-package-output'

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
