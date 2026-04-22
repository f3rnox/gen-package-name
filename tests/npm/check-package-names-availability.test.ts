import { afterEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'

import { checkPackageNamesAvailability } from '../../src/npm/check-package-names-availability'

const mockResponse = (status: number): Response =>
  ({
    status,
    statusText: '',
    ok: status >= 200 && status < 300
  }) as Response

describe('checkPackageNamesAvailability', (): void => {
  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('returns a map of names to availability booleans', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (input: RequestInfo | URL): Promise<Response> => {
        const url: string = typeof input === 'string' ? input : input.toString()
        if (url.endsWith('/taken')) {
          return mockResponse(200)
        }
        return mockResponse(404)
      }
    )

    const result: Map<string, boolean> = await checkPackageNamesAvailability([
      'available-pkg',
      'taken',
      'another-free'
    ])

    expect(result).to.be.instanceOf(Map)
    expect(result.size).to.equal(3)
    expect(result.get('available-pkg')).to.equal(true)
    expect(result.get('taken')).to.equal(false)
    expect(result.get('another-free')).to.equal(true)
  })

  it('returns an empty map when given an empty list', async (): Promise<void> => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')

    const result: Map<string, boolean> = await checkPackageNamesAvailability([])

    expect(result.size).to.equal(0)
    expect(fetchSpy.mock.calls).to.have.length(0)
  })

  it('issues one HEAD request per package name', async (): Promise<void> => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(mockResponse(404))

    await checkPackageNamesAvailability(['a', 'b', 'c'])

    expect(fetchSpy.mock.calls).to.have.length(3)
  })
})
