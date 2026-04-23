import { generatePackageNames } from '../generator/generate-package-names'
import { resolveKeywords } from '../generator/resolve-keywords'
import { checkPackageNamesAvailability } from '../npm/check-package-names-availability'
import type { CliOptions, GeneratedNameEntry } from '../types'
import { printGeneratedNames } from '../ui/print-generated-names'

/**
 * Runs the non-interactive flow: generates a batch of candidate package names,
 * checks their availability on npm, and prints the results (optionally filtered
 * to only available names and/or emitted as JSON).
 *
 * @param {import('../types').CliOptions} options Resolved CLI options
 *   controlling generation and output.
 * @returns {Promise<number>} `0` on success, or `1` when `availableOnly` is set
 *   and no available names were produced.
 */
export const runNonInteractiveFlow = async (
  options: CliOptions
): Promise<number> => {
  const keywords: string[] = resolveKeywords(options)
  const packageNames: string[] = generatePackageNames(options.count, keywords)
  const availability: Map<string, boolean> =
    await checkPackageNamesAvailability(packageNames)

  const entries: GeneratedNameEntry[] = packageNames.map(
    (name: string): GeneratedNameEntry => ({
      name,
      available: availability.get(name) ?? false
    })
  )

  const filtered: GeneratedNameEntry[] = options.availableOnly
    ? entries.filter((entry: GeneratedNameEntry): boolean => entry.available)
    : entries

  printGeneratedNames(filtered, options.json)

  if (options.availableOnly && filtered.length === 0) {
    return 1
  }

  return 0
}
