import chalk from 'chalk'

export interface PackageOutput {
  name: string
  version: string
  description?: string
  homepage?: string
}

export const formatPackageOutput = (packageInfo: PackageOutput): string => {
  const rows: [string, string][] = [
    ['Name', packageInfo.name],
    ['Version', packageInfo.version],
    ['Description', packageInfo.description ?? 'No description'],
    ['Homepage', packageInfo.homepage ?? 'No homepage']
  ]

  const labelWidth: number = Math.max(
    ...rows.map(([label]: [string, string]): number => label.length)
  )

  return rows
    .map(([label, value]: [string, string]): string => {
      const paddedLabel: string = label.padEnd(labelWidth, ' ')
      return `${chalk.cyan(paddedLabel)} ${chalk.white(value)}`
    })
    .join('\n')
}
