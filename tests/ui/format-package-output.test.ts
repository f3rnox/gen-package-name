import { afterEach, beforeEach, describe, it } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import { formatPackageOutput } from '../../src/ui/format-package-output'

describe('formatPackageOutput', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level

  beforeEach((): void => {
    chalk.level = 0
  })

  afterEach((): void => {
    chalk.level = originalLevel
  })

  it('renders all fields with padded labels', (): void => {
    const output: string = formatPackageOutput({
      name: 'chalk',
      version: '5.0.0',
      description: 'Terminal styling',
      homepage: 'https://example.com'
    })

    const lines: string[] = output.split('\n')
    expect(lines).to.have.length(4)
    expect(lines[0]).to.equal('Name        chalk')
    expect(lines[1]).to.equal('Version     5.0.0')
    expect(lines[2]).to.equal('Description Terminal styling')
    expect(lines[3]).to.equal('Homepage    https://example.com')
  })

  it('falls back to "No description" when description is missing', (): void => {
    const output: string = formatPackageOutput({
      name: 'pkg',
      version: '1.0.0'
    })

    expect(output).to.include('Description No description')
    expect(output).to.include('Homepage    No homepage')
  })
})
