import { ADJECTIVES, NOUNS, PACKAGE_TYPES, VERBS } from './constants'
import { sample } from './sample'

type NameGenerator = () => string

/**
 * Builds the pool of name generators used by `generatePackageNames`. The base
 * set combines adjectives, verbs, nouns, and package-type suffixes; when
 * keywords are provided, additional generators are appended to ensure at
 * least one keyword appears in the produced name, and a keyword-pair
 * generator is added when two or more keywords are supplied.
 *
 * @param {string[]} keywords Optional keyword seeds to weave into generated names.
 * @returns {Array<() => string>} Parameterless generator functions, each producing
 *   a candidate package name.
 */
export const buildNameGenerators = (keywords: string[]): NameGenerator[] => {
  // Merge user keywords into the noun pool so all existing patterns also use them
  const nouns: string[] = keywords.length > 0 ? [...keywords, ...NOUNS] : NOUNS

  const generators: NameGenerator[] = [
    // adjective-noun: tiny-emitter, fast-glob
    () => `${sample(ADJECTIVES)}-${sample(nouns)}`,
    // verb-noun: parse-json, watch-config
    () => `${sample(VERBS)}-${sample(nouns)}`,
    // noun-type: router-kit, cache-lib
    () => `${sample(nouns)}-${sample(PACKAGE_TYPES)}`,
    // adjective-noun-type: tiny-cache-lib, fast-router-cli
    () => `${sample(ADJECTIVES)}-${sample(nouns)}-${sample(PACKAGE_TYPES)}`,
    // verb-noun-type: parse-json-cli, build-config-lib
    () => `${sample(VERBS)}-${sample(nouns)}-${sample(PACKAGE_TYPES)}`
  ]

  if (keywords.length >= 1) {
    // Extra patterns that guarantee at least one keyword appears
    generators.push(
      () => `${sample(ADJECTIVES)}-${sample(keywords)}`,
      () => `${sample(VERBS)}-${sample(keywords)}`,
      () => `${sample(keywords)}-${sample(PACKAGE_TYPES)}`,
      () =>
        `${sample(ADJECTIVES)}-${sample(keywords)}-${sample(PACKAGE_TYPES)}`,
      () => `${sample(VERBS)}-${sample(keywords)}-${sample(PACKAGE_TYPES)}`
    )
  }

  if (keywords.length >= 2) {
    // keyword-keyword pairs: http-client, auth-token
    generators.push(() => {
      const first: string = sample(keywords)
      const rest: string[] = keywords.filter(
        (k: string): boolean => k !== first
      )
      return `${first}-${sample(rest)}`
    })
  }

  return generators
}
