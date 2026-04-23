import type { CliOptions } from '../types'
import { extractNameKeywords } from './extract-name-keywords'

/**
 * Resolves the keyword seeds to use for name generation from CLI options.
 * Explicit `--keywords` take precedence over `--description`; when both are
 * absent an empty list is returned.
 *
 * @param {import('../types').CliOptions} options Resolved CLI options.
 * @returns {string[]} Keyword seeds, possibly empty.
 */
export const resolveKeywords = (options: CliOptions): string[] => {
  if (options.keywords !== null && options.keywords.length > 0) {
    return options.keywords
  }

  if (options.description !== null && options.description.length > 0) {
    return extractNameKeywords(options.description)
  }

  return []
}
