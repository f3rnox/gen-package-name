import chalk from 'chalk'

export interface PackageChoice {
  name: string
  value: string
}

export const buildPackageChoice = (
  packageName: string,
  isAvailable: boolean
): PackageChoice => {
  const statusLabel: string = isAvailable
    ? chalk.green('(available)')
    : chalk.red('(taken)')

  return {
    name: `${packageName} ${statusLabel}`,
    value: packageName
  }
}
