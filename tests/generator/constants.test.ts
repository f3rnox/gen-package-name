import { describe, it } from 'vitest'
import { expect } from 'chai'

import {
  ADJECTIVES,
  EXIT_PACKAGE_SELECTION,
  GENERATED_PACKAGE_COUNT,
  NOUNS,
  PACKAGE_TYPES,
  REGENERATE_PACKAGE_SET,
  SUFFIXES,
  VERBS
} from '../../src/generator/constants'

const isLowercaseWord = (word: string): boolean =>
  typeof word === 'string' && /^[a-z][a-z0-9]*$/.test(word)

describe('generator constants', (): void => {
  it('exposes non-empty unique ADJECTIVES of lowercase words', (): void => {
    expect(ADJECTIVES).to.be.an('array')
    expect(ADJECTIVES.length).to.be.greaterThan(0)
    expect(ADJECTIVES.every(isLowercaseWord)).to.equal(true)
    expect(new Set<string>(ADJECTIVES).size).to.equal(ADJECTIVES.length)
  })

  it('exposes non-empty unique VERBS of lowercase words', (): void => {
    expect(VERBS).to.be.an('array')
    expect(VERBS.length).to.be.greaterThan(0)
    expect(VERBS.every(isLowercaseWord)).to.equal(true)
    expect(new Set<string>(VERBS).size).to.equal(VERBS.length)
  })

  it('exposes non-empty unique NOUNS of lowercase words', (): void => {
    expect(NOUNS).to.be.an('array')
    expect(NOUNS.length).to.be.greaterThan(0)
    expect(NOUNS.every(isLowercaseWord)).to.equal(true)
    expect(new Set<string>(NOUNS).size).to.equal(NOUNS.length)
  })

  it('exposes non-empty unique PACKAGE_TYPES of lowercase words', (): void => {
    expect(PACKAGE_TYPES).to.be.an('array')
    expect(PACKAGE_TYPES.length).to.be.greaterThan(0)
    expect(PACKAGE_TYPES.every(isLowercaseWord)).to.equal(true)
    expect(new Set<string>(PACKAGE_TYPES).size).to.equal(PACKAGE_TYPES.length)
  })

  it('keeps SUFFIXES aliased to PACKAGE_TYPES for backwards compatibility', (): void => {
    expect(SUFFIXES).to.equal(PACKAGE_TYPES)
  })

  it('exposes distinct sentinel values for flow control', (): void => {
    expect(REGENERATE_PACKAGE_SET).to.be.a('string')
    expect(REGENERATE_PACKAGE_SET.length).to.be.greaterThan(0)
    expect(EXIT_PACKAGE_SELECTION).to.be.a('string')
    expect(EXIT_PACKAGE_SELECTION.length).to.be.greaterThan(0)
    expect(REGENERATE_PACKAGE_SET).to.not.equal(EXIT_PACKAGE_SELECTION)
  })

  it('exposes a positive default generated count', (): void => {
    expect(GENERATED_PACKAGE_COUNT).to.be.a('number').and.to.be.greaterThan(0)
  })
})
