import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

const packageJsonMock = vi.fn()

vi.mock('package-json', (): { default: typeof packageJsonMock } => ({
  default: packageJsonMock
}))

describe('runInfoCommand', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach((): void => {
    chalk.level = 0
    logSpy = vi.spyOn(console, 'log').mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    chalk.level = originalLevel
    packageJsonMock.mockReset()
    logSpy.mockRestore()
  })

  it('prints the header and details in text mode for an existing package', async (): Promise<void> => {
    packageJsonMock.mockResolvedValueOnce({
      name: 'chalk',
      version: '5.0.0',
      description: 'styling',
      homepage: 'https://example.com'
    })

    const { runInfoCommand } =
      await import('../../src/commands/run-info-command')
    const code: number = await runInfoCommand('chalk', false)

    expect(code).to.equal(0)
    const logged: string = logSpy.mock.calls
      .map((call: unknown[]): string => String(call[0]))
      .join('\n')
    expect(logged).to.include('Fetching package data for "chalk"')
    expect(logged).to.include('chalk is taken')
    expect(logged).to.include('Package details')
    expect(logged).to.include('Name        chalk')
  })

  it('emits full metadata JSON for an existing package when asJson is true', async (): Promise<void> => {
    packageJsonMock.mockResolvedValueOnce({
      name: 'chalk',
      version: '5.0.0',
      description: 'styling',
      homepage: 'https://example.com'
    })

    const { runInfoCommand } =
      await import('../../src/commands/run-info-command')
    const code: number = await runInfoCommand('chalk', true)

    expect(code).to.equal(0)
    const lastJson: string = logSpy.mock.calls[
      logSpy.mock.calls.length - 1
    ][0] as string
    expect(JSON.parse(lastJson)).to.deep.equal({
      name: 'chalk',
      version: '5.0.0',
      description: 'styling',
      homepage: 'https://example.com',
      available: false
    })
  })

  it('returns 0 and prints availability JSON when the package is missing', async (): Promise<void> => {
    interface LookupError extends Error {
      statusCode?: number
    }
    const err: LookupError = new Error('not found')
    err.statusCode = 404
    packageJsonMock.mockRejectedValueOnce(err)

    const { runInfoCommand } =
      await import('../../src/commands/run-info-command')
    const code: number = await runInfoCommand('free-pkg', true)

    expect(code).to.equal(0)
    const lastJson: string = logSpy.mock.calls[
      logSpy.mock.calls.length - 1
    ][0] as string
    expect(JSON.parse(lastJson)).to.deep.equal({
      name: 'free-pkg',
      available: true
    })
  })

  it('returns 0 silently in text mode for a missing package', async (): Promise<void> => {
    interface LookupError extends Error {
      statusCode?: number
    }
    const err: LookupError = new Error('not found')
    err.statusCode = 404
    packageJsonMock.mockRejectedValueOnce(err)

    const { runInfoCommand } =
      await import('../../src/commands/run-info-command')
    const code: number = await runInfoCommand('free-pkg', false)

    expect(code).to.equal(0)
    const logged: string = logSpy.mock.calls
      .map((call: unknown[]): string => String(call[0]))
      .join('\n')
    expect(logged).to.include('free-pkg` is available')
  })

  it('falls back to the given package name when metadata lacks name', async (): Promise<void> => {
    packageJsonMock.mockResolvedValueOnce({})

    const { runInfoCommand } =
      await import('../../src/commands/run-info-command')
    const code: number = await runInfoCommand('anon', true)

    expect(code).to.equal(0)
    const lastJson: string = logSpy.mock.calls[
      logSpy.mock.calls.length - 1
    ][0] as string
    expect(JSON.parse(lastJson)).to.deep.equal({
      name: 'anon',
      version: null,
      description: null,
      homepage: null,
      available: false
    })
  })
})
