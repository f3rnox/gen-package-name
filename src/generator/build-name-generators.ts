import { ADJECTIVES, NOUNS, PACKAGE_TYPES, VERBS } from './constants'
import { sample } from './sample'

type NameGenerator = () => string

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
