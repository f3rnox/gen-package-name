import { describe, it } from 'vitest'
import { expect } from 'chai'

import type { CliOptions } from '../../src/cli/cli-options'
import { parseCliOptions } from '../../src/cli/parse-cli-options'
import { GENERATED_PACKAGE_COUNT } from '../../src/generator/constants'

const buildArgv = (...args: string[]): string[] => [
  '/usr/bin/node',
  'gen-package-name',
  ...args
]

describe('parseCliOptions', (): void => {
  it('returns defaults when no flags are provided', (): void => {
    const options: CliOptions = parseCliOptions(buildArgv())

    expect(options).to.deep.equal({
      description: null,
      keywords: null,
      count: GENERATED_PACKAGE_COUNT,
      availableOnly: false,
      json: false,
      nonInteractive: false,
      check: null,
      info: null,
      color: true
    })
  })

  it('parses description flag', (): void => {
    const options: CliOptions = parseCliOptions(
      buildArgv('-d', 'parse json streams')
    )
    expect(options.description).to.equal('parse json streams')
  })

  it('parses long description flag', (): void => {
    const options: CliOptions = parseCliOptions(
      buildArgv('--description', 'fast api client')
    )
    expect(options.description).to.equal('fast api client')
  })

  it('parses keyword list flag', (): void => {
    const options: CliOptions = parseCliOptions(
      buildArgv('--keywords', 'parse,json,stream')
    )
    expect(options.keywords).to.deep.equal(['parse', 'json', 'stream'])
  })

  it('parses count flag', (): void => {
    const options: CliOptions = parseCliOptions(buildArgv('--count', '10'))
    expect(options.count).to.equal(10)
  })

  it('parses boolean flags', (): void => {
    const options: CliOptions = parseCliOptions(
      buildArgv('--available-only', '--json', '--non-interactive')
    )
    expect(options.availableOnly).to.equal(true)
    expect(options.json).to.equal(true)
    expect(options.nonInteractive).to.equal(true)
  })

  it('parses check flag', (): void => {
    const options: CliOptions = parseCliOptions(buildArgv('--check', 'my-pkg'))
    expect(options.check).to.equal('my-pkg')
  })

  it('parses info flag', (): void => {
    const options: CliOptions = parseCliOptions(buildArgv('--info', 'chalk'))
    expect(options.info).to.equal('chalk')
  })

  it('parses --no-color flag', (): void => {
    const options: CliOptions = parseCliOptions(buildArgv('--no-color'))
    expect(options.color).to.equal(false)
  })

  it('combines multiple flags', (): void => {
    const options: CliOptions = parseCliOptions(
      buildArgv('-k', 'http,client', '-c', '12', '-a', '-j', '-n', '--no-color')
    )

    expect(options).to.deep.equal({
      description: null,
      keywords: ['http', 'client'],
      count: 12,
      availableOnly: true,
      json: true,
      nonInteractive: true,
      check: null,
      info: null,
      color: false
    })
  })
})
