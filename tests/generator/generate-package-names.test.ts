import { describe, it } from 'vitest'
import { expect } from 'chai'

import { generatePackageNames } from '../../src/generator/generate-package-names'

const isValidNpmName = (name: string): boolean =>
  /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(name) && name.length <= 214

describe('generatePackageNames', (): void => {
  it('returns the requested number of names', (): void => {
    const names: string[] = generatePackageNames(5)
    expect(names).to.have.length(5)
  })

  it('returns unique names', (): void => {
    const names: string[] = generatePackageNames(10)
    expect(new Set<string>(names).size).to.equal(names.length)
  })

  it('returns valid npm package names', (): void => {
    const names: string[] = generatePackageNames(15)
    for (const name of names) {
      expect(isValidNpmName(name)).to.equal(true)
    }
  })

  it('honors provided keywords by incorporating them into output', (): void => {
    const keywords: string[] = ['http', 'client']
    const names: string[] = generatePackageNames(30, keywords)

    const hitsKeyword: boolean = names.some((name: string): boolean =>
      name.split('-').some((part: string): boolean => keywords.includes(part))
    )

    expect(hitsKeyword).to.equal(true)
  })

  it('works with a large count without duplicates', (): void => {
    const names: string[] = generatePackageNames(50, ['alpha', 'beta'])
    expect(names).to.have.length(50)
    expect(new Set<string>(names).size).to.equal(50)
  })

  it('defaults to empty keywords', (): void => {
    const names: string[] = generatePackageNames(3)
    for (const name of names) {
      expect(isValidNpmName(name)).to.equal(true)
    }
  })
})
