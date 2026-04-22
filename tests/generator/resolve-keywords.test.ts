import { describe, it } from 'vitest'
import { expect } from 'chai'

import type { CliOptions } from '../../src/cli/cli-options'
import { resolveKeywords } from '../../src/generator/resolve-keywords'

const buildOptions = (overrides: Partial<CliOptions> = {}): CliOptions => ({
  description: null,
  keywords: null,
  count: 5,
  availableOnly: false,
  json: false,
  nonInteractive: false,
  check: null,
  info: null,
  color: true,
  ...overrides
})

describe('resolveKeywords', (): void => {
  it('returns explicit keywords when provided', (): void => {
    const options: CliOptions = buildOptions({
      keywords: ['http', 'client']
    })
    expect(resolveKeywords(options)).to.deep.equal(['http', 'client'])
  })

  it('prefers explicit keywords over description', (): void => {
    const options: CliOptions = buildOptions({
      keywords: ['foo', 'bar'],
      description: 'parse json streams'
    })
    expect(resolveKeywords(options)).to.deep.equal(['foo', 'bar'])
  })

  it('extracts keywords from description when none are given', (): void => {
    const options: CliOptions = buildOptions({
      description: 'Parse JSON Streams'
    })
    expect(resolveKeywords(options)).to.deep.equal(['parse', 'json', 'streams'])
  })

  it('returns an empty array when both are missing', (): void => {
    expect(resolveKeywords(buildOptions())).to.deep.equal([])
  })

  it('returns an empty array for an empty keywords list with no description', (): void => {
    expect(resolveKeywords(buildOptions({ keywords: [] }))).to.deep.equal([])
  })

  it('falls through to description when keywords is an empty array', (): void => {
    const options: CliOptions = buildOptions({
      keywords: [],
      description: 'fast cli tool'
    })
    expect(resolveKeywords(options)).to.deep.equal(['fast', 'cli', 'tool'])
  })

  it('returns an empty array for an empty description', (): void => {
    expect(resolveKeywords(buildOptions({ description: '' }))).to.deep.equal([])
  })
})
