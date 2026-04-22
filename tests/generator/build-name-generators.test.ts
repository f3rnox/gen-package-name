import { describe, it } from 'vitest'
import { expect } from 'chai'

import { buildNameGenerators } from '../../src/generator/build-name-generators'

describe('buildNameGenerators', (): void => {
  it('returns 5 base generators when no keywords are provided', (): void => {
    const generators: (() => string)[] = buildNameGenerators([])
    expect(generators).to.have.length(5)
  })

  it('adds 5 keyword-anchored generators when at least one keyword is given', (): void => {
    const generators: (() => string)[] = buildNameGenerators(['http'])
    expect(generators).to.have.length(10)
  })

  it('adds a keyword-pair generator when two or more keywords are given', (): void => {
    const generators: (() => string)[] = buildNameGenerators(['http', 'client'])
    expect(generators).to.have.length(11)
  })

  it('produces generators that return non-empty hyphenated strings', (): void => {
    const generators: (() => string)[] = buildNameGenerators(['auth', 'token'])

    for (const generator of generators) {
      for (let i = 0; i < 5; i += 1) {
        const name: string = generator()
        expect(name)
          .to.be.a('string')
          .and.match(/^[a-z0-9-]+$/)
        expect(
          name.split('-').every((part: string): boolean => part.length > 0)
        ).to.equal(true)
      }
    }
  })

  it('keyword-pair generator returns distinct keywords', (): void => {
    const generators: (() => string)[] = buildNameGenerators(['http', 'client'])
    const keywordPairGenerator: () => string = generators[generators.length - 1]

    for (let i = 0; i < 20; i += 1) {
      const [first, second] = keywordPairGenerator().split('-')
      expect(first).to.not.equal(second)
      expect(['http', 'client']).to.include(first)
      expect(['http', 'client']).to.include(second)
    }
  })

  it('includes the provided keyword in keyword-anchored generators', (): void => {
    const generators: (() => string)[] = buildNameGenerators(['parse'])

    for (let i = 5; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        expect(generators[i]().split('-')).to.include('parse')
      }
    }
  })
})
