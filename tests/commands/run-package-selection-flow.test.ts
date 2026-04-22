import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import type { CliOptions } from '../../src/cli/cli-options'

const promptMock = vi.fn()
const packageJsonMock = vi.fn()

vi.mock('inquirer', (): { default: { prompt: typeof promptMock } } => ({
  default: { prompt: promptMock }
}))

vi.mock('package-json', (): { default: typeof packageJsonMock } => ({
  default: packageJsonMock
}))

const mockResponse = (status: number): Response =>
  ({
    status,
    statusText: '',
    ok: status >= 200 && status < 300
  }) as Response

const buildOptions = (overrides: Partial<CliOptions> = {}): CliOptions => ({
  description: null,
  keywords: ['alpha'],
  count: 2,
  availableOnly: false,
  json: false,
  nonInteractive: false,
  check: null,
  info: null,
  color: false,
  ...overrides
})

describe('runPackageSelectionFlow', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach((): void => {
    chalk.level = 0
    logSpy = vi.spyOn(console, 'log').mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    chalk.level = originalLevel
    vi.restoreAllMocks()
    promptMock.mockReset()
    packageJsonMock.mockReset()
  })

  const findLoggedLine = (needle: string): boolean =>
    logSpy.mock.calls.some((call: unknown[]): boolean =>
      String(call[0]).includes(needle)
    )

  it('logs an exit message when nothing is selected', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))
    promptMock.mockResolvedValueOnce({
      selectedPackage: '__exit_package_selection__'
    })

    const { runPackageSelectionFlow } =
      await import('../../src/commands/run-package-selection-flow')
    await runPackageSelectionFlow(buildOptions())

    expect(findLoggedLine('Exited without selecting a package.')).to.equal(true)
  })

  it('announces availability when an available name is chosen', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    promptMock.mockImplementationOnce(
      async (
        questions: { choices: { value: string }[] }[]
      ): Promise<{ selectedPackage: string }> => ({
        selectedPackage: questions[0].choices[0].value
      })
    )

    const { runPackageSelectionFlow } =
      await import('../../src/commands/run-package-selection-flow')
    await runPackageSelectionFlow(buildOptions())

    expect(findLoggedLine('is available.')).to.equal(true)
    expect(packageJsonMock.mock.calls).to.have.length(0)
  })

  it('fetches package info when the chosen name is taken', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(200))

    promptMock.mockImplementationOnce(
      async (
        questions: { choices: { value: string }[] }[]
      ): Promise<{ selectedPackage: string }> => ({
        selectedPackage: questions[0].choices[0].value
      })
    )

    packageJsonMock.mockResolvedValueOnce({
      name: 'chalk',
      version: '5.0.0',
      description: 'styling',
      homepage: 'https://example.com'
    })

    const { runPackageSelectionFlow } =
      await import('../../src/commands/run-package-selection-flow')
    await runPackageSelectionFlow(buildOptions())

    expect(packageJsonMock.mock.calls).to.have.length(1)
    expect(findLoggedLine('Package details')).to.equal(true)
  })

  it('returns silently when package info is null', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(200))

    promptMock.mockImplementationOnce(
      async (
        questions: { choices: { value: string }[] }[]
      ): Promise<{ selectedPackage: string }> => ({
        selectedPackage: questions[0].choices[0].value
      })
    )

    interface LookupError extends Error {
      statusCode?: number
    }
    const err: LookupError = new Error('not found')
    err.statusCode = 404
    packageJsonMock.mockRejectedValueOnce(err)

    const { runPackageSelectionFlow } =
      await import('../../src/commands/run-package-selection-flow')
    await runPackageSelectionFlow(buildOptions())

    expect(findLoggedLine('Package details')).to.equal(false)
  })
})
