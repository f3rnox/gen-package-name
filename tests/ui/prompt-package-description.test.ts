import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'

const promptMock = vi.fn()

vi.mock('inquirer', (): { default: { prompt: typeof promptMock } } => ({
  default: { prompt: promptMock }
}))

describe('promptPackageDescription', (): void => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach((): void => {
    logSpy = vi.spyOn(console, 'log').mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    promptMock.mockReset()
    logSpy.mockRestore()
  })

  it('returns preset value trimmed when provided', async (): Promise<void> => {
    const { promptPackageDescription } =
      await import('../../src/ui/prompt-package-description')
    const result: string = await promptPackageDescription('  preset text  ')

    expect(result).to.equal('preset text')
    expect(promptMock.mock.calls).to.have.length(0)
  })

  it('uses the inquirer prompt when no preset is given', async (): Promise<void> => {
    promptMock.mockResolvedValueOnce({ description: '  parse json  ' })

    const { promptPackageDescription } =
      await import('../../src/ui/prompt-package-description')
    const result: string = await promptPackageDescription()

    expect(result).to.equal('parse json')
    expect(promptMock.mock.calls).to.have.length(1)
  })

  it('returns an empty string when the user exits the prompt', async (): Promise<void> => {
    const exitError: Error = new Error('user exit')
    exitError.name = 'ExitPromptError'
    promptMock.mockRejectedValueOnce(exitError)

    const { promptPackageDescription } =
      await import('../../src/ui/prompt-package-description')
    const result: string = await promptPackageDescription(null)

    expect(result).to.equal('')
  })

  it('rethrows unexpected errors', async (): Promise<void> => {
    promptMock.mockRejectedValueOnce(new Error('boom'))

    const { promptPackageDescription } =
      await import('../../src/ui/prompt-package-description')

    let caught: unknown = null
    try {
      await promptPackageDescription(null)
    } catch (error: unknown) {
      caught = error
    }

    expect(caught).to.be.instanceOf(Error)
    expect((caught as Error).message).to.equal('boom')
  })
})
