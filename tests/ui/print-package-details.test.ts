import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import { printPackageDetails } from '../../src/ui/print-package-details'

describe('printPackageDetails', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach((): void => {
    chalk.level = 0
    logSpy = vi.spyOn(console, 'log').mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    chalk.level = originalLevel
    logSpy.mockRestore()
  })

  it('prints the header followed by formatted details', (): void => {
    printPackageDetails({
      name: 'chalk',
      version: '5.0.0',
      description: 'styling',
      homepage: 'https://example.com'
    })

    expect(logSpy.mock.calls).to.have.length(2)
    expect(logSpy.mock.calls[0][0]).to.equal('Package details')
    expect(logSpy.mock.calls[1][0]).to.include('Name        chalk')
    expect(logSpy.mock.calls[1][0]).to.include('Version     5.0.0')
    expect(logSpy.mock.calls[1][0]).to.include('Description styling')
    expect(logSpy.mock.calls[1][0]).to.include(
      'Homepage    https://example.com'
    )
  })

  it('substitutes empty strings for missing fields', (): void => {
    printPackageDetails({})

    const body: string = logSpy.mock.calls[1][0] as string
    const lines: string[] = body.split('\n')
    expect(lines[0]).to.equal('Name        ')
    expect(lines[1]).to.equal('Version     ')
    expect(lines[2]).to.equal('Description ')
    expect(lines[3]).to.equal('Homepage    ')
  })
})
