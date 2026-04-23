import chalk from 'chalk'

import { resolveKeywords } from '../generator/resolve-keywords'
import type { CliOptions } from '../types'
import { promptPackageDescription } from '../ui/prompt-package-description'

/**
 * Resolves the keyword list used to generate package names: uses CLI
 * `keywords` when set, otherwise prompts for a description and derives
 * keywords. Logs the resolved list when non-empty.
 *
 * @param {import('../types').CliOptions} options Resolved CLI options
 *   controlling generation and prompting.
 * @returns {Promise<string[]>} Keywords for {@link import('../generator/generate-package-names').generatePackageNames}.
 */
export const getKeywordsForPackageSelection = async (
  options: CliOptions
): Promise<string[]> => {
  const presetKeywords: string[] = options.keywords ?? []

  let keywords: string[] = presetKeywords

  if (keywords.length === 0) {
    const description: string = await promptPackageDescription(
      options.description
    )

    keywords = resolveKeywords({
      ...options,
      description: description.length > 0 ? description : null
    })
  }

  if (keywords.length > 0) {
    console.log(chalk.dim(`\nUsing keywords: ${keywords.join(', ')}\n`))
  }

  return keywords
}
