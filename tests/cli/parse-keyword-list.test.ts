import { describe, it } from 'vitest'
import { expect } from 'chai'

import { parseKeywordList } from '../../src/cli/parse-keyword-list'

describe('parseKeywordList', (): void => {
  it('splits comma-separated values', (): void => {
    expect(parseKeywordList('foo,bar,baz')).to.deep.equal(['foo', 'bar', 'baz'])
  })

  it('splits whitespace-separated values', (): void => {
    expect(parseKeywordList('foo bar baz')).to.deep.equal(['foo', 'bar', 'baz'])
  })

  it('splits mixed whitespace and comma separators', (): void => {
    expect(parseKeywordList('foo, bar,  baz qux')).to.deep.equal([
      'foo',
      'bar',
      'baz',
      'qux'
    ])
  })

  it('lowercases values', (): void => {
    expect(parseKeywordList('FOO,Bar,BAZ')).to.deep.equal(['foo', 'bar', 'baz'])
  })

  it('returns an empty array for an empty string', (): void => {
    expect(parseKeywordList('')).to.deep.equal([])
  })

  it('returns an empty array for whitespace only', (): void => {
    expect(parseKeywordList('   ')).to.deep.equal([])
  })

  it('ignores leading and trailing separators', (): void => {
    expect(parseKeywordList(',,foo,,bar,,')).to.deep.equal(['foo', 'bar'])
  })

  it('handles a single keyword', (): void => {
    expect(parseKeywordList('alpha')).to.deep.equal(['alpha'])
  })
})
