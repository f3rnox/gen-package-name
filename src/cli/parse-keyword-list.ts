/**
 * Commander option parser for `--keywords`. Splits on whitespace or commas,
 * trims each entry, lowercases it, and drops empty fragments.
 *
 * @param {string} value The raw CLI string to parse.
 * @returns {string[]} Normalized, lowercased keyword list.
 */
export const parseKeywordList = (value: string): string[] =>
  value
    .split(/[\s,]+/)
    .map((keyword: string): string => keyword.trim().toLowerCase())
    .filter((keyword: string): boolean => keyword.length > 0)
