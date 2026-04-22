import { afterEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'

import { checkPackageAvailability } from '../../src/npm/check-package-availability'

const mockFetchResponse = (init: {
  status: number
  statusText?: string
  ok?: boolean
}): Response =>
  ({
    status: init.status,
    statusText: init.statusText ?? '',
    ok: init.ok ?? (init.status >= 200 && init.status < 300)
  }) as Response

describe('checkPackageAvailability', (): void => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('returns true when the registry responds with 404', async (): Promise<void> => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockFetchResponse({ status: 404 }))

    const result: boolean = await checkPackageAvailability('my-new-package')
    expect(result).to.equal(true)
    expect(fetchSpy.mock.calls).to.have.length(1)
    expect(fetchSpy.mock.calls[0][0]).to.equal(
      'https://registry.npmjs.org/my-new-package'
    )
    expect(fetchSpy.mock.calls[0][1]).to.deep.equal({ method: 'HEAD' })
  })

  it('returns false when the registry responds with 200', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockFetchResponse({ status: 200 })
    )

    const result: boolean = await checkPackageAvailability('chalk')
    expect(result).to.equal(false)
  })

  it('url-encodes scoped package names', async (): Promise<void> => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockFetchResponse({ status: 404 }))

    await checkPackageAvailability('@scope/pkg')

    expect(fetchSpy.mock.calls[0][0]).to.equal(
      'https://registry.npmjs.org/%40scope%2Fpkg'
    )
  })

  it('throws on unexpected non-ok responses', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockFetchResponse({
        status: 500,
        statusText: 'Internal Server Error',
        ok: false
      })
    )

    let caught: unknown = null
    try {
      await checkPackageAvailability('weird-pkg')
    } catch (error: unknown) {
      caught = error
    }

    expect(caught).to.be.instanceOf(Error)
    expect((caught as Error).message).to.include(
      'Unexpected npm registry response for "weird-pkg"'
    )
    expect((caught as Error).message).to.include('500')
    expect((caught as Error).message).to.include('Internal Server Error')
  })
})
