import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import type { CliOptions } from '../../src/types'
import {
  EXIT_PACKAGE_SELECTION,
  REGENERATE_PACKAGE_SET
} from '../../src/generator/constants'

const promptMock = vi.fn()

vi.mock('inquirer', (): { default: { prompt: typeof promptMock } } => ({
  default: { prompt: promptMock }
}))

const mockResponse = (status: number): Response =>
  ({
    status,
    statusText: '',
    ok: status >= 200 && status < 300
  }) as Response

const buildOptions = (overrides: Partial<CliOptions> = {}): CliOptions => ({
  description: null,
  keywords: null,
  count: 3,
  availableOnly: false,
  json: false,
  nonInteractive: false,
  check: null,
  info: null,
  color: false,
  ...overrides
})

describe('selectPackageName', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level

  beforeEach((): void => {
    chalk.level = 0
    vi.spyOn(console, 'log').mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    chalk.level = originalLevel
    vi.restoreAllMocks()
    promptMock.mockReset()
  })

  it('returns the selected package and availability', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    let capturedChoices: { value: string }[] = []
    promptMock.mockImplementationOnce(
      async (
        questions: { choices: { value: string }[] }[]
      ): Promise<{ selectedPackage: string }> => {
        capturedChoices = questions[0].choices
        return { selectedPackage: capturedChoices[0].value }
      }
    )

    const { selectPackageName } =
      await import('../../src/commands/select-package-name')
    const result = await selectPackageName(buildOptions({ keywords: ['http'] }))

    expect(result).to.not.equal(null)
    expect(result?.name).to.equal(capturedChoices[0].value)
    expect(result?.isAvailable).to.equal(true)
  })

  it('returns null when the user selects exit', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))
    promptMock.mockResolvedValueOnce({
      selectedPackage: EXIT_PACKAGE_SELECTION
    })

    const { selectPackageName } =
      await import('../../src/commands/select-package-name')
    const result = await selectPackageName(buildOptions({ keywords: ['a'] }))

    expect(result).to.equal(null)
  })

  it('regenerates when the user picks regenerate and then accepts a name', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(200))

    let secondChoices: { value: string }[] = []
    promptMock
      .mockResolvedValueOnce({ selectedPackage: REGENERATE_PACKAGE_SET })
      .mockImplementationOnce(
        async (
          questions: { choices: { value: string }[] }[]
        ): Promise<{ selectedPackage: string }> => {
          secondChoices = questions[0].choices
          return { selectedPackage: secondChoices[0].value }
        }
      )

    const { selectPackageName } =
      await import('../../src/commands/select-package-name')
    const result = await selectPackageName(buildOptions({ keywords: ['x'] }))

    expect(result).to.not.equal(null)
    expect(result?.isAvailable).to.equal(false)
    expect(promptMock.mock.calls).to.have.length(2)
  })

  it('returns null when prompt is exited via ExitPromptError', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))
    const exitError: Error = new Error('exit')
    exitError.name = 'ExitPromptError'
    promptMock.mockRejectedValueOnce(exitError)

    const { selectPackageName } =
      await import('../../src/commands/select-package-name')
    const result = await selectPackageName(buildOptions({ keywords: ['a'] }))

    expect(result).to.equal(null)
  })

  it('rethrows unexpected prompt errors', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))
    promptMock.mockRejectedValueOnce(new Error('boom'))

    const { selectPackageName } =
      await import('../../src/commands/select-package-name')

    let caught: unknown = null
    try {
      await selectPackageName(buildOptions({ keywords: ['a'] }))
    } catch (error: unknown) {
      caught = error
    }

    expect(caught).to.be.instanceOf(Error)
    expect((caught as Error).message).to.equal('boom')
  })

  it('prompts for a description when no keywords or description are given', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    promptMock
      .mockResolvedValueOnce({ description: 'parse json streams' })
      .mockImplementationOnce(
        async (
          questions: { choices: { value: string }[] }[]
        ): Promise<{ selectedPackage: string }> => ({
          selectedPackage: questions[0].choices[0].value
        })
      )

    const { selectPackageName } =
      await import('../../src/commands/select-package-name')
    const result = await selectPackageName(buildOptions())

    expect(result).to.not.equal(null)
    expect(promptMock.mock.calls).to.have.length(2)
    expect(promptMock.mock.calls[0][0][0].name).to.equal('description')
  })
})
