import chalk from 'chalk'

import { checkPackageAvailability } from '../npm/check-package-availability'

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
