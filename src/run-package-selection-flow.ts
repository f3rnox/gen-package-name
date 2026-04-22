import chalk from 'chalk'

import { fetchPackageInfo } from './fetch-package-info'
import { printPackageDetails } from './print-package-details'
import {
  selectPackageName,
  type SelectedPackage
} from './select-package-name'

export const runPackageSelectionFlow = async (): Promise<void> => {
  const selectedPackage: SelectedPackage | null = await selectPackageName()
  if (selectedPackage === null) {
    console.log(chalk.yellow('\nExited without selecting a package.\n'))
    return
  }

  if (selectedPackage.isAvailable) {
    console.log(
      chalk.green(`\n${selectedPackage.name} is available.\n`)
    )
    return
  }

  const packageInfo = await fetchPackageInfo(selectedPackage.name)
  if (packageInfo === null) {
    return
  }

  printPackageDetails(packageInfo)
}
