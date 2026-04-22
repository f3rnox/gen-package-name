import { afterEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'

import { sample } from '../../src/generator/sample'

describe('sample', (): void => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('returns the first element when Math.random returns 0', (): void => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(sample<number>([1, 2, 3])).to.equal(1)
  })

  it('returns the last element when Math.random returns just under 1', (): void => {
    vi.spyOn(Math, 'random').mockReturnValue(0.9999999)
    expect(sample<number>([1, 2, 3])).to.equal(3)
  })

  it('returns the middle element for mid-range random values', (): void => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    expect(sample<number>([1, 2, 3])).to.equal(2)
  })

  it('returns the only element for single-item arrays', (): void => {
    vi.spyOn(Math, 'random').mockReturnValue(0.42)
    expect(sample<string>(['only'])).to.equal('only')
  })

  it('returns undefined for empty arrays', (): void => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(sample<number>([])).to.equal(undefined)
  })

  it('returns values from the source array on many calls', (): void => {
    const source: string[] = ['a', 'b', 'c', 'd']
    for (let i = 0; i < 50; i += 1) {
      expect(source).to.include(sample<string>(source))
    }
  })
})
