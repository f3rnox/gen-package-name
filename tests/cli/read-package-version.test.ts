import { describe, it } from 'vitest'
import { expect } from 'chai'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { readPackageVersion } from '../../src/cli/read-package-version'

interface PackageJsonShape {
  version: string
}

describe('readPackageVersion', (): void => {
  it('returns the version from the repository package.json', (): void => {
    const expected: string = (
      JSON.parse(
        readFileSync(resolve(__dirname, '..', '..', 'package.json'), 'utf8')
      ) as PackageJsonShape
    ).version

    expect(readPackageVersion()).to.equal(expected)
  })

  it('returns a non-empty semver-like string', (): void => {
    const version: string = readPackageVersion()
    expect(version)
      .to.be.a('string')
      .and.match(/^\d+\.\d+\.\d+/)
  })
})
