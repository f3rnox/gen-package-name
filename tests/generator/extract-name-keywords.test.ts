import { describe, it } from 'vitest'
import { expect } from 'chai'

import { extractNameKeywords } from '../../src/generator/extract-name-keywords'

describe('extractNameKeywords', (): void => {
  it('returns an empty array for an empty string', (): void => {
    expect(extractNameKeywords('')).to.deep.equal([])
  })

  it('lowercases and extracts individual words', (): void => {
    expect(extractNameKeywords('Parse JSON Streams')).to.deep.equal([
      'parse',
      'json',
      'streams'
    ])
  })

  it('filters out stop words', (): void => {
    expect(
      extractNameKeywords('a fast and tiny parser for the json')
    ).to.deep.equal(['fast', 'tiny', 'parser', 'json'])
  })

  it('deduplicates repeated words', (): void => {
    expect(extractNameKeywords('json json parser parser')).to.deep.equal([
      'json',
      'parser'
    ])
  })

  it('filters out single-character words', (): void => {
    expect(extractNameKeywords('a b c parser')).to.deep.equal(['parser'])
  })

  it('filters out words longer than 30 characters', (): void => {
    const long = 'a'.repeat(31)
    expect(extractNameKeywords(`${long} parser`)).to.deep.equal(['parser'])
  })

  it('filters out words that do not start with a letter', (): void => {
    expect(extractNameKeywords('123 parse json')).to.deep.equal([
      'parse',
      'json'
    ])
  })

  it('splits on common punctuation', (): void => {
    expect(
      extractNameKeywords('parse,json;stream.buffer!queue?cache/log\\event')
    ).to.deep.equal([
      'parse',
      'json',
      'stream',
      'buffer',
      'queue',
      'cache',
      'log',
      'event'
    ])
  })

  it('caps the returned list at 8 keywords', (): void => {
    const description =
      'alpha beta gamma delta epsilon zeta eta theta iota kappa'
    const result: string[] = extractNameKeywords(description)

    expect(result).to.have.length(8)
    expect(result).to.deep.equal([
      'alpha',
      'beta',
      'gamma',
      'delta',
      'epsilon',
      'zeta',
      'eta',
      'theta'
    ])
  })

  it('accepts words with trailing digits', (): void => {
    expect(extractNameKeywords('http2 json5')).to.deep.equal(['http2', 'json5'])
  })
})
