import chalk from 'chalk'

import { fetchPackageInfo } from './fetch-package-info.js'
import { printPackageDetails } from './print-package-details.js'
import { selectPackageName } from './select-package-name.js'

export const runPackageSelectionFlow = async (): Promise<void> => {
  const selectedPackage: string | null = await selectPackageName()
  if (selectedPackage === null) {
    console.log(chalk.yellow('\nExited without selecting a package.\n'))
    return
  }

  const packageInfo = await fetchPackageInfo(selectedPackage)
  if (packageInfo === null) {
    return
  }

  printPackageDetails(packageInfo)
}
