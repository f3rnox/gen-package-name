import { describe, it } from 'vitest'
import { expect } from 'chai'
import { InvalidArgumentError } from 'commander'

import { parseCountOption } from '../../src/cli/parse-count-option'

describe('parseCountOption', (): void => {
  it('parses a valid positive integer', (): void => {
    expect(parseCountOption('5')).to.equal(5)
  })

  it('parses the lower boundary value of 1', (): void => {
    expect(parseCountOption('1')).to.equal(1)
  })

  it('parses the upper boundary value of 100', (): void => {
    expect(parseCountOption('100')).to.equal(100)
  })

  it('parses numeric strings with leading whitespace using radix 10', (): void => {
    expect(parseCountOption('42abc')).to.equal(42)
  })

  it('throws for zero', (): void => {
    expect((): number => parseCountOption('0')).to.throw(
      InvalidArgumentError,
      'Count must be a positive integer.'
    )
  })

  it('throws for negative integers', (): void => {
    expect((): number => parseCountOption('-3')).to.throw(
      InvalidArgumentError,
      'Count must be a positive integer.'
    )
  })

  it('throws for non-numeric strings', (): void => {
    expect((): number => parseCountOption('abc')).to.throw(
      InvalidArgumentError,
      'Count must be a positive integer.'
    )
  })

  it('throws for empty string', (): void => {
    expect((): number => parseCountOption('')).to.throw(
      InvalidArgumentError,
      'Count must be a positive integer.'
    )
  })

  it('throws for values above 100', (): void => {
    expect((): number => parseCountOption('101')).to.throw(
      InvalidArgumentError,
      'Count must not exceed 100.'
    )
  })

  it('throws for very large values', (): void => {
    expect((): number => parseCountOption('999999')).to.throw(
      InvalidArgumentError,
      'Count must not exceed 100.'
    )
  })
})
