import { afterEach, beforeEach, describe, it, vi } from 'vitest'
import { expect } from 'chai'
import chalk, { type ChalkInstance } from 'chalk'

import { runCheckCommand } from '../../src/commands/run-check-command'

const mockResponse = (status: number): Response =>
  ({
    status,
    statusText: '',
    ok: status >= 200 && status < 300
  }) as Response

describe('runCheckCommand', (): void => {
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

  it('returns 0 and logs availability in text mode when the name is free', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    const code: number = await runCheckCommand('free-pkg', false)

    expect(code).to.equal(0)
    expect(logSpy.mock.calls).to.have.length(1)
    expect(logSpy.mock.calls[0][0]).to.equal('free-pkg is available')
  })

  it('returns 1 and logs taken status in text mode when the name is taken', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(200))

    const code: number = await runCheckCommand('chalk', false)

    expect(code).to.equal(1)
    expect(logSpy.mock.calls[0][0]).to.equal('chalk is taken')
  })

  it('emits JSON when asJson is true and the name is available', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(404))

    const code: number = await runCheckCommand('free-pkg', true)

    expect(code).to.equal(0)
    expect(JSON.parse(logSpy.mock.calls[0][0] as string)).to.deep.equal({
      name: 'free-pkg',
      available: true
    })
  })

  it('emits JSON when asJson is true and the name is taken', async (): Promise<void> => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(200))

    const code: number = await runCheckCommand('chalk', true)

    expect(code).to.equal(1)
    expect(JSON.parse(logSpy.mock.calls[0][0] as string)).to.deep.equal({
      name: 'chalk',
      available: false
    })
  })
})
