import chalk from 'chalk'

import type { PackageOutput } from '../types'

/**
 * Formats package metadata as an aligned two-column "label  value" block,
 * using chalk for colored label/value pairs. Missing description or homepage
 * values are rendered as explicit placeholders.
 *
 * @param {PackageOutput} packageInfo The package fields to render.
 * @returns {string} The formatted multi-line string.
 */
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
