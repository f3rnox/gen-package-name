import { buildNameGenerators } from './build-name-generators'
import { sample } from './sample'

/**
 * Validates a candidate against the npm package name rules enforced here:
 * lowercase alphanumeric segments joined by single hyphens, no leading or
 * trailing hyphen, and a maximum length of 214 characters.
 *
 * @param {string} name The candidate name to validate.
 * @returns {boolean} `true` when the name is a valid npm package name.
 */
const isValidNpmName = (name: string): boolean =>
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(name) && name.length <= 214

/**
 * Generates a deduplicated list of exactly `count` candidate npm package
 * names, drawing from generators seeded with the supplied keywords. Invalid
 * names are silently discarded and the loop continues until the target size
 * is reached.
 *
 * @param {number} count Number of unique names to produce.
 * @param {string[]} [keywords=[]] Keyword seeds injected into the generators.
 * @returns {string[]} Generated package names, in insertion order.
 */
export const generatePackageNames = (
  count: number,
  keywords: string[] = []
): string[] => {
  const generators = buildNameGenerators(keywords)
  const generatedNames: Set<string> = new Set<string>()

  while (generatedNames.size < count) {
    const name = sample(generators)()

    if (isValidNpmName(name)) {
      generatedNames.add(name)
    }
  }

  return [...generatedNames]
}
