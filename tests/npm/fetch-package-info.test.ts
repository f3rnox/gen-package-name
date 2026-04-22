import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'

const packageJsonMock = vi.fn()

vi.mock('package-json', (): { default: typeof packageJsonMock } => ({
  default: packageJsonMock
}))

interface LookupError extends Error {
  statusCode?: number
}

const buildLookupError = (
  message: string,
  statusCode?: number
): LookupError => {
  const error: LookupError = new Error(message)
  if (typeof statusCode === 'number') {
    error.statusCode = statusCode
  }
  return error
}

describe('fetchPackageInfo', (): void => {
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach((): void => {
    logSpy = vi.spyOn(console, 'log').mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    packageJsonMock.mockReset()
    logSpy.mockRestore()
  })

  it('returns package metadata when the lookup succeeds', async (): Promise<void> => {
    const metadata = {
      name: 'chalk',
      version: '5.0.0',
      description: 'Terminal styling',
      homepage: 'https://example.com'
    }
    packageJsonMock.mockResolvedValueOnce(metadata)

    const { fetchPackageInfo } =
      await import('../../src/npm/fetch-package-info')
    const result = await fetchPackageInfo('chalk')

    expect(result).to.deep.equal(metadata)
    expect(packageJsonMock.mock.calls).to.have.length(1)
    expect(packageJsonMock.mock.calls[0][0]).to.equal('chalk')
    expect(packageJsonMock.mock.calls[0][1]).to.deep.equal({
      fullMetadata: true
    })
  })

  it('returns null when the package is missing', async (): Promise<void> => {
    packageJsonMock.mockRejectedValueOnce(buildLookupError('not found', 404))

    const { fetchPackageInfo } =
      await import('../../src/npm/fetch-package-info')
    const result = await fetchPackageInfo('free-pkg')

    expect(result).to.equal(null)
  })

  it('returns null when the package has incomplete metadata', async (): Promise<void> => {
    packageJsonMock.mockRejectedValueOnce(
      new TypeError("Cannot read properties of undefined (reading 'latest')")
    )

    const { fetchPackageInfo } =
      await import('../../src/npm/fetch-package-info')
    const result = await fetchPackageInfo('incomplete-pkg')

    expect(result).to.equal(null)
  })

  it('rethrows unexpected errors', async (): Promise<void> => {
    packageJsonMock.mockRejectedValueOnce(new Error('network down'))

    const { fetchPackageInfo } =
      await import('../../src/npm/fetch-package-info')

    let caught: unknown = null
    try {
      await fetchPackageInfo('flaky-pkg')
    } catch (error: unknown) {
      caught = error
    }

    expect(caught).to.be.instanceOf(Error)
    expect((caught as Error).message).to.equal('network down')
  })
})
