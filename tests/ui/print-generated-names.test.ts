import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import type { GeneratedNameEntry } from '../../src/types'
import { printGeneratedNames } from '../../src/ui/print-generated-names'

describe('printGeneratedNames', (): void => {
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

  it('prints JSON when asJson is true', (): void => {
    const entries: GeneratedNameEntry[] = [
      { name: 'a', available: true },
      { name: 'b', available: false }
    ]
    printGeneratedNames(entries, true)

    expect(logSpy.mock.calls).to.have.length(1)
    expect(JSON.parse(logSpy.mock.calls[0][0] as string)).to.deep.equal(entries)
  })

  it('prints formatted text lines when asJson is false', (): void => {
    printGeneratedNames(
      [
        { name: 'alpha', available: true },
        { name: 'beta', available: false }
      ],
      false
    )

    expect(logSpy.mock.calls).to.have.length(2)
    expect(logSpy.mock.calls[0][0]).to.equal('available  alpha')
    expect(logSpy.mock.calls[1][0]).to.equal('taken      beta')
  })

  it('logs nothing when given an empty array (non-JSON)', (): void => {
    printGeneratedNames([], false)
    expect(logSpy.mock.calls).to.have.length(0)
  })

  it('prints "[]" for an empty array in JSON mode', (): void => {
    printGeneratedNames([], true)
    expect(logSpy.mock.calls[0][0]).to.equal('[]')
  })
})
