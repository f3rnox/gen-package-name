import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import { printRunError } from '../../src/ui/print-run-error'

describe('printRunError', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level
  const originalNodeEnv: string | undefined = process.env.NODE_ENV
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach((): void => {
    chalk.level = 0
    errorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    chalk.level = originalLevel
    process.env.NODE_ENV = originalNodeEnv
    errorSpy.mockRestore()
  })

  it('prints the error message for Error instances outside dev mode', (): void => {
    process.env.NODE_ENV = 'test'
    printRunError(new Error('kaboom'))

    expect(errorSpy.mock.calls).to.have.length(2)
    expect(errorSpy.mock.calls[0][0]).to.equal(
      'Failed to fetch package information'
    )
    expect(errorSpy.mock.calls[1][0]).to.equal('kaboom')
  })

  it('prints the stack trace in development mode', (): void => {
    process.env.NODE_ENV = 'development'
    const err = new Error('explode')
    err.stack = 'Error: explode\n    at stack-line'

    printRunError(err)

    expect(errorSpy.mock.calls[1][0]).to.equal(
      'Error: explode\n    at stack-line'
    )
  })

  it('serializes non-Error values with JSON', (): void => {
    process.env.NODE_ENV = 'test'
    printRunError({ code: 'E_UNKNOWN' })

    expect(errorSpy.mock.calls[1][0]).to.equal('{"code":"E_UNKNOWN"}')
  })

  it('falls back to "Unknown error" when JSON.stringify returns undefined', (): void => {
    process.env.NODE_ENV = 'test'
    printRunError(undefined)

    expect(errorSpy.mock.calls[1][0]).to.equal('Unknown error')
  })
})
