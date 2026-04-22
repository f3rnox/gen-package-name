import { describe, it } from 'vitest'
import { expect } from 'chai'

import { isPackageMissingError } from '../../src/npm/is-package-missing-error'

interface LookupError extends Error {
  statusCode?: number
}

const buildError = (message: string, statusCode?: number): LookupError => {
  const error: LookupError = new Error(message)
  if (typeof statusCode === 'number') {
    error.statusCode = statusCode
  }
  return error
}

describe('isPackageMissingError', (): void => {
  it('returns true when statusCode is 404', (): void => {
    expect(isPackageMissingError(buildError('whatever', 404))).to.equal(true)
  })

  it('returns true when message mentions "could not be found"', (): void => {
    expect(
      isPackageMissingError(new Error('Package could not be found'))
    ).to.equal(true)
  })

  it('returns true when message mentions "not found"', (): void => {
    expect(isPackageMissingError(new Error('Package NOT FOUND'))).to.equal(true)
  })

  it('returns false for unrelated errors', (): void => {
    expect(isPackageMissingError(new Error('random failure'))).to.equal(false)
  })

  it('returns false for errors with unrelated statusCode', (): void => {
    expect(isPackageMissingError(buildError('server error', 500))).to.equal(
      false
    )
  })

  it('returns false for non-Error values', (): void => {
    expect(isPackageMissingError(null)).to.equal(false)
    expect(isPackageMissingError(undefined)).to.equal(false)
    expect(isPackageMissingError('not found')).to.equal(false)
    expect(isPackageMissingError({ statusCode: 404 })).to.equal(false)
    expect(isPackageMissingError(42)).to.equal(false)
  })
})
