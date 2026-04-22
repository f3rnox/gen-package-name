import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import type { CliOptions } from '../../src/cli/cli-options'
import { runNonInteractiveFlow } from '../../src/commands/run-non-interactive-flow'

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
  nonInteractive: true,
  check: null,
  info: null,
  color: false,
  ...overrides
})

describe('runNonInteractiveFlow', (): void => {
  const originalLevel: ChalkInstance['level'] = chalk.level
  let logSpy: ReturnType<typeof vi.spyOn>

  beforeEach((): void => {
    chalk.level = 0
    logSpy = vi.spyOn(console, 'log').mockImplementation((): void => undefined)
  })

  afterEach((): void => {
    chalk.level = originalLevel
    vi.restoreAllMocks()
  })

  it('returns 0 and prints generated names in text mode', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    const exitCode: number = await runNonInteractiveFlow(buildOptions())

    expect(exitCode).to.equal(0)
    expect(logSpy.mock.calls.length).to.equal(3)
    for (const call of logSpy.mock.calls) {
      expect(String(call[0])).to.match(/^available\s/)
    }
  })

  it('returns 0 and prints JSON when json option is set', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    const exitCode: number = await runNonInteractiveFlow(
      buildOptions({ count: 2, json: true })
    )

    expect(exitCode).to.equal(0)
    expect(logSpy.mock.calls).to.have.length(1)
    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string) as {
      name: string
      available: boolean
    }[]
    expect(parsed).to.have.length(2)
    expect(parsed.every((entry): boolean => entry.available === true)).to.equal(
      true
    )
  })

  it('filters out taken names when availableOnly is set', async (): Promise<void> => {
    let callCount = 0
    vi.spyOn(globalThis, 'fetch').mockImplementation(
      async (): Promise<Response> => {
        callCount += 1
        return mockResponse(callCount % 2 === 0 ? 200 : 404)
      }
    )

    const exitCode: number = await runNonInteractiveFlow(
      buildOptions({ count: 4, availableOnly: true, json: true })
    )

    expect(exitCode).to.equal(0)
    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string) as {
      available: boolean
    }[]
    expect(parsed.every((entry): boolean => entry.available === true)).to.equal(
      true
    )
  })

  it('returns 1 when availableOnly is set and no names are available', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(200))

    const exitCode: number = await runNonInteractiveFlow(
      buildOptions({ count: 3, availableOnly: true, json: true })
    )

    expect(exitCode).to.equal(1)
    expect(JSON.parse(logSpy.mock.calls[0][0] as string)).to.deep.equal([])
  })

  it('uses provided keywords when generating names', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    const exitCode: number = await runNonInteractiveFlow(
      buildOptions({ count: 15, keywords: ['http', 'client'], json: true })
    )

    expect(exitCode).to.equal(0)
    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string) as {
      name: string
    }[]
    expect(
      parsed.some((entry): boolean =>
        entry.name
          .split('-')
          .some((part: string): boolean => ['http', 'client'].includes(part))
      )
    ).to.equal(true)
  })
})
