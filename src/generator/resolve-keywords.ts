import type { CliOptions } from '../cli/cli-options'
import { extractNameKeywords } from './extract-name-keywords'

export const resolveKeywords = (options: CliOptions): string[] => {
  if (options.keywords !== null && options.keywords.length > 0) {
    return options.keywords
  }

  if (options.description !== null && options.description.length > 0) {
    return extractNameKeywords(options.description)
  }

  return []
}
