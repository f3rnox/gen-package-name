import { InvalidArgumentError } from 'commander'

/**
 * Commander option parser for `--count`. Accepts a decimal integer in the
 * inclusive range `[1, 100]`; anything else throws
 * `InvalidArgumentError` so commander can render a friendly error.
 *
 * @param {string} value The raw CLI string to parse.
 * @returns {number} The parsed count.
 * @throws {import('commander').InvalidArgumentError} When the value is not a
 *   positive integer or exceeds 100.
 */
export const parseCountOption = (value: string): number => {
  const parsed: number = Number.parseInt(value, 10)

  if (!Number.isFinite(parsed) || parsed < 1) {
    throw new InvalidArgumentError('Count must be a positive integer.')
  }

  if (parsed > 100) {
    throw new InvalidArgumentError('Count must not exceed 100.')
  }

  return parsed
}
